import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router";

type Phase = "idle" | "collecting" | "countdown" | "result";

interface TouchPoint {
  id: number;
  x: number;
  y: number;
  color: string;
  isWinner: boolean;
}

const COLORS = [
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
  "#96CEB4",
  "#FFEAA7",
  "#DDA0DD",
  "#98D8C8",
  "#FFB347",
];

const COUNTDOWN_START = 3;
const MIN_FINGERS = 2;
const MAX_FINGERS = 8;
const HOLD_DELAY_MS = 800;

function getInstructions(phase: Phase, count: number) {
  if (phase === "idle") return "Pon los dedos en la pantalla";
  if (phase === "collecting") {
    const remaining = MIN_FINGERS - count;
    if (remaining > 0)
      return `Necesitas ${remaining} dedo${remaining !== 1 ? "s" : ""} más`;
    return "¡Mantén los dedos!";
  }
  return null;
}

export function PickerGame() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [touches, setTouches] = useState<Map<number, TouchPoint>>(new Map());
  const [countdown, setCountdown] = useState(COUNTDOWN_START);
  const [winnerId, setWinnerId] = useState<number | null>(null);

  const touchesRef = useRef<Map<number, TouchPoint>>(new Map());
  const colorIndexRef = useRef(0);
  const holdTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countdownTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const phaseRef = useRef<Phase>("idle");
  const countdownRef = useRef(COUNTDOWN_START);

  const clearTimers = () => {
    clearTimeout(holdTimerRef.current ?? undefined);
    clearTimeout(countdownTimerRef.current ?? undefined);
  };

  const resetGame = useCallback(() => {
    clearTimers();
    touchesRef.current = new Map();
    colorIndexRef.current = 0;
    setTouches(new Map());
    setPhase("idle");
    phaseRef.current = "idle";
    setCountdown(COUNTDOWN_START);
    countdownRef.current = COUNTDOWN_START;
    setWinnerId(null);
  }, []);

  const pickWinner = useCallback(() => {
    const ids = Array.from(touchesRef.current.keys());
    if (ids.length === 0) return;
    const winnerTouchId = ids[Math.floor(Math.random() * ids.length)];

    const updated = new Map(touchesRef.current);
    for (const [id, tp] of updated) {
      updated.set(id, { ...tp, isWinner: id === winnerTouchId });
    }
    touchesRef.current = updated;
    setTouches(new Map(updated));
    setWinnerId(winnerTouchId);
    setPhase("result");
    phaseRef.current = "result";
  }, []);

  const tickCountdown = useCallback(() => {
    if (phaseRef.current !== "countdown") return;
    countdownRef.current -= 1;
    if (countdownRef.current <= 0) {
      setCountdown(0);
      pickWinner();
    } else {
      setCountdown(countdownRef.current);
      countdownTimerRef.current = setTimeout(tickCountdown, 1000);
    }
  }, [pickWinner]);

  const startCountdown = useCallback(() => {
    if (phaseRef.current === "countdown" || phaseRef.current === "result")
      return;
    countdownRef.current = COUNTDOWN_START;
    setCountdown(COUNTDOWN_START);
    setPhase("countdown");
    phaseRef.current = "countdown";
    countdownTimerRef.current = setTimeout(tickCountdown, 1000);
  }, [tickCountdown]);

  const scheduleCountdown = useCallback(() => {
    clearTimeout(holdTimerRef.current ?? undefined);
    holdTimerRef.current = setTimeout(() => {
      if (
        touchesRef.current.size >= MIN_FINGERS &&
        phaseRef.current === "collecting"
      ) {
        startCountdown();
      }
    }, HOLD_DELAY_MS);
  }, [startCountdown]);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      e.preventDefault();
      if (phaseRef.current === "result") return;

      const current = new Map(touchesRef.current);
      for (const touch of Array.from(e.changedTouches)) {
        if (current.size >= MAX_FINGERS) break;
        if (!current.has(touch.identifier)) {
          current.set(touch.identifier, {
            id: touch.identifier,
            x: touch.clientX,
            y: touch.clientY,
            color: COLORS[colorIndexRef.current % COLORS.length],
            isWinner: false,
          });
          colorIndexRef.current++;
        }
      }

      touchesRef.current = current;
      setTouches(new Map(current));

      if (current.size >= MIN_FINGERS && phaseRef.current !== "countdown") {
        phaseRef.current = "collecting";
        setPhase("collecting");
        scheduleCountdown();
      } else if (current.size > 0 && phaseRef.current === "idle") {
        phaseRef.current = "collecting";
        setPhase("collecting");
      }
    },
    [scheduleCountdown]
  );

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    if (phaseRef.current === "result") return;

    const current = new Map(touchesRef.current);
    for (const touch of Array.from(e.changedTouches)) {
      const existing = current.get(touch.identifier);
      if (existing) {
        current.set(touch.identifier, {
          ...existing,
          x: touch.clientX,
          y: touch.clientY,
        });
      }
    }
    touchesRef.current = current;
    setTouches(new Map(current));
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      e.preventDefault();
      if (phaseRef.current === "result") return;

      const current = new Map(touchesRef.current);
      for (const touch of Array.from(e.changedTouches)) {
        current.delete(touch.identifier);
      }
      touchesRef.current = current;
      setTouches(new Map(current));

      if (phaseRef.current === "countdown") {
        // Finger lifted during countdown → reset
        clearTimeout(countdownTimerRef.current ?? undefined);
        countdownRef.current = COUNTDOWN_START;
        setCountdown(COUNTDOWN_START);

        if (current.size >= MIN_FINGERS) {
          phaseRef.current = "collecting";
          setPhase("collecting");
          scheduleCountdown();
        } else {
          phaseRef.current = current.size > 0 ? "collecting" : "idle";
          setPhase(current.size > 0 ? "collecting" : "idle");
        }
      } else {
        if (current.size < MIN_FINGERS) {
          clearTimeout(holdTimerRef.current ?? undefined);
        }
        const nextPhase = current.size === 0 ? "idle" : "collecting";
        phaseRef.current = nextPhase;
        setPhase(nextPhase);
      }
    },
    [scheduleCountdown]
  );

  useEffect(() => () => clearTimers(), []);

  const touchArray = Array.from(touches.values());
  const instructions = getInstructions(phase, touchArray.length);

  return (
    <div
      className="fixed inset-0 overflow-hidden select-none"
      style={{
        touchAction: "none",
        background:
          "radial-gradient(ellipse at center, #1a1a2e 0%, #0d0d1a 60%, #000000 100%)",
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
    >
      {/* Stars background */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          backgroundImage:
            "radial-gradient(1px 1px at 20% 30%, rgba(255,255,255,0.3) 0%, transparent 100%), radial-gradient(1px 1px at 50% 20%, rgba(255,255,255,0.25) 0%, transparent 100%), radial-gradient(1px 1px at 80% 50%, rgba(255,255,255,0.2) 0%, transparent 100%), radial-gradient(1px 1px at 40% 70%, rgba(255,255,255,0.3) 0%, transparent 100%), radial-gradient(1px 1px at 70% 80%, rgba(255,255,255,0.2) 0%, transparent 100%), radial-gradient(1px 1px at 10% 60%, rgba(255,255,255,0.25) 0%, transparent 100%), radial-gradient(1px 1px at 90% 10%, rgba(255,255,255,0.3) 0%, transparent 100%)",
        }}
      />

      {/* Back button */}
      <Link
        to="/"
        className="absolute top-4 left-4 z-50 text-white/40 hover:text-white/80 transition-colors text-sm pointer-events-auto"
        style={{ touchAction: "auto" }}
      >
        ← Volver
      </Link>

      {/* Title */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 text-center pointer-events-none">
        <p className="text-white/30 text-xs uppercase tracking-widest">
          Elige al azar
        </p>
      </div>

      {/* Touch circles */}
      <AnimatePresence>
        {touchArray.map((touch) => {
          const isWinner = phase === "result" && touch.isWinner;
          const isLoser = phase === "result" && !touch.isWinner;
          return (
            <motion.div
              key={touch.id}
              className="absolute rounded-full pointer-events-none"
              style={{
                left: touch.x,
                top: touch.y,
                x: "-50%",
                y: "-50%",
                backgroundColor: touch.color,
                width: 90,
                height: 90,
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: isWinner ? [1, 1.4, 1.2, 1.4, 1.2] : isLoser ? 0.4 : 1,
                opacity: isLoser ? 0.15 : 1,
                boxShadow: isWinner
                  ? [
                      `0 0 40px 20px ${touch.color}99`,
                      `0 0 80px 40px ${touch.color}cc`,
                      `0 0 60px 30px ${touch.color}aa`,
                    ]
                  : isLoser
                    ? `0 0 0px 0px ${touch.color}00`
                    : `0 0 30px 12px ${touch.color}66`,
              }}
              exit={{ scale: 0, opacity: 0, transition: { duration: 0.2 } }}
              transition={{
                duration: isWinner ? 0.8 : 0.3,
                repeat: isWinner ? Number.POSITIVE_INFINITY : 0,
                repeatType: "reverse",
              }}
            />
          );
        })}
      </AnimatePresence>

      {/* Ripple rings on active touches (non-result phases) */}
      {phase !== "result" &&
        touchArray.map((touch) => (
          <motion.div
            key={`ring-${touch.id}`}
            className="absolute rounded-full pointer-events-none border-2"
            style={{
              left: touch.x,
              top: touch.y,
              x: "-50%",
              y: "-50%",
              borderColor: touch.color,
              width: 90,
              height: 90,
            }}
            animate={{
              scale: [1, 2.2],
              opacity: [0.6, 0],
            }}
            transition={{
              duration: 1.2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeOut",
            }}
          />
        ))}

      {/* Instructions overlay */}
      <AnimatePresence>
        {instructions && (
          <motion.div
            key="instructions"
            className="absolute inset-0 flex flex-col items-center justify-end pb-16 pointer-events-none"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.4 }}
          >
            <p className="text-white/50 text-lg font-light text-center px-8">
              {instructions}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Countdown number */}
      <AnimatePresence mode="wait">
        {phase === "countdown" && (
          <motion.div
            key={countdown}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            initial={{ scale: 2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.4, opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            <span
              className="font-bold text-white select-none"
              style={{
                fontSize: "clamp(6rem, 30vw, 20rem)",
                textShadow: "0 0 60px rgba(255,255,255,0.4)",
                lineHeight: 1,
              }}
            >
              {countdown}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Result overlay */}
      <AnimatePresence>
        {phase === "result" && winnerId !== null && (
          <motion.div
            key="result"
            className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <motion.p
              className="text-white font-bold text-center"
              style={{
                fontSize: "clamp(2rem, 8vw, 5rem)",
                textShadow: `0 0 40px ${touches.get(winnerId)?.color ?? "#fff"}`,
              }}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
            >
              🎉 ¡Elegido!
            </motion.p>

            <motion.button
              className="pointer-events-auto mt-12 px-8 py-4 rounded-full text-white font-semibold text-lg border border-white/20 backdrop-blur-sm transition-colors"
              style={{ background: "rgba(255,255,255,0.1)" }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5 }}
              onClick={resetGame}
              onTouchEnd={(e) => {
                e.stopPropagation();
                resetGame();
              }}
              whileHover={{ background: "rgba(255,255,255,0.2)" }}
            >
              Jugar de nuevo
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Idle hint (large centered) */}
      <AnimatePresence>
        {phase === "idle" && (
          <motion.div
            key="idle"
            className="absolute inset-0 flex flex-col items-center justify-center gap-4 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            >
              <span style={{ fontSize: "clamp(3rem, 12vw, 7rem)" }}>✋</span>
            </motion.div>
            <p
              className="text-white/60 font-light text-center px-8"
              style={{ fontSize: "clamp(1rem, 4vw, 1.75rem)" }}
            >
              Todos ponen un dedo
              <br />
              <span className="text-white/30 text-sm">2 – 8 jugadores</span>
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
