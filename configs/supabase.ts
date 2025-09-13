import { Database } from "@/database.types";
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient<Database>(
	String(process.env.NEXT_PUBLIC_SUPABASE_URL),
	String(process.env.NEXT_PUBLIC_SUPABASE_KEY),
);