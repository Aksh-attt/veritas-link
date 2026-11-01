import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { VeraStateType } from '../../types';

interface VeraAvatarProps {
  state?: VeraStateType;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'hero';
  showSpeech?: boolean;
  speechText?: string;
  className?: string;
  interactive?: boolean;
  onClick?: () => void;
}

export const VeraAvatar: React.FC<VeraAvatarProps> = ({
  state = 'IDLE',
  size = 'md',
  showSpeech = false,
  speechText,
  className = '',
  interactive = true,
  onClick,
}) => {
  const dimensions = {
    xs: { w: 36, h: 40 },
    sm: { w: 54, h: 60 },
    md: { w: 84, h: 92 },
    lg: { w: 130, h: 142 },
    hero: { w: 220, h: 240 },
  }[size];

  const defaultSpeech: Record<VeraStateType, string> = {
    IDLE: "Ready to inspect! Paste any link.",
    SCANNING: "Initializing TinyFish browser...",
    INVESTIGATING: "Tracking redirects & spotting traps...",
    SUSPICIOUS: "Anomalies found. Inspecting deeper...",
    "THREAT DETECTED": "High-risk indicators confirmed!",
    "ASSESSMENT COMPLETE": "Investigation finished. Dossier ready.",
    INCONCLUSIVE: "Host unreachable or cloaked.",
  };

  const currentSpeech = speechText || defaultSpeech[state];

  const stateColors: Record<VeraStateType, { glow: string; accent: string; pip: string }> = {
    IDLE: { glow: "rgba(129, 39, 181, 0.4)", accent: "#9D38EA", pip: "#A855F7" },
    SCANNING: { glow: "rgba(240, 68, 217, 0.5)", accent: "#F044D9", pip: "#F472B6" },
    INVESTIGATING: { glow: "rgba(0, 240, 255, 0.5)", accent: "#00F0FF", pip: "#38BDF8" },
    SUSPICIOUS: { glow: "rgba(255, 120, 111, 0.5)", accent: "#FFA099", pip: "#FB923C" },
    "THREAT DETECTED": { glow: "rgba(255, 107, 107, 0.7)", accent: "#FF6B6B", pip: "#EF4444" },
    "ASSESSMENT COMPLETE": { glow: "rgba(0, 240, 255, 0.6)", accent: "#00F0FF", pip: "#22C55E" },
    INCONCLUSIVE: { glow: "rgba(226, 206, 240, 0.4)", accent: "#E2CEF0", pip: "#94A3B8" },
  };

  const { glow, accent, pip } = stateColors[state] || stateColors.IDLE;

  return (
    <div className={`inline-flex flex-col items-center select-none ${className}`}>
      
      {/* Optional Speech Bubble (Controlled height, clean pill style) */}
      <AnimatePresence>
        {showSpeech && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="mb-2 max-w-[240px] px-3 py-1.5 rounded-xl bg-aubergine-light/95 border border-white/10 text-offWhite text-[11px] font-sans font-medium text-center shadow-lg backdrop-blur-md"
          >
            <span className="text-lavender-light">{currentSpeech}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Character Body */}
      <motion.div
        animate={
          state === 'SCANNING'
            ? { y: [0, -5, 0], rotate: [-1, 1, -1] }
            : state === 'INVESTIGATING'
            ? { y: [0, -3, 0], scale: [1, 1.02, 1] }
            : state === 'THREAT DETECTED'
            ? { x: [-1.5, 1.5, -1.5, 1.5, 0], y: [0, -3, 0] }
            : { y: [0, -6, 0] }
        }
        transition={{
          duration: state === 'THREAT DETECTED' ? 0.35 : 3.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        onClick={onClick}
        className={`relative ${interactive ? 'cursor-pointer' : 'cursor-default'}`}
        style={{ width: dimensions.w, height: dimensions.h }}
      >
        <svg
          viewBox="0 0 200 220"
          className="w-full h-full"
          style={{ filter: `drop-shadow(0 8px 24px ${glow})` }}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id={`vera-body-${size}`} x1="30" y1="20" x2="170" y2="200" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#281140" />
              <stop offset="50%" stopColor="#1A0C2B" />
              <stop offset="100%" stopColor="#0D0617" />
            </linearGradient>
            <linearGradient id={`vera-lens-${size}`} x1="60" y1="50" x2="140" y2="130" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FCFAFF" />
              <stop offset="40%" stopColor="#E2CEF0" />
              <stop offset="100%" stopColor="#8127B5" />
            </linearGradient>
          </defs>

          {/* Soft Ground Shadow */}
          <ellipse cx="100" cy="214" rx="44" ry="5" fill="#000000" opacity="0.4" />

          {/* Left Winglet Thruster */}
          <rect x="22" y="96" width="22" height="18" rx="9" fill="#9D38EA" opacity="0.8" />
          <circle cx="33" cy="105" r="3.5" fill="#00F0FF" />

          {/* Right Winglet Thruster */}
          <rect x="156" y="96" width="22" height="18" rx="9" fill="#9D38EA" opacity="0.8" />
          <circle cx="167" cy="105" r="3.5" fill="#00F0FF" />

          {/* Top Sensor Fin */}
          <path d="M 94 32 L 100 14 L 106 32 Z" fill="#00F0FF" />
          <circle cx="100" cy="13" r="4" fill="#F044D9" />

          {/* Main Capsule Body */}
          <path
            d="M 100 28 C 146 28 168 60 168 112 C 168 165 142 195 100 195 C 58 195 32 165 32 112 C 32 60 54 28 100 28 Z"
            fill={`url(#vera-body-${size})`}
            stroke="rgba(255, 255, 255, 0.15)"
            strokeWidth="2"
          />

          {/* Inner Faceplate Shield */}
          <path
            d="M 100 42 C 136 42 152 68 152 110 C 152 152 132 176 100 176 C 68 176 48 152 48 110 C 48 68 64 42 100 42 Z"
            fill="#1E0D33"
            stroke="rgba(238, 214, 245, 0.2)"
            strokeWidth="1.5"
          />

          {/* Cheek Blush Dots */}
          <circle cx="66" cy="130" r="4" fill="#F044D9" opacity="0.4" />
          <circle cx="134" cy="130" r="4" fill="#F044D9" opacity="0.4" />

          {/* Central Magnifying-Glass Eye & Iris */}
          <g transform="translate(100, 106)">
            {/* Outer Ring */}
            <circle cx="0" cy="0" r="38" fill="#130822" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="2" />
            <circle cx="0" cy="0" r="33" fill={accent} opacity="0.25" />
            <circle cx="0" cy="0" r="28" fill={`url(#vera-lens-${size})`} />

            {/* Handle Accent */}
            <rect x="25" y="25" width="16" height="6" rx="3" transform="rotate(45, 25, 25)" fill="#00F0FF" />

            {/* Scanning Radar Grid */}
            {(state === 'SCANNING' || state === 'INVESTIGATING') && (
              <motion.g
                animate={{ rotate: 360 }}
                transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
              >
                <circle cx="0" cy="0" r="20" stroke="#F044D9" strokeWidth="1" strokeDasharray="3 3" />
                <line x1="-18" y1="0" x2="18" y2="0" stroke="#00F0FF" strokeWidth="1" opacity="0.8" />
                <line x1="0" y1="-18" x2="0" y2="18" stroke="#00F0FF" strokeWidth="1" opacity="0.8" />
              </motion.g>
            )}

            {/* PUPIL STATE EXPRESSIONS */}
            {state === 'IDLE' && (
              <g>
                <circle cx="0" cy="0" r="14" fill="#130822" />
                <circle cx="-4" cy="-5" r="4.5" fill="#FCFAFF" />
                <circle cx="3" cy="4" r="2" fill="#FCFAFF" />
              </g>
            )}

            {state === 'SCANNING' && (
              <g>
                <circle cx="0" cy="0" r="14" fill="#8127B5" />
                <circle cx="0" cy="0" r="8" fill="#F044D9" />
                <circle cx="0" cy="0" r="3" fill="#00F0FF" />
              </g>
            )}

            {state === 'INVESTIGATING' && (
              <g>
                <circle cx="0" cy="0" r="16" fill="#1A0C2B" />
                <rect x="-10" y="-10" width="20" height="20" fill="none" stroke="#00F0FF" strokeWidth="1.5" strokeDasharray="3 2" />
                <circle cx="0" cy="0" r="5" fill="#FF6B6B" />
              </g>
            )}

            {state === 'SUSPICIOUS' && (
              <g>
                <ellipse cx="0" cy="2" rx="14" ry="6" fill="#130822" />
                <circle cx="-2" cy="2" r="2.5" fill="#00F0FF" />
              </g>
            )}

            {state === 'THREAT DETECTED' && (
              <g>
                <circle cx="0" cy="0" r="18" fill="#FF6B6B" />
                <circle cx="0" cy="0" r="11" fill="#130822" />
                <rect x="-2" y="-7" width="4" height="8" rx="1" fill="#00F0FF" />
                <circle cx="0" cy="5" r="1.8" fill="#00F0FF" />
              </g>
            )}

            {state === 'ASSESSMENT COMPLETE' && (
              <g>
                <path d="M -12 2 Q 0 -10 12 2" stroke="#130822" strokeWidth="4" strokeLinecap="round" fill="none" />
                <path d="M 10 -10 L 12 -6 L 16 -4 L 12 -2 L 10 2 L 8 -2 L 4 -4 L 8 -6 Z" fill="#00F0FF" />
              </g>
            )}

            {state === 'INCONCLUSIVE' && (
              <g>
                <path d="M -6 -6 Q 0 -12 6 -6 Q 9 0 3 4 Q -3 8 -6 3" stroke="#130822" strokeWidth="3" strokeLinecap="round" fill="none" />
                <circle cx="0" cy="9" r="2" fill="#130822" />
              </g>
            )}

            {/* Lens Gloss Reflection */}
            <path d="M -15 -15 A 20 20 0 0 1 6 -20 A 16 16 0 0 0 -11 -9 Z" fill="#FFFFFF" opacity="0.6" />
          </g>

          {/* Interlocking Link Emblem on Chest */}
          <g transform="translate(100, 166)">
            <rect x="-14" y="-7" width="28" height="14" rx="7" fill="rgba(0, 240, 255, 0.2)" stroke="#00F0FF" strokeWidth="1" />
            <circle cx="-5" cy="0" r="3" stroke="#00F0FF" strokeWidth="1.2" fill="none" />
            <circle cx="5" cy="0" r="3" stroke="#00F0FF" strokeWidth="1.2" fill="none" />
          </g>
        </svg>
      </motion.div>

      {/* Clean Status Pill */}
      <div className="mt-1.5 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono font-medium text-lavender">
        <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ backgroundColor: pip }} />
        <span>VERA // {state}</span>
      </div>

    </div>
  );
};
