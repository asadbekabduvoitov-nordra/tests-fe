
import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export const ErrorComponent = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-slate-900 dark:via-indigo-900/20 dark:to-slate-900 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center max-w-md"
            >
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl mb-6 shadow-lg">
                    <AlertCircle className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-2xl font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Xatolik yuz berdi
                </h2>
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                    Test yuklanmadi
                </p>
                <Button
                    onClick={() => window.location.reload()}
                    className="bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700"
                >
                    Qayta urinish
                </Button>
            </motion.div>
        </div>
    )
}