import { motion } from 'motion/react';

interface ExerciseFigureProps {
  type: 'neck' | 'stretch' | 'jumping_jack' | 'squat' | 'plank' | 'arm_swing' | 'high_knees' | 'back_arch' | 'toe_touch';
  isPlaying?: boolean;
  className?: string;
}

export default function ExerciseFigure({ type, isPlaying = true, className = 'w-48 h-48' }: ExerciseFigureProps) {
  // Animated human figure with athletic student jersey (blue & emerald)
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <svg
        viewBox="0 0 200 240"
        className="w-full h-full drop-shadow-sm select-none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Soft floor shadow */}
        <ellipse cx="100" cy="225" rx="55" ry="8" fill="#E2E8F0" />

        {/* Athletic track background lines */}
        <circle cx="100" cy="120" r="85" stroke="#F1F5F9" strokeWidth="3" strokeDasharray="4 4" />

        {type === 'jumping_jack' && (
          <motion.g
            animate={
              isPlaying
                ? {
                    y: [0, -18, 0],
                  }
                : {}
            }
            transition={{ repeat: Infinity, duration: 0.9, ease: 'easeInOut' }}
          >
            {/* Head */}
            <circle cx="100" cy="55" r="16" fill="#FBBF24" />
            <circle cx="95" cy="52" r="2" fill="#1E293B" />
            <circle cx="105" cy="52" r="2" fill="#1E293B" />
            <path d="M 96 61 Q 100 65 104 61" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
            {/* Headband */}
            <rect x="84" y="44" width="32" height="6" rx="3" fill="#0284C7" />

            {/* Torso */}
            <path d="M 88 75 L 112 75 L 116 135 L 84 135 Z" fill="#0284C7" />
            {/* Number 10 on jersey */}
            <text x="100" y="110" textAnchor="middle" fill="#FFFFFF" fontSize="15" fontWeight="bold" fontFamily="sans-serif">
              10
            </text>

            {/* Arms Jumping Jacks */}
            <motion.path
              d="M 88 80 L 40 40"
              stroke="#FBBF24"
              strokeWidth="10"
              strokeLinecap="round"
              animate={isPlaying ? { d: ['M 88 80 L 50 120', 'M 88 80 L 45 40', 'M 88 80 L 50 120'] } : {}}
              transition={{ repeat: Infinity, duration: 0.9, ease: 'easeInOut' }}
            />
            <motion.path
              d="M 112 80 L 160 40"
              stroke="#FBBF24"
              strokeWidth="10"
              strokeLinecap="round"
              animate={isPlaying ? { d: ['M 112 80 L 150 120', 'M 112 80 L 155 40', 'M 112 80 L 150 120'] } : {}}
              transition={{ repeat: Infinity, duration: 0.9, ease: 'easeInOut' }}
            />

            {/* Legs Jumping Jacks */}
            <motion.path
              d="M 90 135 L 60 215"
              stroke="#0369A1"
              strokeWidth="12"
              strokeLinecap="round"
              animate={isPlaying ? { d: ['M 90 135 L 85 215', 'M 90 135 L 55 210', 'M 90 135 L 85 215'] } : {}}
              transition={{ repeat: Infinity, duration: 0.9, ease: 'easeInOut' }}
            />
            <motion.path
              d="M 110 135 L 140 215"
              stroke="#0369A1"
              strokeWidth="12"
              strokeLinecap="round"
              animate={isPlaying ? { d: ['M 110 135 L 115 215', 'M 110 135 L 145 210', 'M 110 135 L 115 215'] } : {}}
              transition={{ repeat: Infinity, duration: 0.9, ease: 'easeInOut' }}
            />
          </motion.g>
        )}

        {type === 'squat' && (
          <motion.g
            animate={
              isPlaying
                ? {
                    y: [0, 32, 0],
                  }
                : {}
            }
            transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
          >
            {/* Head */}
            <circle cx="100" cy="55" r="16" fill="#FBBF24" />
            <circle cx="95" cy="52" r="2" fill="#1E293B" />
            <circle cx="105" cy="52" r="2" fill="#1E293B" />
            <path d="M 96 61 Q 100 65 104 61" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
            <rect x="84" y="44" width="32" height="6" rx="3" fill="#10B981" />

            {/* Torso */}
            <path d="M 88 75 L 112 75 L 116 135 L 84 135 Z" fill="#10B981" />
            <text x="100" y="110" textAnchor="middle" fill="#FFFFFF" fontSize="13" fontWeight="bold" fontFamily="sans-serif">
              FIT
            </text>

            {/* Arms held straight forward */}
            <line x1="88" y1="85" x2="45" y2="90" stroke="#FBBF24" strokeWidth="10" strokeLinecap="round" />
            <line x1="112" y1="85" x2="155" y2="90" stroke="#FBBF24" strokeWidth="10" strokeLinecap="round" />

            {/* Legs bending during squat */}
            <motion.path
              d="M 90 135 L 75 175 L 70 215"
              stroke="#047857"
              strokeWidth="12"
              strokeLinecap="round"
              strokeLinejoin="round"
              animate={isPlaying ? { d: ['M 90 135 L 85 175 L 80 215', 'M 90 135 L 60 160 L 75 190', 'M 90 135 L 85 175 L 80 215'] } : {}}
              transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
            />
            <motion.path
              d="M 110 135 L 125 175 L 130 215"
              stroke="#047857"
              strokeWidth="12"
              strokeLinecap="round"
              strokeLinejoin="round"
              animate={isPlaying ? { d: ['M 110 135 L 115 175 L 120 215', 'M 110 135 L 140 160 L 125 190', 'M 110 135 L 115 175 L 120 215'] } : {}}
              transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
            />
          </motion.g>
        )}

        {type === 'high_knees' && (
          <g>
            <circle cx="100" cy="55" r="16" fill="#FBBF24" />
            <circle cx="95" cy="52" r="2" fill="#1E293B" />
            <circle cx="105" cy="52" r="2" fill="#1E293B" />
            <rect x="84" y="44" width="32" height="6" rx="3" fill="#F59E0B" />

            <path d="M 88 75 L 112 75 L 114 135 L 86 135 Z" fill="#F59E0B" />

            {/* Arms pumping */}
            <motion.line
              x1="88"
              y1="82"
              x2="60"
              y2="105"
              stroke="#FBBF24"
              strokeWidth="10"
              strokeLinecap="round"
              animate={isPlaying ? { x2: [60, 75, 60], y2: [65, 120, 65] } : {}}
              transition={{ repeat: Infinity, duration: 0.6, ease: 'easeInOut' }}
            />
            <motion.line
              x1="112"
              y1="82"
              x2="140"
              y2="65"
              stroke="#FBBF24"
              strokeWidth="10"
              strokeLinecap="round"
              animate={isPlaying ? { x2: [140, 125, 140], y2: [120, 65, 120] } : {}}
              transition={{ repeat: Infinity, duration: 0.6, ease: 'easeInOut' }}
            />

            {/* Left Leg: Standing straight / jumping */}
            <motion.path
              d="M 90 135 L 90 215"
              stroke="#D97706"
              strokeWidth="12"
              strokeLinecap="round"
              animate={isPlaying ? { d: ['M 90 135 L 90 215', 'M 90 135 L 60 145 L 65 190', 'M 90 135 L 90 215'] } : {}}
              transition={{ repeat: Infinity, duration: 0.6, ease: 'easeInOut' }}
            />

            {/* Right Leg: High Knee up */}
            <motion.path
              d="M 110 135 L 140 145 L 135 190"
              stroke="#D97706"
              strokeWidth="12"
              strokeLinecap="round"
              animate={isPlaying ? { d: ['M 110 135 L 140 145 L 135 190', 'M 110 135 L 110 215', 'M 110 135 L 140 145 L 135 190'] } : {}}
              transition={{ repeat: Infinity, duration: 0.6, ease: 'easeInOut' }}
            />
          </g>
        )}

        {type === 'stretch' && (
          <g>
            {/* Stretching tall */}
            <motion.g
              animate={isPlaying ? { y: [0, -12, 0] } : {}}
              transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
            >
              <circle cx="100" cy="50" r="16" fill="#FBBF24" />
              <rect x="84" y="39" width="32" height="6" rx="3" fill="#8B5CF6" />

              <path d="M 88 70 L 112 70 L 114 135 L 86 135 Z" fill="#8B5CF6" />

              {/* Arms reaching upward */}
              <path d="M 88 75 L 75 30 L 95 15" stroke="#FBBF24" strokeWidth="10" strokeLinecap="round" />
              <path d="M 112 75 L 125 30 L 105 15" stroke="#FBBF24" strokeWidth="10" strokeLinecap="round" />

              {/* Legs tiptoe */}
              <line x1="92" y1="135" x2="88" y2="215" stroke="#6D28D9" strokeWidth="12" strokeLinecap="round" />
              <line x1="108" y1="135" x2="112" y2="215" stroke="#6D28D9" strokeWidth="12" strokeLinecap="round" />
            </motion.g>
          </g>
        )}

        {type === 'neck' && (
          <g>
            {/* Head tilting gently */}
            <motion.g
              animate={isPlaying ? { rotate: [-15, 0, 15, 0, -15], originX: '100px', originY: '70px' } : {}}
              transition={{ repeat: Infinity, duration: 2.8, ease: 'easeInOut' }}
            >
              <circle cx="100" cy="55" r="16" fill="#FBBF24" />
              <circle cx="95" cy="52" r="2" fill="#1E293B" />
              <circle cx="105" cy="52" r="2" fill="#1E293B" />
              <path d="M 96 62 Q 100 66 104 62" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
              <rect x="84" y="44" width="32" height="6" rx="3" fill="#0284C7" />
            </motion.g>

            <path d="M 86 75 L 114 75 L 116 140 L 84 140 Z" fill="#0284C7" />
            {/* Hands on hips */}
            <path d="M 86 82 L 65 105 L 85 115" stroke="#FBBF24" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M 114 82 L 135 105 L 115 115" stroke="#FBBF24" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />

            <line x1="90" y1="140" x2="88" y2="215" stroke="#0369A1" strokeWidth="12" strokeLinecap="round" />
            <line x1="110" y1="140" x2="112" y2="215" stroke="#0369A1" strokeWidth="12" strokeLinecap="round" />
          </g>
        )}

        {type === 'arm_swing' && (
          <g>
            <circle cx="100" cy="55" r="16" fill="#FBBF24" />
            <rect x="84" y="44" width="32" height="6" rx="3" fill="#EC4899" />
            <path d="M 88 75 L 112 75 L 114 135 L 86 135 Z" fill="#EC4899" />

            {/* Arm swinging wide */}
            <motion.line
              x1="88"
              y1="85"
              x2="35"
              y2="85"
              stroke="#FBBF24"
              strokeWidth="10"
              strokeLinecap="round"
              animate={isPlaying ? { x2: [35, 70, 35], y2: [85, 95, 85] } : {}}
              transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
            />
            <motion.line
              x1="112"
              y1="85"
              x2="165"
              y2="85"
              stroke="#FBBF24"
              strokeWidth="10"
              strokeLinecap="round"
              animate={isPlaying ? { x2: [165, 130, 165], y2: [85, 95, 85] } : {}}
              transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
            />

            <line x1="90" y1="135" x2="85" y2="215" stroke="#BE185D" strokeWidth="12" strokeLinecap="round" />
            <line x1="110" y1="135" x2="115" y2="215" stroke="#BE185D" strokeWidth="12" strokeLinecap="round" />
          </g>
        )}

        {type === 'toe_touch' && (
          <motion.g
            animate={isPlaying ? { rotate: [0, 20, 0], originX: '100px', originY: '140px' } : {}}
            transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
          >
            <circle cx="70" cy="90" r="15" fill="#FBBF24" />
            <path d="M 75 105 L 100 135 L 90 145 L 65 115 Z" fill="#10B981" />
            {/* Arms reaching down to toes */}
            <path d="M 80 110 L 60 170 L 65 210" stroke="#FBBF24" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
            {/* Straight legs */}
            <line x1="100" y1="140" x2="95" y2="215" stroke="#047857" strokeWidth="12" strokeLinecap="round" />
            <line x1="110" y1="140" x2="115" y2="215" stroke="#047857" strokeWidth="12" strokeLinecap="round" />
          </motion.g>
        )}

        {(type === 'plank' || type === 'back_arch') && (
          <g>
            {/* Floor mat */}
            <rect x="20" y="195" width="160" height="8" rx="4" fill="#64748B" />
            {/* Horizontal body */}
            <motion.g
              animate={isPlaying ? { y: [0, -6, 0] } : {}}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            >
              <circle cx="150" cy="150" r="14" fill="#FBBF24" />
              <path d="M 140 155 L 75 170 L 70 180 L 135 168 Z" fill="#0284C7" />
              {/* Supporting arms */}
              <line x1="135" y1="165" x2="140" y2="195" stroke="#FBBF24" strokeWidth="9" strokeLinecap="round" />
              {/* Feet toes */}
              <line x1="70" y1="175" x2="50" y2="195" stroke="#0369A1" strokeWidth="11" strokeLinecap="round" />
            </motion.g>
          </g>
        )}
      </svg>
    </div>
  );
}
