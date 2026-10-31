import { useEffect, useRef, useState, type MouseEvent as ReactMouseEvent } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  ArrowRight,
  Crosshair,
  Eye,
  Maximize2,
  Shield,
  X,
  ZoomIn,
} from "lucide-react";
import { profile } from "../data";
import { ease, lockScroll, playTactileBlip } from "../lib";
import { FadeUp, Label, Magnetic, SiteImage, SplitText } from "../components/ui";

const COMMANDS = ["ATTENTION", "STAND AT EASE", "SALUTE", "DISMISS"];

const grades = [
  { name: "Natural Sunlight", filter: "none", desc: "Original high-res camera capture" },
  { name: "Golden Parade", filter: "saturate(1.15) contrast(1.05) brightness(1.02)", desc: "Warm morning parade inspection tones" },
  { name: "35mm Cinema", filter: "sepia(.25) saturate(1.2) contrast(1.1)", desc: "Analog photojournalism documentary style" },
  { name: "Crisp Monochrome", filter: "grayscale(1) contrast(1.2) brightness(1.04)", desc: "Classic archival cadet portrait" },
];

/* ================= 3D HOLOGRAPHIC CADET ID CARD ================= */
function HologramCard() {
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const sx = useSpring(rx, { stiffness: 150, damping: 18 });
  const sy = useSpring(ry, { stiffness: 150, damping: 18 });
  const [shine, setShine] = useState({ x: 50, y: 50 });

  return (
    <motion.div
      style={{ rotateX: sx, rotateY: sy, transformPerspective: 900 }}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        ry.set((px - 0.5) * 24);
        rx.set(-(py - 0.5) * 24);
        setShine({ x: px * 100, y: py * 100 });
      }}
      onMouseLeave={() => {
        rx.set(0);
        ry.set(0);
      }}
      className="relative w-full max-w-[320px] overflow-hidden rounded-2xl border border-white/20 p-5 shadow-[0_30px_90px_-20px_rgba(0,0,0,0.85)]"
      data-cursor="Salute"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#1c1c1a] via-[#111110] to-[#080808]" />
      <div
        className="pointer-events-none absolute inset-0 opacity-60 mix-blend-overlay"
        style={{
          background: `radial-gradient(260px circle at ${shine.x}% ${shine.y}%, rgba(255,91,46,0.25), rgba(0,230,118,0.2) 50%, transparent 75%)`,
        }}
      />
      {/* Military ribbon bar */}
      <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-[#e53935] via-[#fbc02d] to-[#2e7d32]" />

      <div className="relative flex items-center gap-3 border-b border-white/10 pb-3">
        <SiteImage
          file="hii.png"
          alt="Nirob crest"
          className="h-11 w-11 rounded-full object-cover ring-2 ring-[#00e676]/40"
          loading="lazy"
        />
        <div className="min-w-0 flex-1">
          <p className="font-mono text-[8px] uppercase tracking-[0.22em] text-[#00e676]">
            7 BNCC Battalion · Junior Platoon
          </p>
          <p className="font-display text-base font-extrabold leading-tight text-white">
            CADET SGT
          </p>
        </div>
        <Crosshair size={18} className="text-[#00e676]" />
      </div>

      <div className="relative mt-3 space-y-2 font-mono text-[9px] uppercase tracking-[0.14em]">
        {[
          ["Name", profile.fullName],
          ["Role", "Cadet Sgt (Cadet Sergeant)"],
          ["Unit", "7 BNCC Battalion"],
          ["Platoon", "JCPSC Junior Platoon"],
          ["Location", "JCPSC, Sylhet, BD"],
        ].map(([k, v]) => (
          <div key={k} className="flex justify-between gap-3 border-b border-white/[0.06] pb-1.5">
            <span className="text-bone/45">{k}</span>
            <span className="truncate text-right font-medium text-bone/95">{v}</span>
          </div>
        ))}
      </div>

      <div className="relative mt-4 flex items-end justify-between">
        <div className="flex gap-[2px]">
          {Array.from({ length: 28 }).map((_, i) => (
            <span
              key={i}
              className="block bg-bone/70"
              style={{ width: i % 3 ? 1.5 : 3, height: i % 4 ? 14 : 20 }}
            />
          ))}
        </div>
        <span className="font-serif text-lg italic text-accent">Nirob.</span>
      </div>
    </motion.div>
  );
}

/* ================= MAIN BNCC HOBBY & FULL PREVIEW SECTION ================= */
export function BNCC() {
  const sectionRef = useRef<HTMLElement>(null);
  const [selectedGrade, setSelectedGrade] = useState(0);
  const [fullscreenModal, setFullscreenModal] = useState(false);
  const [activeDrillIndex, setActiveDrillIndex] = useState(2); // SALUTE default
  const [isLensZoom, setIsLensZoom] = useState(false);
  const [lensPos, setLensPos] = useState({ x: 50, y: 50 });

  // Scroll tracking for gentle depth
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const smoothScroll = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 24,
    restDelta: 0.001,
  });

  const bannerY = useTransform(smoothScroll, [0, 1], ["-6%", "6%"]);

  useEffect(() => {
    const esc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFullscreenModal(false);
    };
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, []);

  const handleMouseMoveLens = (e: ReactMouseEvent<HTMLDivElement>) => {
    if (!isLensZoom) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setLensPos({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) });
  };

  const openFullscreen = () => {
    playTactileBlip("open");
    setFullscreenModal(true);
    lockScroll(true);
  };

  const closeFullscreen = () => {
    playTactileBlip("click");
    setFullscreenModal(false);
    lockScroll(false);
  };

  return (
    <>
      <section
        id="bncc"
        ref={sectionRef}
        className="relative mx-auto max-w-[1600px] px-5 py-24 md:px-10 md:py-36"
      >
        {/* Section Label */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Label index="04">Extracurricular Passion &amp; Hobby</Label>
          <div className="flex items-center gap-2 rounded-full border border-[#00e676]/30 bg-[#00e676]/10 px-3.5 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-[#00e676]">
            <Shield size={12} />
            <span>Extracurricular Hobby · Not A Service</span>
          </div>
        </div>

        {/* Section Header */}
        <div className="mt-8 flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-end">
          <div>
            <h2 className="font-display text-4xl font-extrabold uppercase leading-[0.92] tracking-tight text-white sm:text-6xl md:text-7xl lg:text-[5.5rem]">
              <SplitText text="Cadet" />{" "}
              <span className="font-serif font-light lowercase italic text-[#00e676]">
                honor
              </span>
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-bone/70 sm:text-base">
              My proudest extracurricular hobby outside software development: serving as a{" "}
              <strong className="text-white">Cadet Sergeant (Cadet Sgt)</strong> in the{" "}
              <strong className="text-white">7 BNCC Battalion</strong> at{" "}
              <strong className="text-white">JCPSC Junior Platoon</strong> (Jalalabad Cantonment Public School &amp; College, Class 10). Drill training,
              discipline, physical parade, and comradeship.
            </p>
          </div>

          {/* Interactive Drill Command Bar */}
          <div className="flex flex-col items-start gap-2 rounded-2xl border border-white/12 bg-[#121210] p-4 font-mono sm:items-end">
            <span className="text-[9px] uppercase tracking-[0.24em] text-mute">
              Drill Telemetry · Tap Command
            </span>
            <div className="flex flex-wrap gap-1.5">
              {COMMANDS.map((cmd, idx) => {
                const active = activeDrillIndex === idx;
                return (
                  <button
                    key={cmd}
                    onClick={() => {
                      playTactileBlip("switch");
                      setActiveDrillIndex(idx);
                    }}
                    className={`rounded-lg px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider transition-all ${
                      active
                        ? "bg-[#00e676] text-black shadow-[0_0_20px_rgba(0,230,118,0.35)]"
                        : "border border-white/10 bg-white/5 text-bone/70 hover:border-white/25 hover:text-white"
                    }`}
                  >
                    {cmd}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ================= FULL PREVIEW CINEMA SHOWCASE ================= */}
        <div className="mt-12 overflow-hidden rounded-[2.2rem] border border-white/15 bg-[#0a0a09] shadow-[0_40px_120px_-20px_rgba(0,0,0,0.95)]">
          {/* Top Camera HUD Control Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 bg-[#121210] px-5 py-3.5 sm:px-8">
            <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.2em] text-bone/80">
              <span className="flex items-center gap-1.5 text-red-500">
                <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
                <span>4K FULL PREVIEW</span>
              </span>
              <span className="text-white/20">|</span>
              <span className="hidden sm:inline text-mute">
                f/1.8 · 1/500s · ISO 100 · 35mm
              </span>
              <span className="hidden md:inline text-[#00e676]">
                24.93°N, 91.98°E (JCPSC Junior Platoon, 7 BNCC Bn)
              </span>
            </div>

            {/* Quick Action Toolbar */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  playTactileBlip("switch");
                  setIsLensZoom(!isLensZoom);
                }}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider transition-all ${
                  isLensZoom
                    ? "bg-[#00e676] text-black font-semibold"
                    : "border border-white/15 bg-white/5 text-bone/80 hover:border-white/30 hover:text-white"
                }`}
                title="Toggle interactive magnifying loupe"
              >
                <ZoomIn size={12} />
                <span>{isLensZoom ? "Loupe Active" : "Loupe Zoom"}</span>
              </button>

              <button
                type="button"
                onClick={openFullscreen}
                className="flex items-center gap-1.5 rounded-full bg-accent px-4 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-ink transition-all hover:bg-white"
              >
                <Maximize2 size={12} />
                <span>Cinema View</span>
              </button>
            </div>
          </div>

          {/* Panoramic Full-Width Photo Stage */}
          <div
            className="group relative aspect-[16/10] w-full overflow-hidden bg-black sm:aspect-[16/9] lg:aspect-[21/9]"
            onMouseMove={handleMouseMoveLens}
            onClick={openFullscreen}
            data-cursor="Inspect"
          >
            {/* Main Full-Size Photo with subtle scroll glide */}
            <motion.div
              style={{ y: bannerY }}
              className="absolute -top-[8%] h-[116%] w-full"
            >
              <img
                src="/nirob/bncc.jpg"
                alt="Al Nasif MD Nirob BNCC parade inspection with Bangladesh Army officer"
                className="h-full w-full object-cover object-[45%_42%] transition-all duration-700"
                style={{ filter: grades[selectedGrade].filter }}
              />
            </motion.div>

            {/* Interactive Loupe Magnifier overlay when enabled */}
            {isLensZoom && (
              <div
                className="pointer-events-none absolute h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#00e676] bg-black shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden hidden sm:block"
                style={{
                  left: `${lensPos.x}%`,
                  top: `${lensPos.y}%`,
                }}
              >
                <div
                  className="absolute h-[400%] w-[400%]"
                  style={{
                    left: `${-lensPos.x * 4 + 50}%`,
                    top: `${-lensPos.y * 4 + 50}%`,
                  }}
                >
                  <img
                    src="/nirob/bncc.jpg"
                    alt="Zoomed inspection detail"
                    className="h-full w-full object-cover"
                    style={{ filter: grades[selectedGrade].filter }}
                  />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-4 w-4 rounded-full border border-white/40" />
                  <div className="absolute h-full w-px bg-white/20" />
                  <div className="absolute h-px w-full bg-white/20" />
                </div>
              </div>
            )}

            {/* Subtle Vignette & Frame Highlights */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/30" />
            <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_40px_rgba(0,0,0,0.7)]" />

            {/* Viewfinder Target Markings */}
            <div className="pointer-events-none absolute inset-6 hidden sm:block">
              <span className="absolute left-0 top-0 h-8 w-8 border-l-2 border-t-2 border-[#00e676]/60" />
              <span className="absolute right-0 top-0 h-8 w-8 border-r-2 border-t-2 border-[#00e676]/60" />
              <span className="absolute bottom-0 left-0 h-8 w-8 border-b-2 border-l-2 border-[#00e676]/60" />
              <span className="absolute bottom-0 right-0 h-8 w-8 border-b-2 border-r-2 border-[#00e676]/60" />
            </div>

            {/* Bottom Info Overlay */}
            <div className="absolute inset-x-5 bottom-4 flex flex-wrap items-end justify-between gap-4 sm:inset-x-8 sm:bottom-6">
              <div>
                <span className="inline-block rounded-full bg-[#00e676] px-2.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider text-black">
                  Official Inspection Ceremony
                </span>
                <h3 className="mt-2 font-display text-xl font-bold text-white sm:text-2xl md:text-3xl">
                  Handshake with Bangladesh Army Officer
                </h3>
                <p className="mt-1 font-mono text-[10px] text-bone/80 sm:text-xs">
                  Cadet Sgt Al Nasif MD Nirob · JCPSC Junior Platoon (7 BNCC Battalion)
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="hidden rounded-full border border-white/20 bg-black/60 px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-wider text-white backdrop-blur-md sm:inline">
                  Click Anywhere for Fullscreen
                </span>
                <span className="grid h-10 w-10 place-items-center rounded-full bg-[#00e676] text-black shadow-lg transition-transform duration-300 group-hover:scale-110 sm:h-12 sm:w-12">
                  <Maximize2 size={18} />
                </span>
              </div>
            </div>
          </div>

          {/* Bottom Filter & Grade Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-[#121210] px-5 py-4 sm:px-8">
            <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-mute">
              <Eye size={12} className="text-[#00e676]" />
              <span>Color Filters:</span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {grades.map((grade, idx) => {
                const active = selectedGrade === idx;
                return (
                  <button
                    key={grade.name}
                    type="button"
                    onClick={() => {
                      playTactileBlip("switch");
                      setSelectedGrade(idx);
                    }}
                    className={`flex items-center gap-2 rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-wider transition-all ${
                      active
                        ? "border border-[#00e676] bg-[#00e676]/15 text-[#00e676] font-semibold"
                        : "border border-white/10 bg-white/5 text-mute hover:border-white/25 hover:text-white"
                    }`}
                  >
                    <span
                      className={`h-2 w-2 rounded-full ${
                        active ? "bg-[#00e676]" : "bg-white/30"
                      }`}
                    />
                    <span>{grade.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ================= EDITORIAL STORY & FIELD NOTES ================= */}
        <div className="mt-16 grid items-start gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Left Column: Cadet Story */}
          <div className="space-y-8 lg:col-span-7">
            <FadeUp>
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#00e676]">
                Cadet Hobby &amp; Extracurricular Record
              </span>
              <p className="mt-3 font-display text-2xl font-bold leading-snug text-white sm:text-3xl md:text-4xl">
                “Outside web development and coding, BNCC cadet drill is my favorite extracurricular
                hobby — teaching me endurance, focus, and leadership.”
              </p>
              <p className="mt-4 text-sm leading-relaxed text-bone/70 sm:text-base">
                Being part of the Bangladesh National Cadet Corps has given me an active, disciplined
                outlet. We train on the JCPSC cantonment grounds, master synchronized parade
                movements, and build mutual respect. It balances my digital life behind the monitor
                with physical rigor and teamwork.
              </p>
            </FadeUp>

            {/* Field Notes Grid */}
            <div className="grid gap-3 pt-2 sm:grid-cols-3">
              {[
                {
                  id: "01",
                  title: "Favorite Hobby",
                  desc: "Parade drill and cadet camp are my favorite hobbies beyond code.",
                },
                {
                  id: "02",
                  title: "Teamwork & Focus",
                  desc: "Synchronized drill trains mental clarity and instant decision-making.",
                },
                {
                  id: "03",
                  title: "Cadet Sgt (Rank)",
                  desc: "Serving as Cadet Sergeant in JCPSC Junior Platoon, 7 BNCC Battalion.",
                },
              ].map((note) => (
                <div
                  key={note.id}
                  className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 transition-colors hover:border-[#00e676]/40"
                >
                  <span className="font-mono text-xs font-bold text-[#00e676]">{note.id}</span>
                  <h4 className="mt-1 font-display text-sm font-bold uppercase text-white">
                    {note.title}
                  </h4>
                  <p className="mt-1.5 text-xs leading-relaxed text-mute">{note.desc}</p>
                </div>
              ))}
            </div>

            {/* Link to beyond deck */}
            <div className="pt-2">
              <Magnetic strength={0.25}>
                <a
                  href="#beyond"
                  className="inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/5 px-6 py-3 font-mono text-[11px] uppercase tracking-[0.2em] text-white transition-colors hover:border-[#00e676] hover:bg-[#00e676] hover:text-black"
                >
                  <span>Explore 3D Photo Deck</span>
                  <ArrowRight size={14} />
                </a>
              </Magnetic>
            </div>
          </div>

          {/* Right Column: Holographic ID Card & Telemetry */}
          <div className="flex flex-col items-center justify-center gap-6 lg:col-span-5 lg:items-end lg:pr-8 xl:pr-10">
            <HologramCard />
            <div className="w-full max-w-[320px] rounded-2xl border border-white/10 bg-white/[0.02] p-4 font-mono text-[10px]">
              <div className="flex items-center justify-between text-mute">
                <span>Corps</span>
                <span className="text-white">BNCC Bangladesh</span>
              </div>
              <div className="mt-2 flex items-center justify-between text-mute">
                <span>Unit</span>
                <span className="text-[#00e676]">7 BNCC Battalion</span>
              </div>
              <div className="mt-2 flex items-center justify-between text-mute">
                <span>Platoon</span>
                <span className="text-white">JCPSC Junior Platoon</span>
              </div>
              <div className="mt-2 flex items-center justify-between text-mute">
                <span>Role</span>
                <span className="text-accent font-bold">Cadet Sgt</span>
              </div>
              <div className="mt-2 flex items-center justify-between text-mute">
                <span>Location</span>
                <span className="text-white">JCPSC, Sylhet</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FULLSCREEN CINEMA VIEW MODAL ================= */}
      <AnimatePresence>
        {fullscreenModal && (
          <motion.div
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/92 p-4 backdrop-blur-2xl md:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeFullscreen}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.45, ease }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-h-[92vh] w-full max-w-6xl overflow-hidden rounded-[2rem] border border-white/20 bg-[#0c0c0b] shadow-[0_50px_140px_rgba(0,0,0,0.98)]"
            >
              {/* Modal Top Bar */}
              <div className="flex items-center justify-between border-b border-white/10 bg-[#141412] px-6 py-4">
                <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em]">
                  <span className="text-[#00e676]">BNCC Cadet Inspection</span>
                  <span className="text-white/20">|</span>
                  <span className="text-mute">Full Resolution Panoramic Preview</span>
                </div>

                <button
                  type="button"
                  onClick={closeFullscreen}
                  aria-label="Close fullscreen view"
                  className="grid h-10 w-10 place-items-center rounded-full border border-white/20 bg-white/5 text-white transition-colors hover:bg-white hover:text-black"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Modal Photo Display */}
              <div className="relative aspect-[16/10] w-full max-h-[72vh] overflow-hidden bg-black sm:aspect-[16/9]">
                <img
                  src="/nirob/bncc.jpg"
                  alt="Al Nasif MD Nirob BNCC parade inspection in full frame"
                  className="h-full w-full object-contain"
                  style={{ filter: grades[selectedGrade].filter }}
                />
              </div>

              {/* Modal Bottom Metadata */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/10 bg-[#141412] px-6 py-4">
                <div className="font-mono text-xs">
                  <p className="font-bold text-white">
                    Cadet Sgt Al Nasif MD Nirob · 7 BNCC Battalion (JCPSC Junior Platoon)
                  </p>
                  <p className="mt-0.5 text-mute">
                    JCPSC Junior Platoon, Sylhet · Extracurricular Hobby: Drill, parade &amp; discipline.
                  </p>
                </div>

                <div className="flex items-center gap-2 font-mono text-[10px] text-mute">
                  <span>Press Esc to close</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
