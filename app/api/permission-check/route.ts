// app/api/quiz-access/route.ts
import { NextResponse } from "next/server";
import { supabase } from "@/configs/supabase";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { quizId, telegramId } = body;

    if (!quizId || !telegramId) {
      return NextResponse.json(
        { success: false, message: "Missing quizId or telegramId" },
        { status: 400 }
      );
    }

    // 1. Find user by telegramId
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("telegram_id", telegramId)
      .single();

    if (userError || !user) {
      return NextResponse.json(
        { success: false, message: "Foydalanuvchi topilmadi." },
        { status: 404 }
      );
    }

    // 2. Find valid permission
    const { data: permission, error: permError } = await supabase
      .from("quiz_permissions")
      .select("*")
      .eq("user_id", user.id)
      .eq("status", "APPROVED")
      .gt("remaining_quiz_accesses", 0)
      .order("purchased_at", { ascending: false })
      .limit(1)
      .single();

    if (permError || !permission) {
      return NextResponse.json(
        { success: false, message: "Testga kirish uchun ruhsat berilmadi." },
        { status: 403 }
      );
    }

    // 3. Decrease remaining access
    const { error: updateError } = await supabase
      .from("quiz_permissions")
      .update({
        remaining_quiz_accesses: permission.remaining_quiz_accesses - 1,
      })
      .eq("id", permission.id);

    if (updateError) {
      return NextResponse.json(
        { success: false, message: "Serverda hatolik yuz berdi." },
        { status: 500 }
      );
    }

    // 4. Return success
    return NextResponse.json(
      {
        success: true,
        message: "Permission granted",
        data: {
          quizId,
          telegramId,
          userId: user.id,
        },
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Quiz access API error:", err);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}