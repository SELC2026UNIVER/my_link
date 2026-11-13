import Image from "next/image";
import BeginnerChecklist from "./components/BeginnerChecklist";
import CopyEmailButton from "./components/CopyEmailButton";
import ProfileShowcase from "./components/ProfileShowcase";
import TopNav from "./components/TopNav";
import {
  beginnerMilestones,
  contactLinks,
  deskHighlight,
  initialChecklist,
  learningStack,
  practiceProjects,
  profile,
  studyLog,
} from "./profile-data";

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--color-canvas)] text-[var(--color-ink)]">
      <TopNav
        name={profile.name}
        handle={profile.handle}
        status={profile.status}
        contactHref="#contact"
      />

      <main id="main-content">
        {/* Light Hero Tile */}
        <section
          id="about"
          className="w-full scroll-mt-[52px] bg-[var(--color-canvas)] pt-12 pb-20 sm:pt-16 sm:pb-28"
        >
          <div className="mx-auto max-w-[980px] px-5 text-center sm:px-6">
            <div className="mx-auto h-[120px] w-[120px] overflow-hidden rounded-full bg-[var(--color-canvas-parchment)] shadow-product">
              <Image
                src={profile.avatar}
                alt={profile.avatarAlt}
                width={120}
                height={120}
                loading="eager"
                fetchPriority="high"
                placeholder="blur"
                className="h-[120px] w-[120px] object-cover object-center"
              />
            </div>

            <p className="type-caption-strong mt-6 text-[var(--color-ink-muted-48)]">
              {profile.status} · {profile.subRole} · {profile.location}
            </p>

            <h1 className="type-hero-display mt-2 text-[var(--color-ink)]">
              {profile.name}
            </h1>

            <p className="type-lead mt-2 text-[var(--color-ink-muted-80)]">
              {profile.role} · {profile.handle}
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3.5">
              <a
                href={contactLinks[0].href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-full bg-[var(--color-primary)] px-[22px] py-[11px] text-[17px] font-normal leading-none tracking-[-0.022em] text-white transition-all duration-150 hover:brightness-105 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary-focus)]"
              >
                GitHub
              </a>
              <CopyEmailButton email={profile.email} variant="secondary" />
            </div>

            <p className="type-body mx-auto mt-8 max-w-[640px] text-[var(--color-ink)]">
              {profile.intro}
            </p>

            <div className="mx-auto mt-12 max-w-[920px] sm:mt-16">
              <div className="overflow-hidden rounded-[18px] bg-[var(--color-canvas-parchment)] shadow-product">
                <Image
                  src={deskHighlight.image}
                  alt={deskHighlight.imageAlt}
                  loading="eager"
                  fetchPriority="high"
                  placeholder="blur"
                  className="h-auto w-full object-cover"
                />
              </div>
              <p className="type-caption mt-5 text-[var(--color-ink-muted-48)]">
                {deskHighlight.title} — {deskHighlight.description}
              </p>
            </div>
          </div>
        </section>

        {/* Dark Tile 1: Today's Study Log & Beginner Pledge Checklist */}
        <section
          id="study-log"
          className="w-full scroll-mt-[52px] bg-[var(--color-surface-tile-1)] py-20 text-white sm:py-28"
        >
          <div className="mx-auto max-w-[980px] px-5 sm:px-6">
            <div className="mx-auto max-w-[680px] text-center">
              <p className="type-caption-strong numeric-spec uppercase tracking-wider text-[var(--color-body-muted)]">
                {studyLog.badge} · {studyLog.date}
              </p>
              <h2 className="type-display-lg mt-2 text-white">
                {studyLog.title}
              </h2>
              <p className="type-lead mt-3 text-[var(--color-body-muted)]">
                어제의 나보다 딱 한 줄만 더 이해하려고 열심히 노력합니다.
              </p>
              <a
                href="#projects"
                className="type-body mt-4 inline-flex items-center gap-1 text-[var(--color-primary-on-dark)] hover:underline focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-primary-focus)]"
              >
                <span>연습 작품 보러 가기</span>
                <span aria-hidden="true">›</span>
              </a>
            </div>

            <div className="mt-14 grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
              <div className="rounded-[18px] border border-white/10 bg-[var(--color-surface-tile-2)] p-6 sm:p-8 lg:col-span-7">
                <ul className="divide-y divide-white/10">
                  {studyLog.entries.map((entry) => (
                    <li
                      key={entry.topic}
                      className="py-5 first:pt-0 last:pb-0"
                    >
                      <p className="type-caption-strong text-[var(--color-primary-on-dark)]">
                        {entry.topic}
                      </p>
                      <p className="type-body mt-1.5 text-white">
                        {entry.text}
                      </p>
                    </li>
                  ))}
                </ul>

                <div className="mt-6 border-t border-white/10 pt-6">
                  <p className="type-caption text-[var(--color-body-muted)]">
                    오늘의 공부 다짐
                  </p>
                  <p className="type-lead-airy mt-1.5 text-white">
                    “{studyLog.dailyMemo}”
                  </p>
                </div>
              </div>

              <div className="lg:col-span-5">
                <BeginnerChecklist items={initialChecklist} />
              </div>
            </div>
          </div>
        </section>

        {/* Light Parchment Utility Tile: Practice Projects */}
        <section
          id="projects"
          className="w-full scroll-mt-[52px] bg-[var(--color-canvas-parchment)] py-20 text-[var(--color-ink)] sm:py-28"
        >
          <div className="mx-auto max-w-[980px] px-5 sm:px-6">
            <div className="mx-auto max-w-[680px] text-center">
              <p className="type-caption-strong uppercase tracking-wider text-[var(--color-ink-muted-48)]">
                PRACTICE PROJECTS
              </p>
              <h2 className="type-display-lg mt-2 text-[var(--color-ink)]">
                작은 연습 작품
              </h2>
              <p className="type-lead mt-3 text-[var(--color-ink-muted-80)]">
                서툴지만 직접 손으로 만들고 고쳐 본 첫 결과물들입니다.
              </p>
            </div>

            <ProfileShowcase projects={practiceProjects} />
          </div>
        </section>

        {/* Dark Tile 2: Milestones & Learning Stack */}
        <section
          id="stack"
          className="w-full scroll-mt-[52px] bg-[var(--color-surface-tile-1)] py-20 text-white sm:py-28"
        >
          <div className="mx-auto max-w-[980px] px-5 sm:px-6">
            <div className="mx-auto max-w-[680px] text-center">
              <p className="type-caption-strong uppercase tracking-wider text-[var(--color-body-muted)]">
                LEARNING JOURNEY
              </p>
              <h2 className="type-display-lg mt-2 text-white">
                차근차근 쌓아가는 기록
              </h2>
              <p className="type-lead mt-3 text-[var(--color-body-muted)]">
                작은 기초부터 하나씩 익히며 최선을 다하고 있습니다.
              </p>
            </div>

            <div className="mt-14 grid grid-cols-1 divide-y divide-white/10 border-y border-white/10 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
              {beginnerMilestones.map((item) => (
                <div key={item.label} className="py-8 text-center sm:px-6">
                  <p className="type-caption text-[var(--color-body-muted)]">
                    {item.label}
                  </p>
                  <p className="type-display-lg numeric-spec mt-2 text-white">
                    {item.value}
                  </p>
                  <p className="type-caption mt-2 text-[var(--color-primary-on-dark)]">
                    {item.note}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {learningStack.map((tech) => (
                <div
                  key={tech.name}
                  className="rounded-[18px] border border-white/10 bg-[var(--color-surface-tile-2)] px-6 py-5"
                >
                  <p className="type-tagline text-white">{tech.name}</p>
                  <p className="type-caption mt-1 text-[var(--color-body-muted)]">
                    {tech.level}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Parchment Footer */}
      <footer
        id="contact"
        className="w-full scroll-mt-[52px] border-t border-[var(--color-hairline)] bg-[var(--color-canvas-parchment)] py-16 text-[var(--color-ink)] sm:py-20"
      >
        <div className="mx-auto max-w-[980px] px-5 sm:px-6">
          <div className="max-w-[640px]">
            <h2 className="type-display-md text-[var(--color-ink)]">
              함께 이야기해요
            </h2>
            <p className="type-body mt-2 text-[var(--color-ink-muted-80)]">
              아직 서툴지만 매일 열심히 배우고 있습니다. 따뜻한 응원과 작은
              조언 모두 감사히 듣겠습니다.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <a
                href={`mailto:${profile.email}`}
                className="inline-flex items-center justify-center whitespace-nowrap rounded-full bg-[var(--color-primary)] px-[22px] py-[11px] text-[17px] font-normal leading-none tracking-[-0.022em] text-white transition-all duration-150 hover:brightness-105 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary-focus)]"
              >
                이메일 보내기
              </a>
              <CopyEmailButton
                email={profile.email}
                variant="pearl"
                label={`${profile.email} 복사`}
              />
            </div>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 border-t border-[var(--color-hairline)] pt-10 sm:grid-cols-3">
            <div>
              <p className="type-caption-strong text-[var(--color-ink)]">
                둘러보기
              </p>
              <ul className="mt-2">
                <li>
                  <a
                    href="#about"
                    className="type-dense-link text-[var(--color-ink-muted-80)] hover:text-[var(--color-primary)] hover:underline"
                  >
                    소개
                  </a>
                </li>
                <li>
                  <a
                    href="#study-log"
                    className="type-dense-link text-[var(--color-ink-muted-80)] hover:text-[var(--color-primary)] hover:underline"
                  >
                    오늘의 공부 기록
                  </a>
                </li>
                <li>
                  <a
                    href="#projects"
                    className="type-dense-link text-[var(--color-ink-muted-80)] hover:text-[var(--color-primary)] hover:underline"
                  >
                    작은 연습 작품
                  </a>
                </li>
                <li>
                  <a
                    href="#stack"
                    className="type-dense-link text-[var(--color-ink-muted-80)] hover:text-[var(--color-primary)] hover:underline"
                  >
                    배우는 기술
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <p className="type-caption-strong text-[var(--color-ink)]">
                공부 책상
              </p>
              <ul className="mt-2">
                {deskHighlight.specs.map((spec) => (
                  <li
                    key={spec}
                    className="type-dense-link text-[var(--color-ink-muted-80)]"
                  >
                    {spec}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="type-caption-strong text-[var(--color-ink)]">
                연결
              </p>
              <ul className="mt-2">
                {contactLinks.map((link) => {
                  const isExternal = link.href.startsWith("http");
                  return (
                    <li key={link.id}>
                      <a
                        href={link.href}
                        target={isExternal ? "_blank" : undefined}
                        rel={isExternal ? "noopener noreferrer" : undefined}
                        className="type-dense-link text-[var(--color-primary)] hover:underline"
                      >
                        {link.label}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-2 border-t border-[var(--color-hairline)] pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="type-fine-print text-[var(--color-ink-muted-48)]">
              © 2026 {profile.name} ({profile.handle}). 오늘도 최선을 다해
              배우는 초보 개발자 기록.
            </p>
            <p className="type-fine-print text-[var(--color-ink-muted-48)]">
              {profile.location} · {profile.subRole}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
