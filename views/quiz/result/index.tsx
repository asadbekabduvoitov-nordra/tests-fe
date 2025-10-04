"use client"

import { useQuizCache } from "@/services/quiz";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
    CheckCircle,
    XCircle,
    Trophy,
    RotateCcw,
    Home,
} from "lucide-react";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import { cn, formatTime, TEST_MIN } from "@/lib/utils";
import { Loading } from "../loading";
import { ErrorComponent } from "../error";

export const Result = () => {
    const {
        tests: { data: tests, isLoading, isError },
        quiz: { data: quiz },
    } = useQuizCache();
    const { telegram_id, quiz_id } = useParams();

    const correctAnswers = useMemo(() => {
        return tests?.filter((t) => t.selectedOption?.variant === t.correct_answer).length || 0;
    }, [tests]);

      const testDuration = useMemo(()=>{
            return (quiz?.time ?? TEST_MIN) * 60;
        },[quiz])

    const scorePercentage = useMemo(() => {
        return tests?.length ? (correctAnswers / tests?.length) * 100 : 0;
    }, [correctAnswers, tests]);

    const totalScore = useMemo(() => correctAnswers * 2, [correctAnswers]);

    const categoryMessage = useMemo(() => {
        if (totalScore < 60) {
            return "Afsuski, siz testdan o'ta olmadingiz.";
        }
        if (totalScore >= 60 && totalScore <= 68) {
            return "Tabriklaymiz siz 2- toifaga o'tdingiz.";
        }
        if (totalScore >= 70 && totalScore <= 78) {
            return "Tabriklaymiz siz 1- toifaga o'tdingiz.";
        }
        if (totalScore >= 80 && totalScore <= 100) {
            return "Tabriklaymiz siz OLIY TOIFA va 70 foizlik ustama sohibi bo'ldingiz.";
        }
        return "";
    }, [totalScore]);


    if (isLoading) {
        return <Loading />
    }

    if (isError) {
        return <ErrorComponent />
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-slate-900 dark:via-indigo-900/20 dark:to-slate-900 p-4">
            <motion.div
                initial="hidden"
                animate="visible"
                className="max-w-4xl mx-auto"
            >
                {/* Header Card */}
                <motion.div className="mb-8">
                    <Card className="backdrop-blur-xl bg-white/70 dark:bg-slate-800/70 border-0 shadow-2xl">
                        <CardContent className="p-8 text-center">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                                className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-full mb-6"
                            >
                                <Trophy className="w-10 h-10 text-white" />
                            </motion.div>

                            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent mb-4">
                                Test Yakunlandi!
                            </h1>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 rounded-xl p-6">
                                    <div className="text-3xl font-bold text-green-700 mb-2">
                                        {correctAnswers}/{tests?.length}
                                    </div>
                                    <div className="text-sm text-green-600 dark:text-green-300">
                                        To'g'ri Javoblar
                                    </div>
                                </div>

                                <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-xl p-6">
                                    <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                                        {scorePercentage.toFixed(0)}%
                                    </div>
                                    <div className="text-sm text-blue-600 dark:text-blue-300">
                                        Ball
                                    </div>
                                </div>

                                <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 rounded-xl p-6">
                                    <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                                        {formatTime(testDuration - (quiz?.timeRemaining || 0))}
                                    </div>
                                    <div className="text-sm text-purple-600 dark:text-purple-300">
                                        Sarflangan Vaqt
                                    </div>
                                </div>
                            </div>

                            <Progress value={scorePercentage} className="h-3 mb-6" />

                            <div className="w-full mb-8">
                                <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 rounded-xl p-6">
                                    <div className="text-sm text-purple-600 dark:text-purple-300">
                                        {categoryMessage}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Questions Review */}
                <motion.div className="mb-8">
                    <Card className="backdrop-blur-xl bg-white/70 dark:bg-slate-800/70 border-0 shadow-xl">
                        <CardHeader>
                            <CardTitle className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                                Savollarni Ko'rib Chiqish
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="space-y-4">
                                {tests?.map((t, index) => {
                                    const isCorrect = t.selectedOption?.variant === t.correct_answer;

                                    return (
                                        <motion.div
                                            key={t.id}
                                            className={cn("p-4 rounded-xl border-2", {
                                                "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-700": isCorrect,
                                                "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-700": !isCorrect,
                                            })}
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center space-x-3 mb-2">
                                                        <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                                                            Savol {index + 1}
                                                        </span>
                                                        {isCorrect ? (
                                                            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                                                        ) : (
                                                            <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                                                        )}
                                                    </div>
                                                    <div className="mb-3">
                                                        <article
                                    className="prose prose-lg dark:prose-invert"
                                    dangerouslySetInnerHTML={{ __html: t?.title || "Loading..." }}
                                />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <div
                                                            className={cn("text-sm", {
                                                                "text-green-700 dark:text-green-300": isCorrect,
                                                                "text-red-700 dark:text-red-300": !isCorrect,
                                                            })}
                                                        >
                                                            <strong>Sizning javobingiz:</strong>{" "}
                                                            {t.selectedOption?.variant}
                                                        </div>
                                                        {!isCorrect && (
                                                            <div className="text-sm text-green-700 dark:text-green-300">
                                                                <strong>To'g'ri javob:</strong> {t.correct_answer}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                    className="flex flex-col sm:flex-row gap-4 justify-center"
                >
                    <Button
                        onClick={() => window.location.href = `/${telegram_id}/${quiz_id}`}
                        size="lg"
                        className="bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700 text-white px-8 py-4 text-lg font-semibold rounded-xl"
                    >
                        <RotateCcw className="w-5 h-5 mr-2" />
                        Testni Qayta Topshirish
                    </Button>

                    <Button
                        size="lg"
                        variant="outline"
                        className="px-8 py-4 text-lg font-semibold rounded-xl bg-white/50 dark:bg-slate-700/50 backdrop-blur-sm"
                        onClick={() => window.close()}
                    >
                        <Home className="w-5 h-5 mr-2" />
                        Bosh Sahifaga Qaytish
                    </Button>
                </motion.div>
            </motion.div>
        </div>
    )
}