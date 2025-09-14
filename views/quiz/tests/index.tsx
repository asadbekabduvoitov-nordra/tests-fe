"use client"

import { useQuizCache } from "@/services/quiz";
import { Loading } from "../loading";
import { ErrorComponent } from "../error";
import { useState, useMemo, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useParams, useRouter } from "next/navigation";
import { Clock, CheckCircle, XCircle } from "lucide-react";
import { cn, formatTime } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import { TQuiz, TTest } from "@/types/quiz";
import { TEST_DURATION } from "@/lib/utils";

export const Tests = () => {
    const queryClient = useQueryClient();
    const { push } = useRouter()
    const { quiz_id, telegram_id } = useParams();
    const {
        tests: { data: tests, isLoading, isError },
    } = useQuizCache();

    const [timeRemaining, setTimeRemaining] = useState(TEST_DURATION);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

    const progress = useMemo(() => {
        return ((currentQuestionIndex + 1) / Number(tests?.length)) * 100
    }, [currentQuestionIndex, tests]);

    const goToQuestion = useCallback((index: number) => {
        setCurrentQuestionIndex(index);
    }, []);

    const isCompleted = useMemo(() => {
        return tests?.every((t) => Boolean(t.selectedOption));
    }, [tests]);

    const currentSelectedQuestion = useMemo(() => {
        return tests?.[currentQuestionIndex]
    }, [currentQuestionIndex, tests]);

    const handleOptionSelect = useCallback((
        selectedVariant: TTest["options"][number]
    ) => {
        if (currentSelectedQuestion?.selectedOption) return;

        queryClient.setQueryData<TTest[]>([`tests/${quiz_id}`], (prev) => {
            if (!prev) return prev;
            return prev?.map((test) => {
                if (currentSelectedQuestion?.id === test.id) {
                    return {
                        ...test,
                        selectedOption: selectedVariant,
                    };
                }
                return test;
            });
        });
    }, [currentSelectedQuestion, quiz_id]);

    const handleNextQuestion = useCallback(() => {
        setCurrentQuestionIndex((prev) => prev + 1);
    }, []);

    const handleQuizComplete = useCallback(() => {
        push(`/${telegram_id}/${quiz_id}/results`);

        queryClient.setQueryData<TQuiz>([`quiz/${quiz_id}`], (prev) => {
            if (!prev) return;

            return {
                ...prev,
                timeRemaining
            };
        });
    }, [timeRemaining]);

    // Timer effect
    useEffect(() => {
        if (timeRemaining > 0 && !isCompleted) {
            const timer = setTimeout(() => {
                setTimeRemaining((prev) => Math.max(0, prev - 1));
            }, 1000);
            return () => clearTimeout(timer);
        } else if (timeRemaining === 0) {
            handleQuizComplete();
        }
    }, [timeRemaining, isCompleted]);

    if (isLoading) {
        return <Loading />
    }

    if (isError) {
        return <ErrorComponent />
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-slate-900 dark:via-indigo-900/20 dark:to-slate-900 p-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6"
                >
                    <Card className="backdrop-blur-xl bg-white/70 dark:bg-slate-800/70 border-0 shadow-lg">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center space-x-4">
                                    <Clock className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                                    <span className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">
                                        {formatTime(timeRemaining)}
                                    </span>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm text-slate-600 dark:text-slate-300">
                                        Savol
                                    </div>
                                    <div className="text-xl font-bold text-slate-900 dark:text-slate-100">
                                        {currentQuestionIndex + 1} / {tests?.length || 0}
                                    </div>
                                </div>
                            </div>
                            <Progress value={progress} className="h-2" />
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Question Card */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentQuestionIndex}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Card className="backdrop-blur-xl bg-white/70 dark:bg-slate-800/70 border-0 shadow-xl mb-6">
                            <CardContent className="p-8">
                                <article
                                    className="prose prose-lg dark:prose-invert"
                                    dangerouslySetInnerHTML={{ __html: currentSelectedQuestion?.title || "Loading..." }}
                                />

                                <div className="space-y-4">
                                    {currentSelectedQuestion?.options?.map((option, index) => {
                                        const isSelected =
                                            option?.variant === currentSelectedQuestion?.selectedOption?.variant;
                                        const isCorrect =
                                            option?.variant === currentSelectedQuestion?.correct_answer;
                                        const hasAnswered = !!currentSelectedQuestion?.selectedOption;

                                        return (
                                            <motion.button
                                                key={index}
                                                whileHover={{ scale: hasAnswered ? 1 : 1.02 }}
                                                whileTap={{ scale: hasAnswered ? 1 : 0.98 }}
                                                onClick={() => handleOptionSelect(option)}
                                                disabled={hasAnswered}
                                                className={cn(
                                                    "w-full p-6 text-left rounded-xl border-2 transition-all duration-300",
                                                    {
                                                        // after user selects
                                                        "bg-green-100 border-green-500 text-green-800 dark:bg-green-900/30 dark:border-green-400 dark:text-green-200":
                                                            hasAnswered && isCorrect,
                                                        "bg-red-100 border-red-500 text-red-800 dark:bg-red-900/30 dark:border-red-400 dark:text-red-200":
                                                            hasAnswered && isSelected && !isCorrect,
                                                        "bg-slate-50 border-slate-200 text-slate-600 dark:bg-slate-700/50 dark:border-slate-600 dark:text-slate-300":
                                                            hasAnswered && !isSelected && !isCorrect,

                                                        // before user selects
                                                        "bg-white border-slate-200 text-slate-700 hover:bg-indigo-50 hover:border-indigo-300 dark:bg-slate-700/30 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-indigo-900/20":
                                                            !hasAnswered,
                                                    }
                                                )}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <span className="text-lg">{option?.label}</span>
                                                    {hasAnswered && (
                                                        <div>
                                                            {/* Show check on correct option */}
                                                            {isCorrect && (
                                                                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                                                            )}
                                                            {/* Show X only if selected but wrong */}
                                                            {isSelected && !isCorrect && (
                                                                <XCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </motion.button>
                                        );
                                    })}
                                </div>

                                {currentSelectedQuestion?.selectedOption && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="mt-8"
                                    >
                                        <Button
                                            onClick={() => {
                                                if (isCompleted && currentQuestionIndex == Number(tests?.length) - 1) {
                                                    return handleQuizComplete();
                                                }

                                                handleNextQuestion();
                                            }}
                                            size="lg"
                                            className="w-full bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700 text-white py-4 text-lg font-semibold rounded-xl"
                                            disabled={!isCompleted && currentQuestionIndex == Number(tests?.length) - 1}
                                        >
                                            {currentQuestionIndex < Number(tests?.length) - 1
                                                ? "Keyingi Savol"
                                                : "Testni Tugatish"}
                                        </Button>
                                    </motion.div>
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>
                </AnimatePresence>

                {/* Question Navigation */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <Card className="backdrop-blur-xl bg-white/70 dark:bg-slate-800/70 border-0 shadow-lg">
                        <CardContent className="p-6">
                            <div className="flex flex-wrap gap-2 justify-center">
                                {tests?.map((test, index) => {
                                    let buttonClass =
                                        "w-10 h-10 rounded-lg font-semibold transition-all duration-200 ";

                                    if (test.selectedOption) {
                                        if (test.selectedOption.variant === test.correct_answer) {
                                            buttonClass += "bg-green-500 text-white";
                                        } else {
                                            buttonClass += "bg-red-500 text-white";
                                        }
                                    } else if (index === currentQuestionIndex) {
                                        buttonClass += "bg-indigo-500 text-white";
                                    } else {
                                        buttonClass +=
                                            "bg-slate-200 text-slate-600 hover:bg-slate-300 dark:bg-slate-600 dark:text-slate-300 dark:hover:bg-slate-500";
                                    }

                                    return (
                                        <motion.button
                                            key={index}
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => goToQuestion(index)}
                                            className={buttonClass}
                                        >
                                            {index + 1}
                                        </motion.button>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    )
}