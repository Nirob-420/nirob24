import { useEffect, useRef, useState, useMemo, type MouseEvent as ReactMouseEvent } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
} from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  ExternalLink,
  Eye,
  Grid3X3,
  Laptop,
  Lock,
  Maximize2,
  Monitor,
  Smartphone,
  Sparkles,
  X,
} from "lucide-react";
import { profile, projects } from "../data";
import { ease, lockScroll, pad, playTactileBlip } from "../lib";
import {
  GithubIcon,
  Label,
  Magnetic,
  RollText,
  SiteImage,
} from "../components/ui";

type ProjectItem = (typeof projects)[number];

/* ================= 3D STAGE DEVICE VIEWPORT ================= */
function StageDeviceViewport({
  project,
  deviceMode,
  onOpenViewer,
}: {
  project: ProjectItem;
  deviceMode: "desktop" | "mobile";
  onOpenViewer: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 120, damping: 18 });
  const sry = useSpring(ry, { stiffness: 120, damping: 18 });

  const handleMouseMove = (e: ReactMouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    ry.set((px - 0.5) * 16);
    srx.set(-(py - 0.5) * 14);
  };

  const handleMouseLeave = () => {
    rx.set(0);
    ry.set(0);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative flex min-h-[420px] sm:min-h-[480px] md:min-h-[540px] w-full items-center justify-center overflow-hidden rounded-[2.2rem] border border-white/12 bg-[radial-gradient(ellipse_at_50%_40%,#1e1e1c_0%,#090908_75%)] p-6 sm:p-10"
      style={{ perspective: 1400 }}
    >
      {/* Background ambient lighting & studio grid */}
      <div className="dot-grid absolute inset-0 opacity-30 [mask-image:radial-gradient(ellipse_at_center,black_25%,transparent_75%)]" />
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-accent/12 blur-3xl" />
      <div className="pointer-events-none absolute -left-24 -bottom-24 h-72 w-72 rounded-full bg-white/5 blur-3xl" />

      {/* Watermark project slug */}
      <span className="pointer-events-none absolute right-4 bottom-2 font-display text-[7rem] sm:text-[10rem] font-black uppercase leading-none text-white/[0.03] select-none">
        {project.slug.slice(0, 4)}
      </span>

      {/* 3D Floating Device Stage */}
      <motion.div
        style={{
          rotateX: srx,
          rotateY: sry,
          transformStyle: "preserve-3d",
        }}
        className="relative z-10 flex w-full items-center justify-center"
      >
        <AnimatePresence mode="wait">
          {deviceMode === "desktop" ? (
            /* ================= DESKTOP LAPTOP / STUDIO MONITOR ================= */
            <motion.div
              key={`desktop-${project.slug}`}
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -20 }}
              transition={{ duration: 0.5, ease }}
              className="group relative w-full max-w-[620px] overflow-hidden rounded-[1.6rem] border border-white/15 bg-[#121210] shadow-[0_40px_110px_-20px_rgba(0,0,0,0.95)]"
            >
              {/* Window Header */}
              <div className="flex items-center justify-between border-b border-white/10 bg-[#181816] px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#e53935]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#fbc02d]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#2e7d32]" />
                </div>

                <div className="flex max-w-[280px] flex-1 items-center justify-center sm:max-w-[340px]">
                  <div className="flex w-full items-center justify-center gap-2 rounded-full border border-white/10 bg-black/40 px-3 py-1 font-mono text-[9px] text-mute sm:text-[10px]">
                    <Lock size={10} className="text-accent" />
                    <span className="truncate text-bone/70">
                      nirob-420.github.io/{project.slug}/
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onOpenViewer}
                  className="rounded-full border border-white/10 bg-white/5 p-1 text-mute hover:border-accent hover:text-white"
                  title="Inspect project"
                >
                  <Maximize2 size={12} />
                </button>
              </div>

              {/* Viewport Screen */}
              <div
                className="relative aspect-[16/10] w-full overflow-hidden bg-[#0c0c0b]"
                onClick={onOpenViewer}
                data-cursor="Inspect"
              >
                {/* Clean site preview with smooth hover scroll */}
                <div className="relative -mt-[11.2%] h-[112%] w-full transition-transform duration-[5s] ease-in-out group-hover:-translate-y-[52%]">
                  <SiteImage
                    file={project.img}
                    alt={`${project.title} live screenshot`}
                    className="w-full object-cover object-top"
                  />
                </div>

                {/* Glass reflections */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.04] to-transparent" />
                <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_20px_rgba(0,0,0,0.8)]" />

                {/* Hover hint */}
                <div className="absolute inset-x-4 bottom-4 flex items-end justify-between opacity-90 transition-opacity duration-300 sm:opacity-0 sm:group-hover:opacity-100">
                  <span className="rounded-full border border-white/20 bg-ink/80 px-3 py-1 font-mono text-[9px] uppercase tracking-wider text-bone backdrop-blur-md">
                    Hover to Scroll · Tap to Inspect
                  </span>
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-accent text-ink shadow-lg">
                    <ArrowUpRight size={15} />
                  </span>
                </div>
              </div>
            </motion.div>
          ) : (
            /* ================= MOBILE PHONE DISPLAY ================= */
            <motion.div
              key={`mobile-${project.slug}`}
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -20 }}
              transition={{ duration: 0.5, ease }}
              className="group relative w-[240px] sm:w-[270px] aspect-[9/18] overflow-hidden rounded-[2.6rem] border-[7px] border-[#222220] bg-black shadow-[0_40px_100px_-20px_rgba(0,0,0,0.95),0_0_0_1px_rgba(255,255,255,0.12)]"
            >
              {/* Dynamic Island / Speaker */}
              <div className="absolute top-2.5 left-1/2 -translate-x-1/2 z-30 h-4 w-22 rounded-full bg-[#181816] flex items-center justify-center gap-1.5 px-2">
                <span className="h-1.5 w-1.5 rounded-full bg-black ring-1 ring-white/10" />
                <span className="h-1 w-6 rounded-full bg-[#22221f]" />
              </div>

              {/* Phone Viewport with clean site preview */}
              <div
                className="relative h-full w-full overflow-hidden bg-[#0c0c0b] pt-2.5 pb-8"
                onClick={onOpenViewer}
                data-cursor="Inspect"
              >
                <div className="relative h-full w-full overflow-hidden rounded-b-[1.8rem]">
                  <SiteImage
                    file={project.img}
                    alt={`${project.title} mobile screenshot`}
                    className="w-full object-cover object-top -translate-y-[11.2%] transition-transform duration-[4.5s] ease-in-out group-hover:-translate-y-[55%]"
                  />
                </div>

                <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.04] to-transparent" />
              </div>

              {/* Home bar */}
              <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 z-30 h-1 w-24 rounded-full bg-white/40" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

/* ================= 3D CASE STUDY MODAL ================= */
function ProjectViewerModal({
  index,
  onClose,
  onNext,
}: {
  index: number | null;
  onClose: () => void;
  onNext: (dir: number) => void;
}) {
  const open = index !== null;
  const p = index !== null ? projects[index] : null;

  useEffect(() => {
    lockScroll(open);
    const onKey = (e: KeyboardEvent) => {
      if (!open) return;
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNext(1);
      if (e.key === "ArrowLeft") onNext(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose, onNext]);

  return (
    <AnimatePresence>
      {open && p && index !== null && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/88 p-4 backdrop-blur-2xl md:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.94, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.94, opacity: 0 }}
            transition={{ duration: 0.45, ease }}
            onClick={(e) => e.stopPropagation()}
            className="relative grid max-h-[92vh] w-full max-w-5xl overflow-hidden rounded-[2.2rem] border border-white/20 bg-[#0d0d0c] shadow-[0_50px_140px_rgba(0,0,0,0.98)] lg:grid-cols-12"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              aria-label="Close project modal"
              className="absolute right-4 top-4 z-30 grid h-10 w-10 place-items-center rounded-full border border-white/20 bg-black/60 backdrop-blur transition-colors hover:bg-white hover:text-black sm:right-6 sm:top-6"
            >
              <X size={18} />
            </button>

            {/* Left Preview Column */}
            <div className="relative flex min-h-[320px] items-center justify-center border-b border-white/10 bg-[radial-gradient(circle_at_50%_40%,#1f1f1d,#080808_75%)] p-6 sm:p-10 lg:col-span-7 lg:min-h-[560px] lg:border-b-0 lg:border-r">
              <div className="dot-grid absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_75%)]" />

              <div className="relative aspect-[16/10] w-full max-w-[480px] overflow-hidden rounded-2xl border-[4px] border-[#2a2a28] bg-black shadow-2xl">
                <div className="flex items-center gap-1.5 border-b border-white/10 bg-[#161614] px-3 py-2">
                  <span className="h-2 w-2 rounded-full bg-[#e53935]" />
                  <span className="h-2 w-2 rounded-full bg-[#fbc02d]" />
                  <span className="h-2 w-2 rounded-full bg-[#2e7d32]" />
                  <span className="ml-2 truncate font-mono text-[8px] text-mute">
                    nirob-420.github.io/{p.slug}/
                  </span>
                </div>
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#0c0c0b]">
                  <div className="relative -mt-[11.2%] h-[112%] w-full">
                    <SiteImage
                      file={p.img}
                      alt={`${p.title} preview`}
                      className="w-full object-cover object-top"
                    />
                  </div>
                </div>
              </div>

              <span className="absolute bottom-4 left-6 font-mono text-[9px] uppercase tracking-[0.24em] text-bone/40">
                Case 0{index + 1} / {p.cat}
              </span>
            </div>

            {/* Right Details Column */}
            <div className="flex flex-col justify-between gap-8 p-7 md:p-10 lg:col-span-5">
              <div>
                <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-mute">
                  <span>
                    {pad(index + 1)} / {pad(projects.length)}
                  </span>
                  <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-bone/80">
                    {p.cat}
                  </span>
                </div>

                <h3 className="mt-4 font-display text-3xl font-extrabold uppercase leading-[0.92] tracking-tight text-white sm:text-4xl">
                  {p.title}
                </h3>

                {p.role && (
                  <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.18em] text-accent">
                    {p.role}
                  </p>
                )}

                <p className="mt-4 text-sm leading-relaxed text-bone/70">
                  {p.desc}
                </p>

                {/* Specs */}
                <div className="mt-6 grid grid-cols-2 gap-2.5 font-mono text-xs">
                  {[
                    ["Year", p.year || "2024 — 2025"],
                    ["Role", p.role || "Design & Code"],
                    ["Repository", `nirob-420/${p.slug}`],
                    ["Category", p.cat],
                  ].map(([k, v]) => (
                    <div
                      key={k}
                      className="rounded-xl border border-white/10 bg-white/[0.02] p-3"
                    >
                      <p className="text-[8px] uppercase tracking-[0.2em] text-mute">
                        {k}
                      </p>
                      <p className="mt-1 truncate text-xs text-bone/90">{v}</p>
                    </div>
                  ))}
                </div>

                {/* Tech tags */}
                {p.tags && (
                  <div className="mt-5 flex flex-wrap gap-1.5">
                    {p.tags.map((t) => (
                      <span
                        key={t}
                        className="rounded-full border border-white/10 bg-white/[0.02] px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-mute"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Actions & Navigation */}
              <div>
                <div className="flex gap-2.5">
                  <a
                    href={p.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex flex-1 items-center justify-between rounded-full bg-accent px-5 py-3.5 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-ink transition-colors hover:bg-white"
                  >
                    <RollText>Open Live Website</RollText>
                    <ArrowUpRight
                      size={15}
                      className="transition-transform duration-300 group-hover:rotate-45"
                    />
                  </a>
                  <a
                    href={p.code}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${p.title} source code`}
                    className="grid h-12 w-12 place-items-center rounded-full border border-white/20 transition-colors hover:bg-white/10"
                  >
                    <GithubIcon className="h-4 w-4" />
                  </a>
                </div>

                <div className="mt-5 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.18em] text-mute">
                  <button
                    onClick={() => onNext(-1)}
                    className="group flex items-center gap-2 transition-colors hover:text-bone"
                  >
                    <ArrowLeft
                      size={14}
                      className="transition-transform group-hover:-translate-x-1"
                    />{" "}
                    Prev
                  </button>
                  <span className="hidden text-mute/50 sm:inline">
                    ← → to browse · esc to close
                  </span>
                  <button
                    onClick={() => onNext(1)}
                    className="group flex items-center gap-2 transition-colors hover:text-bone"
                  >
                    Next{" "}
                    <ArrowRight
                      size={14}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ================= 3D PERSPECTIVE GRID CARD ================= */
function GridProjectCard({
  project,
  index,
  onOpenViewer,
}: {
  project: ProjectItem;
  index: number;
  onOpenViewer: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.7, ease, delay: (index % 3) * 0.1 }}
      className="group relative flex flex-col overflow-hidden rounded-[2rem] border border-white/12 bg-[#0e0e0d] p-4 transition-all duration-500 hover:border-white/25 sm:p-5"
    >
      {/* Device Viewport */}
      <div
        className="relative aspect-[16/10] w-full overflow-hidden rounded-[1.4rem] bg-[#0c0c0b] cursor-pointer"
        onClick={onOpenViewer}
        data-cursor="Inspect"
      >
        <div className="relative -mt-[11.2%] h-[112%] w-full transition-transform duration-[4.5s] ease-in-out group-hover:-translate-y-[45%]">
          <SiteImage
            file={project.img}
            alt={`${project.title} preview`}
            className="w-full object-cover object-top"
            loading="lazy"
          />
        </div>

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

        <div className="absolute left-3 top-3 rounded-full border border-white/15 bg-black/60 px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-bone backdrop-blur-md">
          {project.cat}
        </div>

        <div className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-accent text-ink opacity-0 shadow-lg transition-all duration-300 group-hover:opacity-100 group-hover:scale-105">
          <ArrowUpRight size={14} />
        </div>
      </div>

      {/* Meta */}
      <div className="mt-4 flex flex-1 flex-col justify-between px-1">
        <div>
          <div className="flex items-center justify-between font-mono text-[9px] uppercase tracking-wider text-mute">
            <span className="text-accent font-bold">{pad(index + 1)}</span>
            <span>{project.year || "2024"}</span>
          </div>

          <h4 className="mt-1 font-display text-xl font-bold uppercase leading-tight text-white transition-colors group-hover:text-accent">
            {project.title}
          </h4>

          <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-mute">
            {project.desc}
          </p>
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-3">
          <button
            type="button"
            onClick={onOpenViewer}
            className="font-mono text-[10px] uppercase tracking-wider text-bone/70 hover:text-white"
          >
            Inspect Case
          </button>

          <a
            href={project.live}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-accent hover:underline"
          >
            <span>Live</span>
            <ExternalLink size={11} />
          </a>
        </div>
      </div>
    </motion.div>
  );
}

/* ================= MAIN WORK SECTION ================= */
export function Work() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [activeStageIdx, setActiveStageIdx] = useState<number>(0);
  const [viewStyle, setViewStyle] = useState<"stage" | "grid">("stage");
  const [deviceMode, setDeviceMode] = useState<"desktop" | "mobile">("desktop");
  const [viewerModalIdx, setViewerModalIdx] = useState<number | null>(null);

  // Categories list
  const categories = useMemo(() => {
    return ["All", ...Array.from(new Set(projects.map((p) => p.cat)))];
  }, []);

  // Filtered projects
  const filteredProjects = useMemo(() => {
    if (selectedCategory === "All") return projects;
    return projects.filter((p) => p.cat === selectedCategory);
  }, [selectedCategory]);

  const activeProject = filteredProjects[activeStageIdx] || filteredProjects[0] || projects[0];

  const handleNextStage = (step: number) => {
    playTactileBlip("switch");
    setActiveStageIdx((curr) => {
      const len = filteredProjects.length;
      return (curr + step + len) % len;
    });
  };

  const stepModal = (dir: number) => {
    playTactileBlip("switch");
    setViewerModalIdx((curr) => {
      if (curr === null) return curr;
      return (curr + dir + projects.length) % projects.length;
    });
  };

  // Keyboard navigation for active stage project
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (viewerModalIdx !== null) return;
      if (e.key === "ArrowRight") handleNextStage(1);
      if (e.key === "ArrowLeft") handleNextStage(-1);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [viewerModalIdx, filteredProjects.length]);

  return (
    <section id="portfolio" className="relative mx-auto max-w-[1600px] px-5 py-24 md:px-10 md:py-36">
      {/* Top Label & Header */}
      <Label index="08">My Portfolio</Label>

      <div className="mt-10 flex flex-col items-start justify-between gap-10 lg:flex-row lg:items-end">
        <div>
          <div className="flex flex-wrap items-center gap-3 font-mono text-[11px] uppercase tracking-[0.24em] text-mute">
            <span className="flex items-center gap-2 text-accent">
              <Sparkles size={12} />
              Interactive 3D Showcase
            </span>
            <span>·</span>
            <span>{projects.length} Projects Shipped</span>
          </div>

          <h2 className="mt-4 font-display text-4xl font-black uppercase leading-[0.9] tracking-tighter text-white sm:text-6xl md:text-7xl lg:text-[5.5rem]">
            <span className="bg-gradient-to-b from-white via-gray-200 to-gray-600 bg-clip-text text-transparent">
              Selected
            </span>{" "}
            <span className="font-serif font-light lowercase italic text-gray-300">
              work
            </span>
            <sup className="ml-2 align-top font-mono text-base font-normal text-accent md:text-xl">
              ({pad(projects.length)})
            </sup>
          </h2>
        </div>

        {/* View Mode Toggle: 3D Stage vs Interactive Grid */}
        <div className="flex items-center gap-3">
          <div className="flex items-center rounded-full border border-white/15 bg-white/5 p-1 font-mono text-[10px] uppercase tracking-wider">
            <button
              onClick={() => {
                playTactileBlip("switch");
                setViewStyle("stage");
              }}
              className={`flex items-center gap-1.5 rounded-full px-4 py-2 transition-all ${
                viewStyle === "stage"
                  ? "bg-accent font-semibold text-ink shadow-md"
                  : "text-mute hover:text-white"
              }`}
            >
              <Monitor size={12} />
              <span>3D Stage</span>
            </button>

            <button
              onClick={() => {
                playTactileBlip("switch");
                setViewStyle("grid");
              }}
              className={`flex items-center gap-1.5 rounded-full px-4 py-2 transition-all ${
                viewStyle === "grid"
                  ? "bg-accent font-semibold text-ink shadow-md"
                  : "text-mute hover:text-white"
              }`}
            >
              <Grid3X3 size={12} />
              <span>Grid View</span>
            </button>
          </div>
        </div>
      </div>

      {/* Category Pills & Controls Bar */}
      <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => {
            const active = selectedCategory === cat;
            const count =
              cat === "All"
                ? projects.length
                : projects.filter((p) => p.cat === cat).length;

            return (
              <button
                key={cat}
                onClick={() => {
                  playTactileBlip("click");
                  setSelectedCategory(cat);
                  setActiveStageIdx(0);
                }}
                className={`relative rounded-full px-4 py-2 font-mono text-[11px] uppercase tracking-[0.16em] transition-colors ${
                  active ? "text-ink" : "text-mute hover:text-bone"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="work-active-cat"
                    className="absolute inset-0 rounded-full bg-accent"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-1.5">
                  <span>{cat}</span>
                  <span className={`text-[9px] ${active ? "text-ink/80" : "text-mute/60"}`}>
                    ({pad(count)})
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        {viewStyle === "stage" && (
          /* Device Switcher for the 3D Stage */
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-mute">
            <span>Device Preview:</span>
            <div className="flex items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1">
              <button
                type="button"
                onClick={() => {
                  playTactileBlip("switch");
                  setDeviceMode("desktop");
                }}
                className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 transition-all ${
                  deviceMode === "desktop"
                    ? "bg-white/20 text-white font-semibold"
                    : "text-mute hover:text-white"
                }`}
              >
                <Laptop size={12} />
                <span>Desktop</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  playTactileBlip("switch");
                  setDeviceMode("mobile");
                }}
                className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 transition-all ${
                  deviceMode === "mobile"
                    ? "bg-white/20 text-white font-semibold"
                    : "text-mute hover:text-white"
                }`}
              >
                <Smartphone size={12} />
                <span>Mobile</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ================= VIEW STYLE A: 3D SPATIAL STAGE ================= */}
      {viewStyle === "stage" ? (
        <div className="mt-12 space-y-12 md:mt-16">
          <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14 xl:gap-20">
            {/* Left Column: Active Project HUD & Telemetry */}
            <div className="flex flex-col items-start lg:col-span-5">
              <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em]">
                <span className="flex items-center gap-2 font-bold text-accent">
                  <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
                  {pad(activeStageIdx + 1)} / {pad(filteredProjects.length)}
                </span>
                <span className="text-white/20">|</span>
                <span className="rounded-full border border-white/15 bg-white/[0.03] px-3 py-1 text-[10px] text-bone/80">
                  {activeProject.cat}
                </span>
                {activeProject.year && (
                  <span className="text-[10px] text-mute">{activeProject.year}</span>
                )}
              </div>

              {/* Title with animated key switch */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeProject.slug}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.35, ease }}
                >
                  <h3 className="mt-4 font-display text-4xl font-extrabold uppercase leading-[0.95] tracking-tight text-white sm:text-5xl lg:text-[3.2rem]">
                    {activeProject.title}
                  </h3>

                  {activeProject.role && (
                    <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.18em] text-accent">
                      {activeProject.role}
                    </p>
                  )}

                  <p className="mt-4 text-sm leading-relaxed text-bone/70 sm:text-base">
                    {activeProject.desc}
                  </p>

                  {/* Tech Tags */}
                  {activeProject.tags && (
                    <div className="mt-6 flex flex-wrap gap-2">
                      {activeProject.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-white/10 bg-white/[0.02] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-mute"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Stage Actions */}
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Magnetic strength={0.25}>
                  <a
                    href={activeProject.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-2 rounded-full bg-accent px-6 py-3.5 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-ink transition-all hover:bg-white"
                  >
                    <RollText>Open Live Website</RollText>
                    <ArrowUpRight
                      size={15}
                      className="transition-transform duration-300 group-hover:rotate-45"
                    />
                  </a>
                </Magnetic>

                <Magnetic strength={0.25}>
                  <a
                    href={activeProject.code}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`View code for ${activeProject.title}`}
                    className="flex items-center gap-2 rounded-full border border-white/20 bg-white/[0.02] px-4 py-3.5 font-mono text-[11px] uppercase tracking-[0.16em] text-bone transition-colors hover:border-bone hover:bg-white/10"
                  >
                    <GithubIcon className="h-3.5 w-3.5" />
                    <span>Code</span>
                  </a>
                </Magnetic>

                <button
                  type="button"
                  onClick={() => {
                    const globalIdx = projects.findIndex((p) => p.slug === activeProject.slug);
                    playTactileBlip("open");
                    setViewerModalIdx(globalIdx);
                  }}
                  className="flex items-center gap-1.5 rounded-full border border-white/15 px-4 py-3.5 font-mono text-[11px] uppercase tracking-[0.16em] text-mute transition-colors hover:border-white/30 hover:text-white"
                >
                  <Eye size={13} />
                  <span>Inspect Case</span>
                </button>
              </div>

              {/* Navigation Arrows & Keyboard Hint */}
              <div className="mt-8 flex items-center gap-4 font-mono text-xs">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleNextStage(-1)}
                    className="grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-white/5 text-white transition-all hover:border-accent hover:bg-accent hover:text-ink"
                    aria-label="Previous project"
                  >
                    <ArrowLeft size={16} />
                  </button>
                  <button
                    onClick={() => handleNextStage(1)}
                    className="grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-white/5 text-white transition-all hover:border-accent hover:bg-accent hover:text-ink"
                    aria-label="Next project"
                  >
                    <ArrowRight size={16} />
                  </button>
                </div>
                <span className="text-[10px] uppercase tracking-wider text-mute">
                  Use ← → Arrow Keys to Switch
                </span>
              </div>
            </div>

            {/* Right Column: 3D Floating Stage Device */}
            <div className="lg:col-span-7">
              <StageDeviceViewport
                project={activeProject}
                deviceMode={deviceMode}
                onOpenViewer={() => {
                  const globalIdx = projects.findIndex((p) => p.slug === activeProject.slug);
                  playTactileBlip("open");
                  setViewerModalIdx(globalIdx);
                }}
              />
            </div>
          </div>

          {/* Interactive Project Scrubber / Filmstrip Bar */}
          <div className="rounded-[1.8rem] border border-white/10 bg-[#121210] p-4 sm:p-6">
            <div className="flex items-center justify-between pb-3 text-mute font-mono text-[10px] uppercase tracking-widest">
              <span>Quick Scrubber · All {projects.length} Works</span>
              <span className="text-bone">Tap Card to Load onto Stage</span>
            </div>

            <div className="no-scrollbar flex gap-3 overflow-x-auto pb-2">
              {filteredProjects.map((p, idx) => {
                const active = idx === activeStageIdx;
                return (
                  <button
                    key={p.slug}
                    type="button"
                    onClick={() => {
                      playTactileBlip("switch");
                      setActiveStageIdx(idx);
                    }}
                    className={`group relative flex w-[180px] sm:w-[220px] shrink-0 flex-col overflow-hidden rounded-xl border p-2 text-left transition-all ${
                      active
                        ? "border-accent bg-accent/10 shadow-[0_0_20px_rgba(255,91,46,0.25)]"
                        : "border-white/10 bg-white/[0.02] hover:border-white/25"
                    }`}
                  >
                    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg bg-black">
                      <div className="relative -mt-[11.2%] h-[112%] w-full">
                        <SiteImage
                          file={p.img}
                          alt={p.title}
                          className="w-full object-cover object-top"
                          loading="lazy"
                        />
                      </div>
                    </div>
                    <div className="mt-2 flex items-center justify-between font-mono text-[9px]">
                      <span className={active ? "text-accent font-bold" : "text-mute"}>
                        {pad(idx + 1)}
                      </span>
                      <span className="truncate font-sans font-bold text-white pl-2">
                        {p.title}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* ================= VIEW STYLE B: 3D INTERACTIVE GRID ================= */
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 md:mt-16">
          {filteredProjects.map((p) => {
            const globalIndex = projects.findIndex((proj) => proj.slug === p.slug);
            return (
              <GridProjectCard
                key={p.slug}
                project={p}
                index={globalIndex}
                onOpenViewer={() => {
                  playTactileBlip("open");
                  setViewerModalIdx(globalIndex);
                }}
              />
            );
          })}
        </div>
      )}

      {/* GitHub Callout Footer Banner */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease }}
        className="mt-20 flex flex-col items-center justify-between gap-8 rounded-[2.2rem] border border-white/12 bg-gradient-to-b from-[#141412] to-[#0a0a09] p-8 text-center sm:p-12 md:flex-row md:text-left lg:p-16"
      >
        <div>
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-accent">
            GitHub Archive · Open Source
          </span>
          <h3 className="mt-2 font-display text-3xl font-extrabold uppercase leading-tight tracking-tight text-white md:text-4xl">
            Want to inspect all project repositories?
          </h3>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-mute">
            Browse all public repositories, algorithms, micro-interactions, and experimental code
            showcases directly on my GitHub profile.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Magnetic strength={0.35}>
            <a
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 rounded-full bg-accent px-7 py-4 font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-ink transition-transform hover:scale-105"
            >
              <GithubIcon className="h-4 w-4" />
              <RollText>Browse GitHub</RollText>
              <ArrowUpRight
                size={16}
                className="transition-transform duration-300 group-hover:rotate-45"
              />
            </a>
          </Magnetic>

          <Magnetic strength={0.25}>
            <a
              href="#contact"
              className="flex items-center gap-2 rounded-full border border-white/20 px-6 py-4 font-mono text-[11px] uppercase tracking-[0.2em] text-bone transition-colors hover:border-bone hover:bg-white/10"
            >
              <RollText>Start a Project</RollText>
            </a>
          </Magnetic>
        </div>
      </motion.div>

      {/* Case Study Modal */}
      <ProjectViewerModal
        index={viewerModalIdx}
        onClose={() => setViewerModalIdx(null)}
        onNext={stepModal}
      />
    </section>
  );
}
