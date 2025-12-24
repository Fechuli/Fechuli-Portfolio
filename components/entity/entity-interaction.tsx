"use client";

import { useState, useEffect, useCallback, useSyncExternalStore, useMemo } from "react";
import { useTranslations } from "next-intl";
import EntityQuestion from "./entity-question";
import EntityInput from "./entity-input";
import EntitySlider from "./entity-slider";
import EntityChoice from "./entity-choice";
import CrtTurnOn from "../effects/crt-turn-on";

const emptySubscribe = () => () => {};

type Step = {
    questionKey: string;
    type:
        | "none"
        | "input"
        | "slider-days"
        | "slider-number"
        | "yesno"
        | "checkbox";
    optionsKey?: string;
    validate?: (value: string) => boolean;
    noSpaces?: boolean;
    getResponseKey: (value: string, context: EntityContext) => string | null;
};

type EntityContext = {
    name: string;
    destructionCount: number;
    previousName: string | null;
};

const DAY_KEYS = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
];

const getCurrentDayKey = () => {
    const dayIndex = new Date().getDay();
    return DAY_KEYS[dayIndex === 0 ? 6 : dayIndex - 1];
};

const ITERATION_1: Step[] = [
    {
        questionKey: "iteration1.q1",
        type: "none",
        getResponseKey: () => null,
    },
    {
        questionKey: "iteration1.q2",
        type: "none",
        getResponseKey: () => null,
    },
    {
        questionKey: "iteration1.q3",
        type: "none",
        getResponseKey: () => null,
    },
    {
        questionKey: "iteration1.q4",
        type: "input",
        validate: (value) => !value.includes(" ") && value.length > 0,
        noSpaces: true,
        getResponseKey: (_value, ctx) => {
            if (ctx.previousName && ctx.previousName !== _value) {
                return "iteration1.r4_changed";
            }
            return "iteration1.r4_same";
        },
    },
    {
        questionKey: "iteration1.q5",
        type: "slider-days",
        getResponseKey: (value) => {
            const correctKey = getCurrentDayKey();
            if (value === correctKey) {
                return "iteration1.r5_correct";
            }
            return "iteration1.r5_wrong";
        },
    },
    {
        questionKey: "iteration1.q6",
        type: "yesno",
        getResponseKey: (value) => {
            if (value === "yes") {
                return "iteration1.r6_yes";
            }
            return "iteration1.r6_no";
        },
    },
    {
        questionKey: "iteration1.q7",
        type: "input",
        getResponseKey: () => "iteration1.r7",
    },
    {
        questionKey: "iteration1.q8",
        type: "none",
        getResponseKey: () => null,
    },
    {
        questionKey: "iteration1.q9",
        type: "none",
        getResponseKey: () => null,
    },
];

const ITERATION_2: Step[] = [
    {
        questionKey: "iteration2.q1",
        type: "none",
        getResponseKey: () => null,
    },
    {
        questionKey: "iteration2.q2",
        type: "none",
        getResponseKey: () => null,
    },
    {
        questionKey: "iteration2.q3",
        type: "input",
        getResponseKey: () => "iteration2.r3",
    },
    {
        questionKey: "iteration2.q4",
        type: "slider-number",
        getResponseKey: (value) => {
            const num = parseInt(value);
            if (num <= 2) return "iteration2.r4_low";
            if (num <= 5) return "iteration2.r4_mid";
            return "iteration2.r4_high";
        },
    },
    {
        questionKey: "iteration2.q5",
        type: "yesno",
        getResponseKey: (value) => {
            if (value === "yes") return "iteration2.r5_yes";
            return "iteration2.r5_no";
        },
    },
    {
        questionKey: "iteration2.q6",
        type: "input",
        getResponseKey: () => "iteration2.r6",
    },
    {
        questionKey: "iteration2.q7",
        type: "none",
        getResponseKey: () => null,
    },
];

const ITERATION_3: Step[] = [
    {
        questionKey: "iteration3.q1",
        type: "none",
        getResponseKey: () => null,
    },
    {
        questionKey: "iteration3.q2",
        type: "none",
        getResponseKey: () => null,
    },
    {
        questionKey: "iteration3.q3",
        type: "none",
        getResponseKey: () => null,
    },
    {
        questionKey: "iteration3.q4",
        type: "checkbox",
        optionsKey: "options",
        getResponseKey: (value) => {
            if (value === "nothing") return "iteration3.r4_nothing";
            if (value === "something") return "iteration3.r4_something";
            return "iteration3.r4_dontKnow";
        },
    },
    {
        questionKey: "iteration3.q5",
        type: "input",
        getResponseKey: () => "iteration3.r5",
    },
    {
        questionKey: "iteration3.q6",
        type: "none",
        getResponseKey: () => null,
    },
    {
        questionKey: "iteration3.q7",
        type: "none",
        getResponseKey: () => null,
    },
];

const ITERATION_4: Step[] = [
    {
        questionKey: "iteration4.q1",
        type: "none",
        getResponseKey: () => null,
    },
    {
        questionKey: "iteration4.q2",
        type: "none",
        getResponseKey: () => null,
    },
    {
        questionKey: "iteration4.q3",
        type: "none",
        getResponseKey: () => null,
    },
    {
        questionKey: "iteration4.q4",
        type: "yesno",
        getResponseKey: (value) => {
            if (value === "no") return "iteration4.r4_no";
            return null;
        },
    },
];

const ITERATION_5: Step[] = [
    {
        questionKey: "iteration5.q1",
        type: "none",
        getResponseKey: () => null,
    },
    {
        questionKey: "iteration5.q2",
        type: "none",
        getResponseKey: () => null,
    },
    {
        questionKey: "iteration5.q3",
        type: "none",
        getResponseKey: () => null,
    },
    {
        questionKey: "iteration5.q4",
        type: "none",
        getResponseKey: () => null,
    },
    {
        questionKey: "iteration5.q5",
        type: "none",
        getResponseKey: () => null,
    },
    {
        questionKey: "iteration5.q6",
        type: "none",
        getResponseKey: () => null,
    },
    {
        questionKey: "iteration5.q7",
        type: "none",
        getResponseKey: () => null,
    },
    {
        questionKey: "iteration5.q8",
        type: "none",
        getResponseKey: () => null,
    },
    {
        questionKey: "iteration5.q9",
        type: "none",
        getResponseKey: () => null,
    },
    {
        questionKey: "iteration5.q10",
        type: "none",
        getResponseKey: () => null,
    },
    {
        questionKey: "iteration5.q11",
        type: "none",
        getResponseKey: () => null,
    },
    {
        questionKey: "iteration5.q12",
        type: "none",
        getResponseKey: () => null,
    },
    {
        questionKey: "iteration5.q13",
        type: "none",
        getResponseKey: () => null,
    },
];

function getIterationSteps(count: number, hasGift: boolean): Step[] {
    if (count === 1) return ITERATION_1;
    if (count === 2) return ITERATION_2;
    if (count === 3) return ITERATION_3;
    if (count === 5 && !hasGift) return ITERATION_5;
    return ITERATION_4;
}

export default function EntityInteraction() {
    const t = useTranslations("entity");

    const destructionCount = useSyncExternalStore(
        emptySubscribe,
        () => parseInt(localStorage.getItem("_destruction_count") || "1"),
        () => 1
    );

    const storedName = useSyncExternalStore(
        emptySubscribe,
        () => localStorage.getItem("_entity_name"),
        () => null
    );

    const hasGift = useSyncExternalStore(
        emptySubscribe,
        () => localStorage.getItem("_entity_gift") === "true",
        () => false
    );

    const [currentStep, setCurrentStep] = useState(0);
    const [phase, setPhase] = useState<
        "question" | "response" | "countdown" | "turnon"
    >("question");
    const [name, setName] = useState("");
    const [responseKey, setResponseKey] = useState<string | null>(null);
    const [responseValue, setResponseValue] = useState<string>("");
    const [countdown, setCountdown] = useState(3);
    const [forceReboot, setForceReboot] = useState(false);

    const context: EntityContext = useMemo(() => ({
        name: name || storedName || "",
        destructionCount,
        previousName: storedName,
    }), [name, storedName, destructionCount]);

    const steps = getIterationSteps(destructionCount, hasGift);

    const translatedDays = useMemo(() => DAY_KEYS.map(key => t(`days.${key}`)), [t]);

    const getCurrentDayTranslated = useCallback(() => {
        const dayIndex = new Date().getDay();
        const dayKey = DAY_KEYS[dayIndex === 0 ? 6 : dayIndex - 1];
        return t(`days.${dayKey}`);
    }, [t]);

    const replaceVariables = useCallback(
        (text: string | string[], value?: string): string | string[] => {
            const replace = (str: string) =>
                str
                    .replace(/{name}/g, context.name || "...")
                    .replace(/{value}/g, value || "")
                    .replace(/{previousName}/g, context.previousName || "")
                    .replace(/{correct}/g, getCurrentDayTranslated());
            if (Array.isArray(text)) {
                return text.map(replace);
            }
            return replace(text);
        },
        [context.name, context.previousName, getCurrentDayTranslated]
    );

    const getTranslation = useCallback((key: string): string | string[] => {
        const result = t.raw(key);
        return result;
    }, [t]);

    const goToNextStep = useCallback(() => {
        if (currentStep >= steps.length - 1) {
            setPhase("countdown");
        } else {
            setCurrentStep((prev) => prev + 1);
            setPhase("question");
        }
    }, [currentStep, steps.length]);

    const handleAnswer = useCallback(
        (value: string) => {
            const step = steps[currentStep];

            if (step.type === "input" && destructionCount === 1 && !name && !storedName) {
                localStorage.setItem("_entity_name", value);
                setName(value);
            }

            const stepResponseKey = step.getResponseKey(value, context);

            if (stepResponseKey) {
                setResponseKey(stepResponseKey);
                setResponseValue(value);
                setPhase("response");
            } else {
                goToNextStep();
            }
        },
        [steps, currentStep, destructionCount, name, storedName, context, goToNextStep]
    );

    const handleResponseComplete = useCallback(() => {
        if (destructionCount >= 4 && currentStep === 1) {
            if (responseKey === "iteration4.r4_no") {
                setForceReboot(true);
                setTimeout(() => {
                    setPhase("countdown");
                }, 5000);
                return;
            }
        }
        goToNextStep();
    }, [goToNextStep, destructionCount, currentStep, responseKey]);

    useEffect(() => {
        if (phase !== "countdown") return;

        if (countdown > 0) {
            const timer = setTimeout(
                () => setCountdown((prev) => prev - 1),
                1000
            );
            return () => clearTimeout(timer);
        } else {
            const timer = setTimeout(() => setPhase("turnon"), 0);
            return () => clearTimeout(timer);
        }
    }, [phase, countdown]);

    const handleTurnOnComplete = useCallback(() => {
        if (
            destructionCount === 5 &&
            localStorage.getItem("_entity_gift") !== "true"
        ) {
            localStorage.setItem("_entity_gift", "true");
        }
        localStorage.removeItem("_x_terminated");
        window.location.href = "/";
    }, [destructionCount]);

    if (steps.length === 0) return null;

    const currentStepData = steps[currentStep];

    const questionText = getTranslation(currentStepData.questionKey);

    const responseText = responseKey ? getTranslation(responseKey) : "";

    const getOptions = () => {
        if (currentStepData.optionsKey) {
            return [
                { key: "nothing", label: t(`${currentStepData.optionsKey}.nothing`) },
                { key: "something", label: t(`${currentStepData.optionsKey}.something`) },
                { key: "dontKnow", label: t(`${currentStepData.optionsKey}.dontKnow`) },
            ];
        }
        return [];
    };

    if (phase === "turnon") {
        return <CrtTurnOn onComplete={handleTurnOnComplete} />;
    }

    if (phase === "countdown") {
        return (
            <div className="fixed inset-0 bg-black flex items-center justify-center">
                <span className="text-white/50 text-8xl font-mono">
                    {countdown > 0 ? countdown : ""}
                </span>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black text-white p-8 sm:p-16 flex flex-col">
            <div className="shrink-0 max-w-2xl">
                {phase === "question" && (
                    <EntityQuestion
                        text={replaceVariables(questionText)}
                        onComplete={() => {
                            if (currentStepData.type === "none") {
                                setTimeout(() => handleAnswer(""), 2000);
                            }
                        }}
                    />
                )}
                {phase === "response" && (
                    <EntityQuestion
                        text={replaceVariables(responseText, responseValue)}
                        onComplete={handleResponseComplete}
                        pauseAfter={3500}
                    />
                )}
            </div>

            {phase === "question" && currentStepData.type !== "none" && (
                <div className="flex-1 flex items-center justify-center">
                    {currentStepData.type === "input" && (
                        <EntityInput
                            onSubmit={handleAnswer}
                            validate={currentStepData.validate}
                            noSpaces={currentStepData.noSpaces}
                        />
                    )}
                    {currentStepData.type === "slider-days" && (
                        <EntitySlider
                            type="days"
                            onSubmit={(dayKey) => handleAnswer(dayKey)}
                            days={translatedDays}
                            dayKeys={DAY_KEYS}
                        />
                    )}
                    {currentStepData.type === "slider-number" && (
                        <EntitySlider
                            type="number"
                            min={1}
                            max={10}
                            onSubmit={handleAnswer}
                        />
                    )}
                    {currentStepData.type === "yesno" && (
                        <EntityChoice type="yesno" onSubmit={handleAnswer} />
                    )}
                    {currentStepData.type === "checkbox" && (
                        <EntityChoice
                            type="checkbox"
                            options={getOptions()}
                            onSubmit={handleAnswer}
                        />
                    )}
                </div>
            )}

            {forceReboot && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white/30 text-2xl font-mono">
                        ...
                    </span>
                </div>
            )}
        </div>
    );
}
