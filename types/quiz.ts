import { Database } from "@/database.types";

export type TOption = { label: string; variant: string };

export type TTest = Database["public"]["Tables"]["tests"]["Row"] & {
  options: TOption[];
  selectedOption: TOption | null;
}
    
export type TQuiz = Database["public"]["Tables"]["quizzes"]["Row"] & {
  tests: TTest[];
  timeRemaining?: number;
}