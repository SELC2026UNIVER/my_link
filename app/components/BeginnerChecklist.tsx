"use client";

import { useState } from "react";
import type { ChecklistGoal } from "../profile-data";

interface BeginnerChecklistProps {
  items: ChecklistGoal[];
}

export default function BeginnerChecklist({ items }: BeginnerChecklistProps) {
  const [goals, setGoals] = useState<ChecklistGoal[]>(items);

  const toggleGoal = (id: string) => {
    setGoals((prev) =>
      prev.map((goal) =>
        goal.id === id ? { ...goal, done: !goal.done } : goal
      )
    );
  };

  const completedCount = goals.filter((goal) => goal.done).length;
  const totalCount = goals.length;
  const progressPercent =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div
      id="checklist"
      className="rounded-[18px] border border-white/10 bg-[var(--color-surface-tile-2)] p-6 sm:p-8"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="type-caption-strong uppercase tracking-wider text-[var(--color-body-muted)]">
            DAILY PLEDGE
          </p>
          <h3 className="type-tagline mt-1 text-white">
            매일 1커밋 · 초보 다짐
          </h3>
        </div>
        <span className="type-caption-strong numeric-spec shrink-0 text-[var(--color-primary-on-dark)]">
          {completedCount} / {totalCount}
        </span>
      </div>

      <div
        aria-hidden="true"
        className="mt-5 mb-3 h-[3px] w-full overflow-hidden rounded-full bg-white/10"
      >
        <div
          className="h-full rounded-full bg-[var(--color-primary-on-dark)] transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <ul className="divide-y divide-white/10">
        {goals.map((goal) => (
          <li key={goal.id}>
            <button
              type="button"
              onClick={() => toggleGoal(goal.id)}
              aria-pressed={goal.done}
              className="group flex w-full cursor-pointer items-start gap-3.5 py-3.5 text-left transition-transform duration-150 active:scale-[0.98] focus-visible:rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary-focus)]"
            >
              <span
                aria-hidden="true"
                className={`mt-[3px] flex h-5 w-5 shrink-0 items-center justify-center rounded-full transition-colors ${
                  goal.done
                    ? "bg-[var(--color-primary)] text-white"
                    : "border border-white/40 bg-transparent group-hover:border-white/75"
                }`}
              >
                {goal.done ? (
                  <svg
                    width="11"
                    height="11"
                    viewBox="0 0 12 12"
                    fill="none"
                  >
                    <path
                      d="M2.5 6.2L4.9 8.6L9.5 3.6"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : null}
              </span>
              <span
                className={`type-body transition-colors ${
                  goal.done
                    ? "text-[var(--color-body-muted)] line-through decoration-white/30"
                    : "text-white"
                }`}
              >
                {goal.text}
              </span>
            </button>
          </li>
        ))}
      </ul>

      <p className="type-caption mt-4 border-t border-white/10 pt-4 text-[var(--color-body-muted)]">
        {completedCount === totalCount
          ? "오늘의 초보 다짐을 모두 마쳤습니다. 내일도 꾸준히 노력하겠습니다."
          : "서툴더라도 매일 한 걸음씩 최선을 다해 채워 가고 있습니다."}
      </p>
    </div>
  );
}
