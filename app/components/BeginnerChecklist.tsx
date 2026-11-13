"use client";

import { useState } from "react";
import type { ChecklistGoal } from "@/app/profile-data";

interface BeginnerChecklistProps {
  items: ChecklistGoal[];
}

export default function BeginnerChecklist({ items }: BeginnerChecklistProps) {
  const [goals, setGoals] = useState<ChecklistGoal[]>(items);

  const completedCount = goals.filter((goal) => goal.done).length;

  function toggleGoal(id: string) {
    setGoals((prev) =>
      prev.map((goal) =>
        goal.id === id ? { ...goal, done: !goal.done } : goal
      )
    );
  }

  return (
    <section
      aria-labelledby="checklist-heading"
      className="relative rounded-2xl border-[3px] border-[#161616] bg-[#FFFDF7] p-5 shadow-[6px_6px_0px_#161616]"
    >
      {/* 기울어진 스티커 라벨 */}
      <span className="absolute -top-3.5 right-4 rotate-2 rounded-lg border-2 border-[#161616] bg-[#F2C14E] px-2.5 py-0.5 font-mono text-[11px] font-bold text-[#161616] shadow-[2px_2px_0px_#161616]">
        {completedCount}/{goals.length} 실천 중
      </span>

      <div className="mb-3.5 flex items-center gap-2">
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-md border-2 border-[#161616] bg-[#A6BC78] text-xs font-black text-[#161616]">
          ✓
        </span>
        <h2
          id="checklist-heading"
          className="text-base font-extrabold tracking-tight text-[#161616]"
        >
          매일 1커밋 · 초보 다짐
        </h2>
      </div>

      <ul className="space-y-2.5">
        {goals.map((goal) => (
          <li key={goal.id}>
            <button
              type="button"
              onClick={() => toggleGoal(goal.id)}
              aria-pressed={goal.done}
              className={`flex w-full cursor-pointer items-start gap-3 rounded-xl border-2 border-[#161616] p-2.5 text-left transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_#161616] ${
                goal.done ? "bg-[#EFE6D5]" : "bg-[#FFFDF7]"
              }`}
            >
              <span
                className={`mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 border-[#161616] text-xs font-black ${
                  goal.done
                    ? "bg-[#A6BC78] text-[#161616]"
                    : "bg-[#FFFDF7] text-transparent"
                }`}
                aria-hidden
              >
                ✓
              </span>
              <span
                className={`text-xs leading-relaxed font-medium break-keep sm:text-[13px] ${
                  goal.done
                    ? "text-[#161616]/75 line-through decoration-2"
                    : "text-[#161616]"
                }`}
              >
                {goal.text}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
