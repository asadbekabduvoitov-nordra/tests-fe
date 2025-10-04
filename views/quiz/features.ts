import { useMutation } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

export const useQuizFeatures = () => {
    const { telegram_id, quiz_id } = useParams();
    const { push } = useRouter();

    const checkPermission = useMutation({
        mutationFn: async () => {
            const response = await fetch("/api/permission-check", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    quizId: quiz_id,
                    telegramId: telegram_id,
                }),
            });
            const data = await response.json();

            if(!data?.success){
                throw new Error(data?.message);
            }

            return data;
        },
        onError: (error) => {
            toast.error("Hatolik yuz berdi.", {
                description: error?.message,
                position: "top-right"
            });
        },
        onSuccess: () => {
            push(`/${telegram_id}/${quiz_id}/test`)   
        }
    });

    return {
        checkPermission
    };
}