import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

export const Loading = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-slate-900 dark:via-indigo-900/20 dark:to-slate-900 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
            >
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-2xl mb-6 shadow-lg">
                    <Loader2 className="w-10 h-10 text-white animate-spin" />
                </div>
                <h2 className="text-2xl font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Test yuklanmoqda...
                </h2>
                <p className="text-slate-600 dark:text-slate-400">Iltimos, kuting</p>
            </motion.div>
        </div>
    )
}