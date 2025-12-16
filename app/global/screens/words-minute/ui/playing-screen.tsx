import { motion } from "motion/react";
import { useEffect, useRef } from "react";
import { formatTime } from "../domain/utilities";

interface PlayingScreenProps {
  currentWord: string;
  typedWord: string;
  timeRemaining: number;
  characterCount: number;
  onInput: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function PlayingScreen({
  currentWord,
  typedWord,
  timeRemaining,
  characterCount,
  onInput,
  onSubmit,
}: PlayingScreenProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus input
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Calculate progress percentage
  const progressPercentage = ((60 - timeRemaining) / 60) * 100;

  // Check if each character is correct
  const getCharacterClass = (index: number) => {
    if (index >= typedWord.length) return "text-muted-foreground";
    if (typedWord[index]?.toLowerCase() === currentWord[index]?.toLowerCase()) {
      return "text-green-500";
    }
    return "text-red-500";
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[60vh] gap-8">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-secondary z-50">
        <motion.div
          className="h-full bg-primary"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercentage}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Timer */}
      <motion.div
        key={timeRemaining}
        initial={{ scale: 1.2, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-4xl font-bold text-primary"
      >
        {formatTime(timeRemaining)}
      </motion.div>

      {/* Word Display */}
      <motion.div
        className="relative"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <form onSubmit={onSubmit} className="relative flex items-center flex-col">
          {/* Target word (background) */}
          <motion.div className="inset-0 flex items-center justify-center pointer-events-none">
            <label htmlFor="input">
              <div className="text-5xl md:text-7xl font-mono opacity-30">
                {currentWord.split("").map((char, index) => (
                  <span key={index} className={getCharacterClass(index)}>
                    {char}
                  </span>
                ))}
              </div></label>
          </motion.div>

          {/* Input field */}
          <input
            ref={inputRef}
            autoComplete="off"
            autoFocus
            name="input"
            spellCheck={false}
            autoCapitalize="off"
            placeholder="..."
            autoCorrect="off"
            className="text-5xl md:text-7xl font-mono bg-transparent border-none focus:outline-none text-center caret-primary min-w-[300px] md:min-w-[500px]"
            type="text"
            value={typedWord}
            onChange={(e) => onInput(e.target.value)}
          />
        </form>
      </motion.div>

      {/* Score Display */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-2xl font-semibold text-muted-foreground flex items-center gap-2"
      >
        <span>Score:</span>
        <span className="text-primary">{characterCount}</span>
        <span className="text-sm">characters</span>
      </motion.div>

      {/* Visual Background Effect */}
      <div
        className="fixed inset-0 bg-gradient-to-br from-primary/20 to-transparent pointer-events-none -z-10"
        style={{
          opacity: 0.1 + (characterCount / 500) * 0.3,
        }}
      />
    </div>
  );
}
