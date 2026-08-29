import { useEffect } from "react";

const SuccessPopup = ({ gender, onClose }) => {
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  const fireworks = [
    { top: "10%", left: "8%", size: "60px", delay: "0s" },
    { top: "16%", right: "8%", size: "72px", delay: "0.5s" },
    { top: "45%", left: "3%", size: "48px", delay: "1s" },
    { top: "48%", right: "3%", size: "55px", delay: "1.5s" },
    { top: "80%", left: "10%", size: "44px", delay: "0.3s" },
    { top: "76%", right: "9%", size: "50px", delay: "1.2s" },
  ];

  const confettiColors = [
    "#f472b6",
    "#c084fc",
    "#60a5fa",
    "#fbbf24",
  ];

  const confetti = Array.from({ length: 18 }).map((_, i) => ({
    left: `${(i * 57) % 100}%`,
    size: 4 + ((i * 7) % 5),
    delay: `${(i % 8) * 0.4}s`,
    duration: `${3.5 + (i % 4) * 0.6}s`,
    color: confettiColors[i % confettiColors.length],
    rounded: i % 2 === 0,
  }));

  const greeting =
  gender === "female"
    ? "NANDRI, NANBI!"
    : gender === "male"
    ? "NANDRI, NANBA!"
    : "NANDRI, NANBA!";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-black/80 px-4 py-4 backdrop-blur-md sm:px-6">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-pink-600/15 blur-[120px]" />

        <div className="absolute bottom-[-120px] right-[-100px] h-[350px] w-[350px] rounded-full bg-blue-600/15 blur-[110px]" />

        <div className="absolute left-[-100px] top-[-100px] h-[300px] w-[300px] rounded-full bg-amber-500/10 blur-[110px]" />

        {fireworks.map((firework, index) => (
          <div
            key={index}
            className="firework absolute"
            style={{
              top: firework.top,
              left: firework.left,
              right: firework.right,
              width: firework.size,
              height: firework.size,
              animationDelay: firework.delay,
            }}
          >
            {Array.from({ length: 12 }).map((_, i) => (
              <span
                key={i}
                className="spark"
                style={{
                  "--angle": `${i * 30}deg`,
                  "--distance": `${parseInt(firework.size) / 2}px`,
                  "--delay": `${i * 0.04}s`,
                  background:
                    i % 4 === 0
                      ? "#f472b6"
                      : i % 4 === 1
                      ? "#c084fc"
                      : i % 4 === 2
                      ? "#fbbf24"
                      : "#60a5fa",
                }}
              />
            ))}
          </div>
        ))}

        {confetti.map((piece, i) => (
          <span
            key={i}
            className="confetti-piece"
            style={{
              left: piece.left,
              width: piece.size,
              height: piece.rounded
                ? piece.size
                : piece.size * 2.2,
              background: piece.color,
              borderRadius: piece.rounded
                ? "999px"
                : "2px",
              "--delay": piece.delay,
              "--duration": piece.duration,
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes firework {
          0% {
            transform: scale(0.15);
            opacity: 0;
          }

          20% {
            opacity: 1;
          }

          65% {
            transform: scale(1);
            opacity: 1;
          }

          100% {
            transform: scale(1.25);
            opacity: 0;
          }
        }

        @keyframes spark {
          0% {
            transform: rotate(var(--angle)) translateY(0);
            opacity: 0;
          }

          20% {
            opacity: 1;
          }

          70% {
            opacity: 1;
          }

          100% {
            transform:
              rotate(var(--angle))
              translateY(var(--distance));
            opacity: 0;
          }
        }

        @keyframes confettiFall {
          0% {
            transform: translateY(-10%) rotate(0deg);
            opacity: 0;
          }

          10% {
            opacity: 0.85;
          }

          90% {
            opacity: 0.85;
          }

          100% {
            transform: translateY(110vh) rotate(360deg);
            opacity: 0;
          }
        }

        .firework {
          animation: firework 2.8s ease-out infinite;
        }

        .spark {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 2px;
          height: 16px;
          border-radius: 999px;
          transform-origin: 50% 100%;
          animation: spark 1.8s ease-out infinite;
          animation-delay: var(--delay);
        }

        .confetti-piece {
          position: absolute;
          top: -5%;
          animation: confettiFall linear infinite;
          animation-delay: var(--delay);
          animation-duration: var(--duration);
        }
      `}</style>

      <div className="relative w-full max-w-[520px] overflow-hidden rounded-[24px] border border-white/10 bg-[#080812] shadow-[0_25px_100px_rgba(0,0,0,0.7)]">
        <div className="absolute inset-x-0 top-0 z-30 h-px bg-gradient-to-r from-transparent via-pink-500 to-transparent" />

        <div className="relative h-[190px] overflow-hidden sm:h-[225px]">
          <img
            src="/images/jananayagan-hero3.jpeg"
            alt="Jana Nayagan"
            className="absolute inset-0 h-full w-full object-cover object-[68%_8%] sm:object-[68%_5%]"
          />

          <div className="absolute inset-x-0 bottom-0 h-[42%] bg-gradient-to-t from-[#080812] via-[#080812]/35 to-transparent" />

          <div className="absolute inset-0 bg-gradient-to-r from-[#03030d]/35 via-transparent to-[#03030d]/20" />

          <div className="absolute left-4 top-4 z-20 sm:left-5 sm:top-5">
            <img
              src="/images/Logo_zee5.png"
              alt="ZEE5"
              className="h-[48px] w-[48px] object-contain drop-shadow-[0_4px_10px_rgba(0,0,0,0.6)] sm:h-[55px] sm:w-[55px]"
            />
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-4 top-4 z-30 flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-black/40 text-lg leading-none text-white backdrop-blur-md transition hover:bg-white/10"
          >
            ×
          </button>
        </div>

        <div className="relative px-5 pb-5 pt-0 text-center sm:px-8 sm:pb-7">
          <div className="mb-2 flex items-center justify-center gap-2">
            <span className="h-px w-6 bg-pink-500" />

            <span className="text-[7px] font-bold tracking-[0.28em] text-pink-400 sm:text-[8px]">
              ENTRY CONFIRMED
            </span>

            <span className="h-px w-6 bg-pink-500" />
          </div>

          <h2 className="text-[25px] font-black uppercase leading-none tracking-[-0.04em] text-white sm:text-[32px]">
            {greeting}
          </h2>

          <p className="mt-3 text-[12px] font-medium leading-5 text-gray-300 sm:text-[13px]">
            Your entry has been received.
          </p>

          <p className="mx-auto mt-2 max-w-[420px] text-[10px] leading-5 text-gray-400 sm:text-[12px]">
            Keep an eye on{" "}
            <span className="font-bold text-white">
              @zee5tamil
            </span>{" "}
            to find out if you've won an exclusive
            Thalapathy lenticular poster.
          </p>

          <div className="mx-auto my-3 h-px w-12 bg-gradient-to-r from-transparent via-pink-500 to-transparent" />

          <p className="text-[11px] font-semibold italic text-white sm:text-[12px]">
            Until then… one more watch? 😉
          </p>

          <button
            type="button"
            onClick={onClose}
            className="mt-4 w-full rounded-lg bg-gradient-to-r from-pink-600 via-fuchsia-500 to-blue-600 px-5 py-2.5 text-[9px] font-black uppercase tracking-[0.18em] text-white shadow-[0_8px_25px_rgba(236,72,153,0.2)] transition hover:scale-[1.01] active:scale-[0.99] sm:py-3 sm:text-[10px]"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessPopup;