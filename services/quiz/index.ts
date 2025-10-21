import { supabase } from "@/configs/supabase";
import { TQuiz, TSubject, TTest } from "@/types/quiz";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

export const useQuizCache = () => {
  const { quiz_id } = useParams();

  const tests = useQuery({
    queryKey: [`tests/${quiz_id}`],
    queryFn: async () => {
      const { data } = await supabase.from("tests").select("*").eq("quiz_id", String(quiz_id)).order("order", { ascending: true });

      return data as TTest[];
    },
    enabled: !!quiz_id,
    staleTime: Infinity,
  });

  const quiz = useQuery({
    queryKey: [`quiz/${quiz_id}`],
    queryFn: async () => {
      const { data } = await supabase.from("quizzes").select("*, tests(id)").eq("id", String(quiz_id)).limit(1).single()

      return data as TQuiz;
    },
    enabled: !!quiz_id,
    staleTime: Infinity,
  });

  const subject = useQuery({
    queryKey: [`subject/${quiz_id}`],
    queryFn: async () => {
      const { data } = await supabase.from("subjects").select("*").eq("id", String(quiz?.data?.subject_id)).limit(1).single()

      return data as TSubject;
    },
    enabled: !!quiz?.data,
    staleTime: Infinity,
  });

  return { tests, quiz, subject };
};
