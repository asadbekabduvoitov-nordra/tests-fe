"use client";

import { useQuizCache } from "@/services/quiz";
import { Loading } from "./loading";
import { ErrorComponent } from "./error";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Play, FileText, Zap } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

export const Quiz = () => {
    const { quiz: { data: quiz, isLoading, isError } } = useQuizCache()
    const { push } = useRouter();
    const { telegram_id, quiz_id } = useParams()

    if (isLoading) {
        return <Loading />
    }

    if (isError) {
        return <ErrorComponent />
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-slate-900 dark:via-indigo-900/20 dark:to-slate-900 flex items-center justify-center p-4">
            <motion.div
                initial="hidden"
                animate="visible"
                className="w-full max-w-2xl"
            >
                <motion.div>
                    <Card className="backdrop-blur-xl bg-white/70 dark:bg-slate-800/70 border-0 shadow-2xl shadow-indigo-500/10 dark:shadow-indigo-500/20">
                        <CardContent className="p-8 sm:p-12">
                            {/* Header */}
                            <motion.div className="text-center mb-8">
                                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-2xl mb-6 shadow-lg">
                                    <Play className="w-10 h-10 text-white ml-1" />
                                </div>
                                <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent mb-4">
                                    {quiz?.title}
                                </h1>
                                {
                                    quiz?.description &&
                                    <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                                        {quiz?.description}
                                    </p>
                                }
                            </motion.div>

                            {/* Stats Grid */}
                            <motion.div className="grid grid-cols-2 gap-4 mb-8">
                                <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/30 dark:to-indigo-800/30 rounded-xl p-6 text-center">
                                    <FileText className="w-8 h-8 text-indigo-600 dark:text-indigo-400 mx-auto mb-2" />
                                    <div className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">
                                        {quiz?.tests?.length || 0}
                                    </div>
                                    <div className="text-sm text-indigo-600 dark:text-indigo-300">
                                        Testlar
                                    </div>
                                </div>
                                <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 dark:from-cyan-900/30 dark:to-cyan-800/30 rounded-xl p-6 text-center">
                                    <Clock className="w-8 h-8 text-cyan-600 dark:text-cyan-400 mx-auto mb-2" />
                                    <div className="text-2xl font-bold text-cyan-900 dark:text-cyan-100">
                                        15 daqiqa
                                    </div>
                                    <div className="text-sm text-cyan-600 dark:text-cyan-300">
                                        Vaqt
                                    </div>
                                </div>
                            </motion.div>

                            {/* Features */}
                            <motion.div className="space-y-3 mb-8">
                                <div className="flex items-center space-x-3 text-slate-600 dark:text-slate-300">
                                    <Zap className="w-5 h-5 text-yellow-500" />
                                    <span>Har bir javobga darhol fikr-mulohaza</span>
                                </div>
                                <div className="flex items-center space-x-3 text-slate-600 dark:text-slate-300">
                                    <Clock className="w-5 h-5 text-blue-500" />
                                    <span>Real vaqtda hisoblash taymer</span>
                                </div>
                                <div className="flex items-center space-x-3 text-slate-600 dark:text-slate-300">
                                    <FileText className="w-5 h-5 text-green-500" />
                                    <span>Batafsil natijalar va tushuntirishlar</span>
                                </div>
                            </motion.div>

                            {/* Start Button */}
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <Button
                                    onClick={() => push(`/${telegram_id}/${quiz_id}/test`)}
                                    size="lg"
                                    className="w-full bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700 text-white py-6 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                                >
                                    <Play className="w-5 h-5 mr-2" />
                                    Testni Boshlash
                                </Button>
                            </motion.div>
                        </CardContent>
                    </Card>
                </motion.div>
            </motion.div>
        </div>
    );
};