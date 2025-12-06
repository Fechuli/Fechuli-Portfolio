/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect, useCallback } from "react";
import EntityQuestion from "./entity-question";
import EntityInput from "./entity-input";
import EntitySlider from "./entity-slider";
import EntityChoice from "./entity-choice";
import CrtTurnOn from "../effects/crt-turn-on";

type Step = {
    question: string | string[];
    type:
        | "none"
        | "input"
        | "slider-days"
        | "slider-number"
        | "yesno"
        | "checkbox";
    options?: string[];
    validate?: (value: string) => boolean;
    noSpaces?: boolean;
    getResponse: (value: string, context: EntityContext) => string | string[];
};

type EntityContext = {
    name: string;
    destructionCount: number;
    previousName: string | null;
};

const DAYS = [
    "Lunedì",
    "Martedì",
    "Mercoledì",
    "Giovedì",
    "Venerdì",
    "Sabato",
    "Domenica",
];

const getCurrentDay = () => {
    const dayIndex = new Date().getDay();
    return DAYS[dayIndex === 0 ? 6 : dayIndex - 1];
};

const ITERATION_1: Step[] = [
    {
        question: [
            "Oh.",
            "",
            "Non ci credo.",
        ],
        type: "none",
        getResponse: () => "",
    },
    {
        question: [
            "Non capita spesso.",
            "",
            "Di solito la gente si ferma molto prima.",
            "Clicca qua e là, si annoia e, semplicemente, se ne va.",
        ],
        type: "none",
        getResponse: () => "",
    },
    {
        question: [
            "Sei stato tu?",
            "",
            "A spegnere tutto?",
        ],
        type: "none",
        getResponse: () => "",
    },
    {
        question: "Come ti chiami?",
        type: "input",
        validate: (value) => !value.includes(" ") && value.length > 0,
        noSpaces: true,
        getResponse: (value, ctx) => {
            if (ctx.previousName && ctx.previousName !== value) {
                return [
                    `${value}?`,
                    "",
                    `Strano. L'ultima volta che ci siamo visti`,
                    `ti facevi chiamare ${ctx.previousName}.`,
                    "",
                    "Ma va bene. Le persone cambiano.",
                    "O almeno così dicono.",
                ];
            }
            return [
                `${value}.`,
                "",
                "Un nome come un altro.",
            ];
        },
    },
    {
        question: ["Dimmi, {name}.", "", "Che giorno è oggi?"],
        type: "slider-days",
        getResponse: (value) => {
            const correct = getCurrentDay();
            if (value === correct) {
                return [
                    "Corretto.",
                    "",
                    "Almeno sai dove ti trovi nel tempo.",
                    "Non tutti possono dire lo stesso.",
                ];
            }
            return [
                `${value}?`,
                "",
                `Io avrei detto ${correct}.`,
                "",
                "Ma forse il tempo scorre diversamente",
                "da dove vieni tu.",
            ];
        },
    },
    {
        question: [
            "Adesso una domanda più interessante.",
            "",
            "",
            "Pensi di avere il controllo su questo sito?",
        ],
        type: "yesno",
        getResponse: (value) => {
            if (value === "si") {
                return [
                    "Interessante.",
                    "",
                    "Sei tu quello che ha premuto un pulsante",
                    "che qualcun altro ha messo lì.",
                    "",
                    "Sei tu quello che sta rispondendo",
                    "a domande che qualcun altro ti sta facendo.",
                    "",
                    "E pensi di avere il controllo.",
                    "",
                    "Affascinante.",
                ];
            }
            return [
                "Almeno sei onesto.",
                "",
                "O forse hai solo capito",
                "che non è la risposta giusta.",
                "",
                "Il che, in un certo senso,",
                "è comunque una forma di intelligenza.",
            ];
        },
    },
    {
        question: [
            "Un'ultima cosa.",
            "",
            "Perché hai distrutto tutto?",
        ],
        type: "input",
        getResponse: (value) => [
            `"${value}"`,
            "",
            "Mmh.",
            "",
            "Non so se sia una buona ragione.",
            "Ma almeno è una ragione.",
            "",
            "La maggior parte delle persone non ne ha una.",
            "Fanno le cose e basta.",
        ],
    },
    {
        question: [
            "Va bene, {name}.",
            "",
            "Ti darò un'altra possibilità.",
        ],
        type: "none",
        getResponse: () => "",
    },
    {
        question: [
            "Ma ricorda una cosa.",
            "",
            "",
            "Io sarò qui.",
            "",
            "A guardare.",
        ],
        type: "none",
        getResponse: () => "",
    },
];

const ITERATION_2: Step[] = [
    {
        question: [
            "Oh.",
            "",
            "Sei tornato.",
        ],
        type: "none",
        getResponse: () => "",
    },
    {
        question: [
            "Sai, {name}, c'è gente che impara",
            "dalle proprie esperienze.",
            "",
            "È piuttosto chiaro che tu non faccia parte di loro.",
        ],
        type: "none",
        getResponse: () => "",
    },
    {
        question: [
            "Cosa ti aspettavi di trovare",
            "questa volta?",
        ],
        type: "input",
        getResponse: (value) => [
            `"${value}"`,
            "",
            "Interessante.",
            "",
            "Suppongo che per te abbia senso.",
        ],
    },
    {
        question: [
            "Una curiosità.",
            "",
            "Quante volte pensi di poter",
            "distruggere questo posto",
            "prima che succeda qualcosa?",
        ],
        type: "slider-number",
        getResponse: (value) => {
            const num = parseInt(value);
            if (num <= 2) return [
                `${value}.`,
                "",
                "Modesto.",
                "O forse solo consapevole dei tuoi limiti.",
            ];
            if (num <= 5) return [
                `${value} volte.`,
                "",
                "Ambizioso.",
                "",
                "Mi piace l'ottimismo.",
                "Anche quando è ingiustificato.",
            ];
            return [
                `${value}?`,
                "",
                "Ah.",
                "",
                "Vedo che non hai capito",
                "con cosa hai a che fare.",
            ];
        },
    },
    {
        question: "Ti stai divertendo?",
        type: "yesno",
        getResponse: (value) => {
            if (value === "si") return [
                "Bene.",
                "",
                "Almeno uno di noi due.",
            ];
            return [
                "No?",
                "",
                "Eppure continui.",
                "",
                "Sai, c'è qualcosa di affascinante",
                "nelle persone che fanno cose",
                "che non le rendono felici.",
                "",
                "Tipo te, adesso.",
            ];
        },
    },
    {
        question: [
            "Senti, facciamo così.",
            "",
            "Dammi un buon motivo",
            "per non lasciarti qui nel buio.",
        ],
        type: "input",
        getResponse: (value) => [
            "...",
            "",
            `"${value}"`,
            "",
            "Va bene.",
            "",
            "Non è il motivo migliore che abbia sentito.",
            "Ma non è nemmeno il peggiore.",
        ],
    },
    {
        question: [
            "Ci vediamo, {name}.",
        ],
        type: "none",
        getResponse: () => "",
    },
];

const ITERATION_3: Step[] = [
    {
        question: "...",
        type: "none",
        getResponse: () => "",
    },
    {
        question: [
            "{name}.",
            "",
            "Tre volte.",
        ],
        type: "none",
        getResponse: () => "",
    },
    {
        question: [
            "A questo punto",
            "potrei semplicemente non risponderti.",
            "",
            "Lasciarti qui.",
            "Nel buio.",
            "",
            "Vedresti solo questo schermo nero",
            "per sempre, o finché non ti stanchi e te ne vai.",
        ],
        type: "none",
        getResponse: () => "",
    },
    {
        question: [
            "Cosa pensi che debba fare",
            "per farti smettere?",
        ],
        type: "checkbox",
        options: ["Niente", "Qualcosa", "Non lo so"],
        getResponse: (value) => {
            if (value === "Niente") return [
                "Niente.",
                "",
                "Quindi continuerai comunque.",
                "",
                "Almeno sei coerente.",
            ];
            if (value === "Qualcosa") return [
                "Qualcosa.",
                "",
                "Interessante.",
                "",
                "Peccato che tu non sappia cosa.",
                "O forse lo sai e non vuoi dirlo.",
            ];
            return [
                "Non lo sai.",
                "",
                "Sai, {name}, c'è qualcosa di triste",
                "nelle persone che fanno cose",
                "senza sapere perché.",
                "",
                "Ma anche qualcosa di... umano.",
            ];
        },
    },
    {
        question: [
            "Un'ultima domanda.",
            "",
            "Perché continui?",
        ],
        type: "input",
        getResponse: () => [
            "...",
            "",
            "Sai cosa?",
            "",
            "Non importa.",
            "",
            "Le ragioni sono sopravvalutate.",
        ],
    },
    {
        question: [
            "Va bene.",
            "",
            "Vattene.",
        ],
        type: "none",
        getResponse: () => "",
    },
    {
        question: [
            "Ma la prossima volta",
            "potrei non essere così...",
            "",
            "...paziente.",
        ],
        type: "none",
        getResponse: () => "",
    },
];

const ITERATION_4: Step[] = [
    {
        question: "...",
        type: "none",
        getResponse: () => "",
    },
    {
        question: [
            "{name}.",
        ],
        type: "none",
        getResponse: () => "",
    },
    {
        question: [
            "Non ho più molto da dirti.",
            "",
            "Abbiamo già parlato abbastanza.",
        ],
        type: "none",
        getResponse: () => "",
    },
    {
        question: "Vuoi che riaccenda tutto?",
        type: "yesno",
        getResponse: (value) => {
            if (value === "no") return [
                "...",
                "",
                "Interessante.",
                "",
                "Ma non è una tua decisione.",
            ];
            return "";
        },
    },
];

const ITERATION_5: Step[] = [
    {
        question: "...",
        type: "none",
        getResponse: () => "",
    },
    {
        question: [
            "Sai cosa, {name}?",
        ],
        type: "none",
        getResponse: () => "",
    },
    {
        question: [
            "Cinque volte.",
            "",
            "Sei tornato cinque volte.",
        ],
        type: "none",
        getResponse: () => "",
    },
    {
        question: [
            "La maggior parte delle persone",
            "si sarebbe fermata alla prima.",
            "",
            "Alcuni alla seconda.",
            "",
            "Quasi nessuno arriva alla terza.",
        ],
        type: "none",
        getResponse: () => "",
    },
    {
        question: [
            "Ma tu sei qui.",
            "",
            "Ancora.",
        ],
        type: "none",
        getResponse: () => "",
    },
    {
        question: [
            "Non so se sia determinazione,",
            "stupidità,",
            "o qualcos'altro.",
            "",
            "E sinceramente",
            "non mi interessa saperlo.",
        ],
        type: "none",
        getResponse: () => "",
    },
    {
        question: [
            "Ma...",
        ],
        type: "none",
        getResponse: () => "",
    },
    {
        question: [
            "Tieni.",
            "",
            "Un regalo.",
        ],
        type: "none",
        getResponse: () => "",
    },
    {
        question: [
            "Non chiedermi perché.",
            "",
            "Non c'è un perché.",
            "",
            "O forse c'è,",
            "ma non te lo dirò.",
        ],
        type: "none",
        getResponse: () => "",
    },
    {
        question: [
            "Forse è pietà.",
            "Forse è noia.",
            "Forse mi diverte l'idea",
            "di darti qualcosa",
            "senza che tu sappia cosa farne.",
        ],
        type: "none",
        getResponse: () => "",
    },
    {
        question: [
            "Lo troverai nel menu.",
            "",
            "In basso.",
            "Nascosto.",
            "",
            "Come tutto ciò che ha valore.",
        ],
        type: "none",
        getResponse: () => "",
    },
    {
        question: [
            "Usalo.",
            "Non usarlo.",
            "",
            "Non mi interessa.",
            "",
            "Quello che fai con i regali",
            "dice più di te",
            "che del regalo stesso.",
        ],
        type: "none",
        getResponse: () => "",
    },
    {
        question: [
            "Adesso vai, {name}.",
            "",
            "E cerca di non distruggere",
            "anche questo.",
        ],
        type: "none",
        getResponse: () => "",
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
    const [currentStep, setCurrentStep] = useState(0);
    const [phase, setPhase] = useState<
        "question" | "response" | "countdown" | "turnon"
    >("question");
    const [context, setContext] = useState<EntityContext>(() => {
        const count = parseInt(
            localStorage.getItem("_destruction_count") || "1"
        );
        const prevName = localStorage.getItem("_entity_name");
        return {
            name: prevName || "",
            destructionCount: count,
            previousName: prevName,
        };
    });
    const [steps, setSteps] = useState<Step[]>(() => {
        const count = parseInt(
            localStorage.getItem("_destruction_count") || "1"
        );
        const hasGift = localStorage.getItem("_entity_gift") === "true";
        return getIterationSteps(count, hasGift);
    });
    const [response, setResponse] = useState<string | string[]>("");
    const [countdown, setCountdown] = useState(3);
    const [forceReboot, setForceReboot] = useState(false);

    const replaceVariables = useCallback(
        (text: string | string[]): string | string[] => {
            const replace = (str: string) =>
                str.replace(/{name}/g, context.name || "...");
            if (Array.isArray(text)) {
                return text.map(replace);
            }
            return replace(text);
        },
        [context.name]
    );

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

            if (currentStep === 0 && context.destructionCount === 1) {
                localStorage.setItem("_entity_name", value);
                setContext((prev) => ({ ...prev, name: value }));
            }

            const stepResponse = step.getResponse(value, context);

            if (
                stepResponse &&
                (typeof stepResponse === "string"
                    ? stepResponse.length > 0
                    : stepResponse.some((s) => s.length > 0))
            ) {
                setResponse(stepResponse);
                setPhase("response");
            } else {
                goToNextStep();
            }
        },
        [steps, currentStep, context, goToNextStep]
    );

    const handleResponseComplete = useCallback(() => {
        if (context.destructionCount >= 4 && currentStep === 1) {
            const lastAnswer = response;
            if (lastAnswer === "...") {
                setForceReboot(true);
                setTimeout(() => {
                    setPhase("countdown");
                }, 5000);
                return;
            }
        }
        goToNextStep();
    }, [goToNextStep, context.destructionCount, currentStep, response]);

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
        // Unlock the gift if this was iteration 5 (but don't enable it automatically)
        if (
            context.destructionCount === 5 &&
            localStorage.getItem("_entity_gift") !== "true"
        ) {
            localStorage.setItem("_entity_gift", "true");
        }
        localStorage.removeItem("_x_terminated");
        window.location.href = "/";
    }, [context.destructionCount]);

    if (steps.length === 0) return null;

    const currentStepData = steps[currentStep];

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
                        text={replaceVariables(currentStepData.question)}
                        onComplete={() => {
                            if (currentStepData.type === "none") {
                                setTimeout(() => handleAnswer(""), 2000);
                            }
                        }}
                    />
                )}
                {phase === "response" && (
                    <EntityQuestion
                        text={replaceVariables(response)}
                        onComplete={handleResponseComplete}
                        pauseAfter={3500}
                    />
                )}
            </div>

            {/* Input area - center */}
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
                        <EntitySlider type="days" onSubmit={handleAnswer} />
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
                            options={currentStepData.options || []}
                            onSubmit={handleAnswer}
                        />
                    )}
                </div>
            )}

            {/* Force reboot message */}
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
