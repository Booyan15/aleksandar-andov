"use client";

import { useEffect, useRef, useState } from "react";
import { MapPin, MessageCircle } from "lucide-react";
import { ProblemForm } from "@/components/forms/ProblemForm";
import { QuestionForm } from "@/components/forms/QuestionForm";

type FormKind = "question" | "problem";

const formCopy: Record<FormKind, { tab: string; title: string; description: string }> = {
  question: {
    tab: "Прашање",
    title: "Постави прашање до претседателот на Советот",
    description: "Испратете прашање, предлог или иницијатива до Претседателот на Советот."
  },
  problem: {
    tab: "Проблем",
    title: "Пријави проблем до претседателот на Советот",
    description: "Пријавете локален проблем со локација и краток опис за понатамошно разгледување."
  }
};

function selectedFromHash(hash: string): FormKind | null {
  if (hash === "#problem") {
    return "problem";
  }

  if (hash === "#prasanje") {
    return "question";
  }

  return null;
}

export function PublicSubmissionTabs() {
  const [selected, setSelected] = useState<FormKind>("question");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function syncFromHash() {
      const nextSelected = selectedFromHash(window.location.hash);

      if (nextSelected) {
        setSelected(nextSelected);
        window.requestAnimationFrame(() => {
          containerRef.current?.scrollIntoView({ block: "start" });
        });
      }
    }

    syncFromHash();
    window.addEventListener("hashchange", syncFromHash);

    return () => window.removeEventListener("hashchange", syncFromHash);
  }, []);

  function choose(kind: FormKind) {
    setSelected(kind);
    window.history.replaceState(null, "", kind === "question" ? "#prasanje" : "#problem");
  }

  return (
    <div ref={containerRef} className="relative">
      <div id="prasanje" className="absolute -top-28" />
      <div id="problem" className="absolute -top-28" />

      <div className="mb-6 lg:hidden">
        <h3 className="text-xl font-semibold text-municipal-dark">Што сакате да направите?</h3>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => choose("question")}
            className={`rounded-lg border p-4 text-left transition ${
              selected === "question"
                ? "border-municipal-red bg-red-50 text-municipal-red shadow-sm"
                : "border-municipal-line bg-white text-municipal-dark hover:border-municipal-gold hover:bg-municipal-yellow/10"
            }`}
          >
            <MessageCircle className="h-5 w-5" aria-hidden="true" />
            <span className="mt-3 block text-base font-semibold">Постави прашање</span>
          </button>
          <button
            type="button"
            onClick={() => choose("problem")}
            className={`rounded-lg border p-4 text-left transition ${
              selected === "problem"
                ? "border-municipal-red bg-red-50 text-municipal-red shadow-sm"
                : "border-municipal-line bg-white text-municipal-dark hover:border-municipal-gold hover:bg-municipal-yellow/10"
            }`}
          >
            <MapPin className="h-5 w-5" aria-hidden="true" />
            <span className="mt-3 block text-base font-semibold">Пријави проблем</span>
          </button>
        </div>
      </div>

      <div className="sticky top-32 z-20 mb-5 grid grid-cols-2 rounded-lg border border-municipal-line bg-white p-1 shadow-sm lg:hidden">
        {(["question", "problem"] as FormKind[]).map((kind) => (
          <button
            key={kind}
            type="button"
            onClick={() => choose(kind)}
            className={`min-h-11 rounded-md px-4 py-2 text-sm font-semibold transition ${
              selected === kind
                ? "bg-municipal-red text-white shadow-sm shadow-municipal-red/10"
                : "text-municipal-muted hover:bg-municipal-warm hover:text-municipal-red"
            }`}
          >
            {formCopy[kind].tab}
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className={`official-card p-6 sm:p-8 ${selected === "question" ? "block" : "hidden lg:block"}`}>
          <div className="mb-7 border-b border-municipal-line pb-6">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-md border border-municipal-gold/30 bg-municipal-yellow/15 text-municipal-gold">
              <MessageCircle className="h-5 w-5" aria-hidden="true" />
            </div>
            <h3 className="text-2xl font-semibold text-municipal-red">{formCopy.question.title}</h3>
            <p className="mt-2 text-sm leading-6 text-municipal-muted">{formCopy.question.description}</p>
          </div>
          <QuestionForm />
        </section>

        <section className={`official-card p-6 sm:p-8 ${selected === "problem" ? "block" : "hidden lg:block"}`}>
          <div className="mb-7 border-b border-municipal-line pb-6">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-md border border-municipal-gold/30 bg-municipal-yellow/15 text-municipal-gold">
              <MapPin className="h-5 w-5" aria-hidden="true" />
            </div>
            <h3 className="text-2xl font-semibold text-municipal-red">{formCopy.problem.title}</h3>
            <p className="mt-2 text-sm leading-6 text-municipal-muted">{formCopy.problem.description}</p>
          </div>
          <ProblemForm />
        </section>
      </div>
    </div>
  );
}
