import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Crown, 
  RotateCw, 
  Trophy, 
  Heart, 
  Award, 
  Play, 
  Flame, 
  Star, 
  Target, 
  UserCheck, 
  Zap, 
  TrendingUp, 
  Share2, 
  Check, 
  Trees, 
  Flower2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { doc, onSnapshot, setDoc, increment } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { ScrollReveal } from './ScrollReveal';

// Persistent LocalStorage Keys (Genuine guest data)
const STORAGE_TEAM_SCORES_KEY = 'moshe_priya_eden_scores_clean_v1';
const STORAGE_USER_CHAMPION_KEY = 'moshe_priya_user_champion_clean_v1';

// Clean initial state (Zero dummy values)
const INITIAL_SCORES = {
  moshe: 0,
  priya: 0,
  totalPlays: 0
};

// Types for Talambralu Catching Game
interface FallingItem {
  id: number;
  x: number; // percentage 5% to 90%
  y: number; // percentage 0% to 100%
  speed: number;
  type: 'pearl' | 'jasmine' | 'rose' | 'ring' | 'chilli';
  emoji: string;
  points: number;
  name: string;
}

export const WeddingFunGame: React.FC = () => {
  const [activeGame, setActiveGame] = useState<'talambralu' | 'kalasha' | 'varamala'>('talambralu');

  // ==========================================
  // REAL GROOM VS BRIDE TEAM SCORES (NO DUMMY VALUES)
  // ==========================================
  const [userTeam, setUserTeam] = useState<'moshe' | 'priya'>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_USER_CHAMPION_KEY);
      return saved === 'priya' ? 'priya' : 'moshe';
    } catch {
      return 'moshe';
    }
  });

  const [teamScores, setTeamScores] = useState<{ moshe: number; priya: number; totalPlays: number }>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_TEAM_SCORES_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          moshe: Number(parsed.moshe) || 0,
          priya: Number(parsed.priya) || 0,
          totalPlays: Number(parsed.totalPlays) || 0
        };
      }
    } catch {
      // Fallback to clean 0
    }
    return INITIAL_SCORES;
  });

  const [recentPointFlyout, setRecentPointFlyout] = useState<{ team: 'moshe' | 'priya'; pts: number } | null>(null);

  // Sync with Firestore real-time listener (updates globally in real time for all users)
  useEffect(() => {
    const scoresDocRef = doc(db, 'game_scores', 'global_scores');

    // 1. Real-time Firebase Firestore listener
    const unsubscribe = onSnapshot(
      scoresDocRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          const nextScores = {
            moshe: Number(data.moshe) || 0,
            priya: Number(data.priya) || 0,
            totalPlays: Number(data.totalPlays) || 0
          };
          setTeamScores(nextScores);
          try {
            localStorage.setItem(STORAGE_TEAM_SCORES_KEY, JSON.stringify(nextScores));
          } catch {}
        } else {
          // Initialize global document if first time
          setDoc(scoresDocRef, {
            moshe: 0,
            priya: 0,
            totalPlays: 0,
            lastUpdated: new Date().toISOString()
          }, { merge: true }).catch(console.error);
        }
      },
      (err) => {
        console.warn('Firestore snapshot error (using fallback):', err);
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  // Helper to persist scores globally to Firestore & locally
  const addPointsToTeam = async (points: number, targetTeam?: 'moshe' | 'priya') => {
    const team = targetTeam || userTeam;

    // 1. Optimistic Local Update
    setTeamScores(prev => {
      const next = {
        ...prev,
        [team]: prev[team] + points,
        totalPlays: prev.totalPlays + 1
      };
      try {
        localStorage.setItem(STORAGE_TEAM_SCORES_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });

    // 2. Show temporary flyout animation
    setRecentPointFlyout({ team, pts: points });
    setTimeout(() => setRecentPointFlyout(null), 2000);

    // 3. Atomically increment Firestore score document in real time
    try {
      const scoresDocRef = doc(db, 'game_scores', 'global_scores');
      await setDoc(
        scoresDocRef,
        {
          [team]: increment(points),
          totalPlays: increment(1),
          lastUpdated: new Date().toISOString()
        },
        { merge: true }
      );
    } catch (err) {
      console.warn('Firestore write warning:', err);
    }

    // 4. Also notify backend endpoint as dual redundancy
    try {
      fetch('/api/scores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ team, points })
      }).catch(() => {});
    } catch {}
  };

  const handleSelectTeam = (team: 'moshe' | 'priya') => {
    setUserTeam(team);
    try {
      localStorage.setItem(STORAGE_USER_CHAMPION_KEY, team);
    } catch {}
  };

  // Calculate percentages (handle 0/0 cleanly)
  const totalPoints = teamScores.moshe + teamScores.priya;
  const moshePercent = totalPoints > 0 ? Math.round((teamScores.moshe / totalPoints) * 100) : 50;
  const priyaPercent = 100 - moshePercent;

  // ==========================================
  // GAME 1: TALAMBRALU BLESSING CATCHER (SLOWER & GENTLE)
  // ==========================================
  const [gameActive, setGameActive] = useState(false);
  const [gameTimeLeft, setGameTimeLeft] = useState(30);
  const [blessingScore, setBlessingScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [thaliX, setThaliX] = useState(50);
  const [fallingItems, setFallingItems] = useState<FallingItem[]>([]);
  const [highScore, setHighScore] = useState(0);
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>(0);
  const nextItemIdRef = useRef<number>(1);

  // Audio Chime Synthesizer
  const playCatchChime = (type: string) => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      let freq = 659.25; // E5
      if (type === 'ring') freq = 1046.50; // C6
      if (type === 'rose') freq = 880.00; // A5
      if (type === 'chilli') freq = 220.00; // A3

      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.3);
    } catch {}
  };

  const startTalambraluGame = () => {
    setGameActive(true);
    setGameTimeLeft(30);
    setBlessingScore(0);
    setCombo(0);
    setFallingItems([]);
    nextItemIdRef.current = 1;
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!gameAreaRef.current) return;
    const rect = gameAreaRef.current.getBoundingClientRect();
    const relativeX = ((e.clientX - rect.left) / rect.width) * 100;
    const clampedX = Math.max(10, Math.min(90, relativeX));
    setThaliX(clampedX);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!gameActive) return;
      if (e.key === 'ArrowLeft' || e.key === 'a') {
        setThaliX(prev => Math.max(10, prev - 6));
      } else if (e.key === 'ArrowRight' || e.key === 'd') {
        setThaliX(prev => Math.min(90, prev + 6));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameActive]);

  // Main Loop (Slow, gentle, relaxing Eden Garden speed)
  useEffect(() => {
    if (!gameActive) return;

    const timerInterval = setInterval(() => {
      setGameTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerInterval);
          setGameActive(false);
          // Add accumulated points to user's champion!
          if (blessingScore > 0) {
            addPointsToTeam(blessingScore);
          }
          confetti({
            particleCount: 75,
            spread: 80,
            origin: { y: 0.6 },
            colors: ['#0F3D32', '#2D7A62', '#D4AF37', '#FFFDF9', '#E8A5B3']
          });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    let lastSpawn = Date.now();

    const updatePhysics = () => {
      const now = Date.now();

      // Spawn gently every 680ms
      if (now - lastSpawn > 680) {
        lastSpawn = now;
        const rand = Math.random();
        let itemType: FallingItem['type'] = 'pearl';
        let emoji = '✨';
        let points = 10;
        let name = 'Eden Akshintalu';

        if (rand < 0.35) {
          itemType = 'jasmine';
          emoji = '🌸';
          points = 15;
          name = 'Garden Jasmine';
        } else if (rand < 0.60) {
          itemType = 'rose';
          emoji = '🌹';
          points = 20;
          name = 'Eden Rose Petal';
        } else if (rand < 0.78) {
          itemType = 'pearl';
          emoji = '🌟';
          points = 25;
          name = 'Golden Pearl';
        } else if (rand < 0.92) {
          itemType = 'ring';
          emoji = '💍';
          points = 50;
          name = 'Sacred Gold Ring!';
        } else {
          itemType = 'chilli';
          emoji = '🌶️';
          points = -10;
          name = 'Fiery Chilli';
        }

        const newItem: FallingItem = {
          id: nextItemIdRef.current++,
          x: 12 + Math.random() * 76,
          y: 0,
          // Slower speed for gentle, smooth gameplay (0.42 - 0.70)
          speed: 0.42 + Math.random() * 0.28,
          type: itemType,
          emoji,
          points,
          name
        };

        setFallingItems(prev => [...prev.slice(-20), newItem]);
      }

      // Update positions
      setFallingItems(prev => {
        const nextList: FallingItem[] = [];
        for (const item of prev) {
          const newY = item.y + item.speed;

          // Catch collision check
          if (newY >= 78 && newY <= 92 && Math.abs(item.x - thaliX) <= 15) {
            playCatchChime(item.type);
            if (item.type === 'chilli') {
              setBlessingScore(s => Math.max(0, s + item.points));
              setCombo(0);
            } else {
              setBlessingScore(s => {
                const newScore = s + item.points + (combo > 3 ? 5 : 0);
                if (newScore > highScore) setHighScore(newScore);
                return newScore;
              });
              setCombo(c => c + 1);
            }
            continue;
          }

          if (newY <= 100) {
            nextList.push({ ...item, y: newY });
          } else {
            if (item.type !== 'chilli') {
              setCombo(0);
            }
          }
        }
        return nextList;
      });

      if (gameActive) {
        requestRef.current = requestAnimationFrame(updatePhysics);
      }
    };

    requestRef.current = requestAnimationFrame(updatePhysics);

    return () => {
      clearInterval(timerInterval);
      cancelAnimationFrame(requestRef.current);
    };
  }, [gameActive, thaliX, combo, highScore, blessingScore]);

  // ==========================================
  // GAME 2: KALASHA RING DUEL (BEST OF 3)
  // ==========================================
  const [roundNumber, setRoundNumber] = useState<number>(1);
  const [kalashaScores, setKalashaScores] = useState({ moshe: 0, priya: 0 });
  const [kalashaTarget, setKalashaTarget] = useState<number>(() => Math.floor(Math.random() * 3));
  const [selectedKalasha, setSelectedKalasha] = useState<number | null>(null);
  const [roundOutcome, setRoundOutcome] = useState<string | null>(null);
  const [isMatchOver, setIsMatchOver] = useState(false);

  const handlePickKalasha = (index: number) => {
    if (selectedKalasha !== null || isMatchOver) return;
    setSelectedKalasha(index);

    const isWinner = index === kalashaTarget;
    if (isWinner) {
      if (userTeam === 'moshe') {
        setKalashaScores(prev => ({ ...prev, moshe: prev.moshe + 1 }));
        setRoundOutcome("Moshe Dora's swift instinct found the sacred gold ring! (+50 Pts for Team Moshe 👑)");
        addPointsToTeam(50, 'moshe');
      } else {
        setKalashaScores(prev => ({ ...prev, priya: prev.priya + 1 }));
        setRoundOutcome("Nelluri Priya's royal intuition seized the gold ring! (+50 Pts for Team Priya 💐)");
        addPointsToTeam(50, 'priya');
      }
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.65 },
        colors: ['#0F3D32', '#D4AF37', '#FFF2C4', '#2D7A62']
      });
    } else {
      if (userTeam === 'moshe') {
        setKalashaScores(prev => ({ ...prev, priya: prev.priya + 1 }));
        setRoundOutcome("Priya gracefully fished out the ring from the other pot! (+50 Pts for Team Priya 🌹)");
        addPointsToTeam(50, 'priya');
      } else {
        setKalashaScores(prev => ({ ...prev, moshe: prev.moshe + 1 }));
        setRoundOutcome("Moshe Dora skillfully discovered the hidden ring! (+50 Pts for Team Moshe 👔)");
        addPointsToTeam(50, 'moshe');
      }
    }
  };

  const handleNextRound = () => {
    if (roundNumber >= 3) {
      setIsMatchOver(true);
      const winningTeam = kalashaScores.moshe > kalashaScores.priya ? 'moshe' : 'priya';
      addPointsToTeam(100, winningTeam);
      confetti({
        particleCount: 80,
        spread: 90,
        origin: { y: 0.55 }
      });
    } else {
      setRoundNumber(prev => prev + 1);
      setSelectedKalasha(null);
      setRoundOutcome(null);
      setKalashaTarget(Math.floor(Math.random() * 3));
    }
  };

  const handleResetKalashaGame = () => {
    setRoundNumber(1);
    setKalashaScores({ moshe: 0, priya: 0 });
    setSelectedKalasha(null);
    setRoundOutcome(null);
    setIsMatchOver(false);
    setKalashaTarget(Math.floor(Math.random() * 3));
  };

  // ==========================================
  // GAME 3: VARAMALA SACRED GARLAND TOSS (EDEN GARDEN CHALLENGE)
  // ==========================================
  const [varamalaOscillator, setVaramalaOscillator] = useState(50);
  const [varamalaDir, setVaramalaDir] = useState(1);
  const [varamalaTossesLeft, setVaramalaTossesLeft] = useState(5);
  const [varamalaResult, setVaramalaResult] = useState<{ quality: string; pts: number; msg: string } | null>(null);
  const [varamalaTotalScore, setVaramalaTotalScore] = useState(0);
  const [varamalaActive, setVaramalaActive] = useState(false);
  const [isVaramalaComplete, setIsVaramalaComplete] = useState(false);

  useEffect(() => {
    if (!varamalaActive || isVaramalaComplete) return;

    const interval = setInterval(() => {
      setVaramalaOscillator(prev => {
        let next = prev + varamalaDir * 2.0;
        if (next >= 92) {
          setVaramalaDir(-1);
          next = 92;
        } else if (next <= 8) {
          setVaramalaDir(1);
          next = 8;
        }
        return next;
      });
    }, 25);

    return () => clearInterval(interval);
  }, [varamalaActive, varamalaDir, isVaramalaComplete]);

  const handleStartVaramala = () => {
    setVaramalaActive(true);
    setVaramalaTossesLeft(5);
    setVaramalaResult(null);
    setVaramalaTotalScore(0);
    setIsVaramalaComplete(false);
  };

  const handleTossGarland = () => {
    if (!varamalaActive || isVaramalaComplete) return;

    const distFromCenter = Math.abs(varamalaOscillator - 50);
    let pts = 20;
    let quality = "🌸 Sweet Garden Grace";
    let msg = "The jasmine garland lands gently with sweet prayer!";

    if (distFromCenter <= 5) {
      pts = 100;
      quality = "👑 PERFECT EDEN ARCH TOSS!";
      msg = "Bullseye! The golden garland crowns the Eden altar in majestic divine harmony!";
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#0F3D32', '#D4AF37', '#FFF2C4', '#2D7A62']
      });
    } else if (distFromCenter <= 14) {
      pts = 60;
      quality = "🌟 Royal Garden Toss!";
      msg = "Great aim! The fragrant roses grace the Eden altar beautifully.";
    } else if (distFromCenter <= 25) {
      pts = 35;
      quality = "💐 Festive Toss!";
      msg = "Nice garland toss! The wedding garden erupts in joyful cheers.";
    }

    addPointsToTeam(pts);
    setVaramalaTotalScore(prev => prev + pts);
    setVaramalaResult({ quality, pts, msg });

    setVaramalaTossesLeft(prev => {
      const next = prev - 1;
      if (next <= 0) {
        setIsVaramalaComplete(true);
        confetti({
          particleCount: 90,
          spread: 85,
          origin: { y: 0.55 }
        });
      }
      return next;
    });
  };

  return (
    <section className="relative py-20 px-4 sm:px-6 bg-[#F4F8F5] border-b border-[#0F3D32]/20" id="game">
      <div className="max-w-4xl mx-auto">
        
        {/* Section Header */}
        <ScrollReveal direction="up" threshold={0.15}>
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 font-cinzel text-xs uppercase tracking-[0.3em] text-[#0F3D32] font-semibold mb-2">
              <Trees className="w-3.5 h-3.5 text-[#2D7A62]" />
              Eden Garden Celebrations &bull; Groom vs Bride
              <Trees className="w-3.5 h-3.5 text-[#2D7A62]" />
            </div>
            <h2 className="font-decorative text-3xl sm:text-4xl md:text-5xl text-[#0F3D32] font-bold">
              Eden Garden Wedding Games
            </h2>
            <p className="font-cormorant text-lg sm:text-xl text-[#2A2A2A]/80 italic max-w-xl mx-auto mt-2">
              Pick your champion! Every point you score in the games increases the genuine celebration score of <strong className="text-[#0F3D32] not-italic">Team Moshe Dora</strong> or <strong className="text-[#5E1626] not-italic">Team Nelluri Priya</strong>!
            </p>
          </div>
        </ScrollReveal>

        {/* ========================================================
            GRAND WEDDING BATTLE SCOREBOARD (100% REAL GUEST SCORES)
           ======================================================== */}
        <ScrollReveal direction="up" delay={60} threshold={0.15}>
          <div className="mb-10 p-5 sm:p-7 rounded-3xl bg-gradient-to-br from-[#FFFDF9] via-[#F2F7F4] to-[#FFFDF9] border-2 border-[#D4AF37] shadow-lg relative overflow-hidden">
            
            {/* Top Battle Header */}
            <div className="flex flex-wrap items-center justify-between border-b border-[#0F3D32]/20 pb-3 mb-4 gap-2">
              <div className="flex items-center gap-2">
                <Crown className="w-4 h-4 text-[#D4AF37]" />
                <span className="font-cinzel text-xs sm:text-sm font-bold uppercase tracking-wider text-[#0F3D32]">
                  Eden Garden Championship Battle
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-cinzel text-[11px] text-gray-500 font-semibold">
                  Total Real Plays: <strong className="text-[#0F3D32]">{teamScores.totalPlays}</strong>
                </span>
              </div>
            </div>

            {/* Team Selectors & Scores */}
            <div className="grid grid-cols-2 gap-3 sm:gap-6 mb-5">
              {/* Team Moshe Button */}
              <button
                type="button"
                onClick={() => handleSelectTeam('moshe')}
                className={`p-3.5 sm:p-5 rounded-2xl border-2 transition-all cursor-pointer text-left relative group ${
                  userTeam === 'moshe'
                    ? 'border-[#0F3D32] bg-[#0F3D32]/10 ring-2 ring-[#0F3D32]/30 shadow-md scale-[1.02]'
                    : 'border-[#D4AF37]/40 bg-white hover:border-[#0F3D32] hover:bg-[#F2F7F4]'
                }`}
              >
                {userTeam === 'moshe' && (
                  <span className="absolute top-2 right-2 flex items-center gap-1 text-[9px] sm:text-[10px] font-cinzel font-bold text-[#0F3D32] bg-[#0F3D32]/15 px-2 py-0.5 rounded-full uppercase">
                    <Check className="w-3 h-3" /> Supporting
                  </span>
                )}
                <div className="flex items-center gap-2">
                  <span className="text-2xl sm:text-3xl">👔</span>
                  <div>
                    <div className="font-cinzel text-xs sm:text-sm font-bold text-[#0F3D32] uppercase">
                      Team Moshe Dora
                    </div>
                    <div className="font-cormorant text-xs text-gray-600 italic">
                      The Royal Groom
                    </div>
                  </div>
                </div>
                <div className="font-cinzel text-2xl sm:text-3xl font-extrabold text-[#0F3D32] mt-2">
                  {teamScores.moshe.toLocaleString()} <span className="text-xs font-normal text-gray-500">pts</span>
                </div>
              </button>

              {/* Team Priya Button */}
              <button
                type="button"
                onClick={() => handleSelectTeam('priya')}
                className={`p-3.5 sm:p-5 rounded-2xl border-2 transition-all cursor-pointer text-left relative group ${
                  userTeam === 'priya'
                    ? 'border-[#5E1626] bg-[#5E1626]/10 ring-2 ring-[#5E1626]/30 shadow-md scale-[1.02]'
                    : 'border-[#D4AF37]/40 bg-white hover:border-[#5E1626] hover:bg-[#F2F7F4]'
                }`}
              >
                {userTeam === 'priya' && (
                  <span className="absolute top-2 right-2 flex items-center gap-1 text-[9px] sm:text-[10px] font-cinzel font-bold text-[#5E1626] bg-[#5E1626]/15 px-2 py-0.5 rounded-full uppercase">
                    <Check className="w-3 h-3" /> Supporting
                  </span>
                )}
                <div className="flex items-center gap-2">
                  <span className="text-2xl sm:text-3xl">💐</span>
                  <div>
                    <div className="font-cinzel text-xs sm:text-sm font-bold text-[#5E1626] uppercase">
                      Team Nelluri Priya
                    </div>
                    <div className="font-cormorant text-xs text-gray-600 italic">
                      The Radiant Bride
                    </div>
                  </div>
                </div>
                <div className="font-cinzel text-2xl sm:text-3xl font-extrabold text-[#5E1626] mt-2">
                  {teamScores.priya.toLocaleString()} <span className="text-xs font-normal text-gray-500">pts</span>
                </div>
              </button>
            </div>

            {/* Tug-of-War Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-cinzel font-bold">
                <span className="text-[#0F3D32]">Moshe: {moshePercent}%</span>
                <span className="text-gray-400 font-cormorant italic">Select a team to contribute your game points</span>
                <span className="text-[#5E1626]">Priya: {priyaPercent}%</span>
              </div>
              <div className="h-4 w-full bg-gray-200 rounded-full overflow-hidden flex border border-[#0F3D32]/30 shadow-inner">
                <div 
                  className="bg-gradient-to-r from-[#0F3D32] to-[#2D7A62] h-full transition-all duration-700 ease-out"
                  style={{ width: `${moshePercent}%` }}
                />
                <div 
                  className="bg-gradient-to-r from-[#8C1D36] to-[#5E1626] h-full transition-all duration-700 ease-out"
                  style={{ width: `${priyaPercent}%` }}
                />
              </div>
            </div>

            {/* Point Flyout Notification */}
            {recentPointFlyout && (
              <div className="mt-3 text-center animate-bounce">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0F3D32] text-[#F1DFA6] font-cinzel text-xs font-bold shadow-md border border-[#D4AF37]">
                  <Zap className="w-3.5 h-3.5 fill-current text-[#D4AF37]" />
                  <span>+{recentPointFlyout.pts} Points Added to Team {recentPointFlyout.team === 'moshe' ? 'Moshe Dora 👔' : 'Nelluri Priya 💐'}!</span>
                </span>
              </div>
            )}
          </div>
        </ScrollReveal>

        {/* Game Navigation Switcher */}
        <ScrollReveal direction="up" delay={80} threshold={0.15}>
          <div className="flex justify-center mb-8">
            <div className="inline-flex p-1.5 rounded-2xl bg-white border border-[#0F3D32]/30 shadow-sm max-w-full overflow-x-auto gap-1">
              <button
                type="button"
                onClick={() => setActiveGame('talambralu')}
                className={`px-4 sm:px-6 py-2.5 rounded-xl font-cinzel text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
                  activeGame === 'talambralu'
                    ? 'bg-[#0F3D32] text-[#F1DFA6] shadow-md'
                    : 'text-[#2A2A2A]/70 hover:text-[#0F3D32] hover:bg-[#F2F7F4]'
                }`}
              >
                <span>🌸 Talambralu Catch</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveGame('varamala')}
                className={`px-4 sm:px-6 py-2.5 rounded-xl font-cinzel text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
                  activeGame === 'varamala'
                    ? 'bg-[#0F3D32] text-[#F1DFA6] shadow-md'
                    : 'text-[#2A2A2A]/70 hover:text-[#0F3D32] hover:bg-[#F2F7F4]'
                }`}
              >
                <span>💐 Varamala Garland Toss</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveGame('kalasha')}
                className={`px-4 sm:px-6 py-2.5 rounded-xl font-cinzel text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
                  activeGame === 'kalasha'
                    ? 'bg-[#0F3D32] text-[#F1DFA6] shadow-md'
                    : 'text-[#2A2A2A]/70 hover:text-[#0F3D32] hover:bg-[#F2F7F4]'
                }`}
              >
                <span>🏺 Kalasha Ring Duel</span>
              </button>
            </div>
          </div>
        </ScrollReveal>

        {/* ========================================================
            GAME 1: TALAMBRALU BLESSING CATCHER (SLOWER & GENTLE)
           ======================================================== */}
        {activeGame === 'talambralu' && (
          <ScrollReveal direction="scale" threshold={0.1}>
            <div className="bg-[#FFFDF9] rounded-3xl border-2 border-[#0F3D32]/40 p-4 sm:p-8 shadow-lg relative overflow-hidden">
              
              {/* Score & HUD Header */}
              <div className="flex flex-wrap items-center justify-between border-b border-[#0F3D32]/20 pb-4 mb-4 gap-2">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0F3D32]/10 text-[#0F3D32] font-cinzel text-xs font-bold uppercase">
                    <Trophy className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Session Points: {blessingScore}</span>
                  </div>

                  {combo > 2 && (
                    <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#0F3D32] text-[#F1DFA6] font-cinzel text-xs font-bold animate-bounce border border-[#D4AF37]">
                      <Flame className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>{combo}x Combo!</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <div className="font-cinzel text-xs font-bold text-gray-500">
                    Supporting: <span className={userTeam === 'moshe' ? 'text-[#0F3D32]' : 'text-[#5E1626]'}>Team {userTeam === 'moshe' ? 'Moshe' : 'Priya'}</span>
                  </div>

                  <div className={`px-3 py-1 rounded-full font-cinzel text-xs font-bold ${
                    gameTimeLeft <= 5 ? 'bg-rose-100 text-rose-700 animate-pulse' : 'bg-[#0F3D32]/10 text-[#0F3D32]'
                  }`}>
                    ⏱️ {gameTimeLeft}s
                  </div>
                </div>
              </div>

              {/* Game Interactive Board */}
              <div
                ref={gameAreaRef}
                onPointerMove={handlePointerMove}
                className="relative w-full h-80 sm:h-96 rounded-2xl bg-radial from-[#F9FBF8] via-[#EFF6F1] to-[#E3EDE6] border-2 border-[#0F3D32]/40 overflow-hidden select-none touch-none shadow-inner cursor-crosshair"
              >
                {/* Background Decor */}
                <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#0F3D32_1px,transparent_1px)] [background-size:20px_20px]" />
                <div className="absolute top-2 left-0 right-0 text-center pointer-events-none">
                  <span className="font-cormorant italic text-xs text-[#0F3D32]/60 uppercase tracking-widest">
                    Relaxed Eden Blessing Shower &bull; Catch Pearls, Jasmine &amp; Rings &bull; Avoid Chillies
                  </span>
                </div>

                {/* Falling Objects */}
                {gameActive && fallingItems.map(item => (
                  <div
                    key={item.id}
                    className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-100 text-2xl sm:text-3xl filter drop-shadow-md"
                    style={{
                      left: `${item.x}%`,
                      top: `${item.y}%`
                    }}
                  >
                    {item.emoji}
                  </div>
                ))}

                {/* The Golden Thali (Player Paddle) */}
                <div
                  className="absolute bottom-4 -translate-x-1/2 transition-all duration-75 pointer-events-none z-20 flex flex-col items-center"
                  style={{ left: `${thaliX}%` }}
                >
                  <div className="w-24 sm:w-28 h-7 sm:h-8 rounded-full bg-gradient-to-b from-[#FFF2C4] via-[#D4AF37] to-[#8C6212] border-2 border-[#FFFDF9] shadow-[0_6px_16px_rgba(0,0,0,0.35)] flex items-center justify-center relative">
                    <div className="absolute inset-1 rounded-full border border-dashed border-[#0F3D32]/40" />
                    <span className="font-cinzel text-[9px] font-bold text-[#061C16] uppercase tracking-wider">
                      ✨ Thali
                    </span>
                  </div>
                  <div className="w-12 h-2 bg-black/20 rounded-full blur-[2px] mt-0.5" />
                </div>

                {/* Overlay when game is idle / game over */}
                {!gameActive && (
                  <div className="absolute inset-0 bg-[#061C16]/60 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center z-30">
                    {blessingScore > 0 ? (
                      <div className="space-y-3 animate-fadeIn">
                        <div className="text-4xl">🎊</div>
                        <h3 className="font-decorative text-2xl sm:text-3xl font-bold text-[#FFF2C4]">
                          Eden Blessing Shower Complete!
                        </h3>
                        <p className="font-cinzel text-base text-[#F1DFA6] font-bold">
                          +{blessingScore} Points Contributed To Team {userTeam === 'moshe' ? 'Moshe Dora 👔' : 'Nelluri Priya 💐'}!
                        </p>
                        <p className="font-cormorant text-sm text-[#FFFDF9]/90 italic max-w-sm">
                          Your points are recorded and will display on the celebration leaderboard!
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="text-4xl animate-bounce">🌸</div>
                        <h3 className="font-decorative text-2xl sm:text-3xl font-bold text-[#FFF2C4]">
                          Talambralu Blessing Catcher
                        </h3>
                        <p className="font-cormorant text-sm sm:text-base text-[#F1DFA6] italic max-w-md">
                          Glide the sacred thali gently to catch falling golden akshintalu pearls (🌟), jasmine (🌸), roses (🌹) &amp; gold rings (💍).
                        </p>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={startTalambraluGame}
                      className="mt-5 px-8 py-3 rounded-full bg-gradient-to-r from-[#0F3D32] via-[#2D7A62] to-[#0F3D32] hover:scale-105 text-[#FFF2C4] font-cinzel text-xs sm:text-sm font-bold uppercase tracking-[0.2em] border-2 border-[#D4AF37] shadow-xl flex items-center gap-2 cursor-pointer transition-all"
                    >
                      <Play className="w-4 h-4 fill-current text-[#D4AF37]" />
                      <span>{blessingScore > 0 ? "Play Again (30s)" : "Start Blessing Shower"}</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Mobile touch helper buttons */}
              {gameActive && (
                <div className="flex sm:hidden items-center justify-between mt-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setThaliX(prev => Math.max(10, prev - 15))}
                    className="flex-1 py-2 rounded-xl bg-[#0F3D32]/15 text-[#0F3D32] font-cinzel text-xs font-bold uppercase"
                  >
                    ⬅️ Move Left
                  </button>
                  <button
                    type="button"
                    onClick={() => setThaliX(prev => Math.min(90, prev + 15))}
                    className="flex-1 py-2 rounded-xl bg-[#0F3D32]/15 text-[#0F3D32] font-cinzel text-xs font-bold uppercase"
                  >
                    Move Right ➡️
                  </button>
                </div>
              )}
            </div>
          </ScrollReveal>
        )}

        {/* ========================================================
            GAME 2: VARAMALA SACRED GARLAND TOSS
           ======================================================== */}
        {activeGame === 'varamala' && (
          <ScrollReveal direction="scale" threshold={0.1}>
            <div className="bg-[#FFFDF9] rounded-3xl border-2 border-[#0F3D32]/40 p-6 sm:p-10 shadow-lg text-center">
              
              <div className="max-w-md mx-auto mb-6">
                <div className="inline-flex items-center gap-1.5 bg-[#0F3D32]/10 text-[#0F3D32] font-cinzel text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-2">
                  <Target className="w-3.5 h-3.5 text-[#D4AF37]" />
                  Varamala Exchange Timing Challenge
                </div>
                <h3 className="font-decorative text-2xl sm:text-3xl text-[#0F3D32] font-bold">
                  Sacred Garland Toss Challenge
                </h3>
                <p className="font-cormorant text-base text-[#2A2A2A]/80 italic mt-1">
                  Time your toss to land the fragrant jasmine &amp; rose garland onto the ceremonial Eden arch! Hit the golden center for maximum points for Team {userTeam === 'moshe' ? 'Moshe' : 'Priya'}!
                </p>
              </div>

              {/* Garland Toss Stage */}
              <div className="p-6 rounded-3xl bg-gradient-to-b from-[#F9FBF8] to-[#EFF6F1] border-2 border-[#0F3D32]/40 max-w-xl mx-auto mb-6 shadow-inner relative overflow-hidden">
                
                {/* Arch Target in Center */}
                <div className="relative h-44 flex flex-col items-center justify-between py-2">
                  {/* Wedding Arch Visual */}
                  <div className="relative">
                    <div className="w-32 sm:w-40 h-20 rounded-t-full border-4 border-[#D4AF37] bg-[#0F3D32]/5 flex items-center justify-center relative shadow-sm">
                      <div className="text-3xl">🌿</div>
                      <span className="absolute -top-3 left-1 text-base">🌸</span>
                      <span className="absolute -top-4 text-base">🌹</span>
                      <span className="absolute -top-3 right-1 text-base">🌸</span>
                    </div>
                    <div className="text-[10px] font-cinzel font-bold text-[#0F3D32] uppercase mt-1">
                      Eden Garden Altar
                    </div>
                  </div>

                  {/* Oscillating Garland / Timing Bar */}
                  <div className="w-full relative px-4">
                    {/* Track */}
                    <div className="h-6 w-full bg-gray-200 rounded-full relative overflow-hidden border border-[#0F3D32]/40">
                      {/* Left zone */}
                      <div className="absolute left-0 top-0 bottom-0 w-[35%] bg-amber-100/60" />
                      {/* Sweet Spot Golden Center */}
                      <div className="absolute left-[35%] right-[35%] top-0 bottom-0 bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-500 flex items-center justify-center">
                        <span className="text-[9px] font-cinzel font-extrabold text-emerald-950 uppercase tracking-widest">
                          ✨ Bullseye (100 Pts)
                        </span>
                      </div>
                      {/* Right zone */}
                      <div className="absolute right-0 top-0 bottom-0 w-[35%] bg-amber-100/60" />
                    </div>

                    {/* Oscillating Garland Marker */}
                    <div
                      className="absolute -top-3 transition-all duration-75 pointer-events-none -translate-x-1/2"
                      style={{ left: `${varamalaOscillator}%` }}
                    >
                      <div className="text-3xl animate-bounce filter drop-shadow-md">
                        💐
                      </div>
                    </div>
                  </div>
                </div>

                {/* Toss Result Banner */}
                {varamalaResult && (
                  <div className="mt-4 p-3 rounded-2xl bg-white border border-[#0F3D32]/30 animate-fadeIn">
                    <div className="font-cinzel text-sm font-bold text-[#0F3D32]">
                      {varamalaResult.quality} (+{varamalaResult.pts} Pts)
                    </div>
                    <p className="font-cormorant text-xs sm:text-sm text-gray-700 italic mt-0.5">
                      {varamalaResult.msg}
                    </p>
                  </div>
                )}
              </div>

              {/* Toss Control & Stats */}
              <div className="flex flex-col items-center justify-center gap-3">
                {!varamalaActive || isVaramalaComplete ? (
                  <button
                    type="button"
                    onClick={handleStartVaramala}
                    className="px-8 py-3 rounded-full bg-gradient-to-r from-[#0F3D32] via-[#2D7A62] to-[#0F3D32] hover:scale-105 text-[#FFF2C4] font-cinzel text-xs sm:text-sm font-bold uppercase tracking-[0.2em] border-2 border-[#D4AF37] shadow-xl flex items-center gap-2 cursor-pointer transition-all"
                  >
                    <Play className="w-4 h-4 fill-current text-[#D4AF37]" />
                    <span>{isVaramalaComplete ? "Toss Again (5 Rounds)" : "Start Garland Toss Challenge"}</span>
                  </button>
                ) : (
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <button
                      type="button"
                      onClick={handleTossGarland}
                      className="px-10 py-4 rounded-full bg-gradient-to-r from-[#0F3D32] via-[#2D7A62] to-[#0F3D32] hover:scale-105 active:scale-95 text-[#FFF2C4] font-cinzel text-sm sm:text-base font-extrabold uppercase tracking-[0.22em] border-2 border-[#D4AF37] shadow-2xl flex items-center gap-2 cursor-pointer transition-all animate-pulse"
                    >
                      <span>💐 TOSS GARLAND NOW!</span>
                    </button>
                    <div className="font-cinzel text-xs font-bold text-gray-600">
                      Tosses Remaining: <span className="text-[#0F3D32] text-base font-bold">{varamalaTossesLeft}</span> / 5
                    </div>
                  </div>
                )}

                {varamalaTotalScore > 0 && (
                  <div className="text-xs font-cinzel text-[#0F3D32] font-semibold">
                    Session Score: <strong>+{varamalaTotalScore} pts</strong> contributed to Team {userTeam === 'moshe' ? 'Moshe' : 'Priya'}!
                  </div>
                )}
              </div>

            </div>
          </ScrollReveal>
        )}

        {/* ========================================================
            GAME 3: SACRED KALASHA RING DUEL (BEST OF 3)
           ======================================================== */}
        {activeGame === 'kalasha' && (
          <ScrollReveal direction="scale" threshold={0.1}>
            <div className="bg-[#FFFDF9] rounded-3xl border-2 border-[#0F3D32]/40 p-6 sm:p-10 shadow-lg text-center">
              
              <div className="max-w-md mx-auto mb-6">
                <div className="inline-flex items-center gap-1.5 bg-[#0F3D32]/10 text-[#0F3D32] font-cinzel text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-2">
                  <Award className="w-3.5 h-3.5 text-[#D4AF37]" />
                  Sacred Talambralu Tradition &bull; Best of 3
                </div>
                <h3 className="font-decorative text-2xl sm:text-3xl text-[#0F3D32] font-bold">
                  The Golden Kalasha Ring Quest
                </h3>
                <p className="font-cormorant text-base text-[#2A2A2A]/80 italic mt-1">
                  At the wedding altar, a consecrated gold ring is slipped into a brass pot filled with milk &amp; fresh rose petals. Find the ring to win points for your team!
                </p>
              </div>

              {/* Kalasha Duel Scoreboard */}
              <div className="grid grid-cols-2 gap-4 max-w-md mx-auto mb-6">
                <div className={`p-3 rounded-2xl border-2 text-center ${userTeam === 'moshe' ? 'border-[#0F3D32] bg-[#0F3D32]/10' : 'border-gray-200'}`}>
                  <div className="text-xl">👔</div>
                  <div className="font-cinzel text-xs font-bold text-[#0F3D32]">Moshe Dora</div>
                  <div className="font-cinzel text-xl font-bold text-[#0F3D32]">{kalashaScores.moshe} Wins</div>
                </div>

                <div className={`p-3 rounded-2xl border-2 text-center ${userTeam === 'priya' ? 'border-[#5E1626] bg-[#5E1626]/10' : 'border-gray-200'}`}>
                  <div className="text-xl">💐</div>
                  <div className="font-cinzel text-xs font-bold text-[#5E1626]">Nelluri Priya</div>
                  <div className="font-cinzel text-xl font-bold text-[#5E1626]">{kalashaScores.priya} Wins</div>
                </div>
              </div>

              {/* Round Indicator */}
              {!isMatchOver && (
                <div className="font-cinzel text-xs font-bold text-[#0F3D32] uppercase tracking-wider mb-4">
                  Round {roundNumber} of 3 &bull; Select a Milk &amp; Rose Kalasha
                </div>
              )}

              {/* 3 Traditional Pots */}
              {!isMatchOver && (
                <div className="grid grid-cols-3 gap-3 sm:gap-6 max-w-lg mx-auto mb-8">
                  {[0, 1, 2].map((idx) => {
                    const isChosen = selectedKalasha === idx;
                    const hasRing = kalashaTarget === idx;
                    const isRevealed = selectedKalasha !== null;

                    return (
                      <button
                        key={idx}
                        type="button"
                        disabled={isRevealed}
                        onClick={() => handlePickKalasha(idx)}
                        className={`relative p-4 sm:p-6 rounded-2xl border-2 transition-all flex flex-col items-center justify-center cursor-pointer group ${
                          isChosen && hasRing
                            ? 'border-emerald-600 bg-emerald-50 scale-105 shadow-md ring-2 ring-emerald-400'
                            : isChosen && !hasRing
                            ? 'border-rose-400 bg-rose-50 scale-95'
                            : 'border-[#0F3D32]/30 bg-white hover:border-[#0F3D32] hover:bg-[#F2F7F4] hover:scale-105'
                        }`}
                      >
                        <div className="text-4xl sm:text-5xl my-2 transition-transform group-hover:rotate-6">
                          {isRevealed ? (
                            hasRing ? (
                              <span className="animate-bounce inline-block filter drop-shadow">
                                💍
                              </span>
                            ) : (
                              <span className="text-3xl opacity-50">
                                🥛
                              </span>
                            )
                          ) : (
                            <span className="filter drop-shadow-xs">
                              🏺
                            </span>
                          )}
                        </div>

                        <div className="font-cinzel text-xs font-bold text-[#0F3D32] uppercase tracking-wider mt-2">
                          Kalasha #{idx + 1}
                        </div>
                        <div className="text-[11px] font-cormorant text-gray-500 italic">
                          {isRevealed && hasRing ? "Gold Ring Found!" : "Milk & Rose Petals"}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Round Commentary */}
              {roundOutcome && !isMatchOver && (
                <div className="p-4 rounded-2xl bg-[#F2F7F4] border border-[#0F3D32]/30 max-w-md mx-auto mb-6 animate-fadeIn">
                  <p className="font-cormorant text-base text-[#2A2A2A] italic font-semibold">
                    {roundOutcome}
                  </p>
                  <button
                    type="button"
                    onClick={handleNextRound}
                    className="mt-3 px-6 py-2 rounded-full bg-[#0F3D32] hover:bg-[#2D7A62] text-[#F1DFA6] font-cinzel text-xs font-bold uppercase tracking-wider transition-all shadow cursor-pointer"
                  >
                    {roundNumber >= 3 ? "View Tournament Outcome 👑" : "Proceed to Next Round ➡️"}
                  </button>
                </div>
              )}

              {/* Match Over Outcome */}
              {isMatchOver && (
                <div className="p-6 rounded-3xl bg-gradient-to-b from-[#F9FBF8] to-[#EFF6F1] border-2 border-[#0F3D32]/40 max-w-lg mx-auto mb-6 animate-fadeIn shadow-md">
                  <div className="text-4xl mb-2">
                    {kalashaScores.moshe > kalashaScores.priya ? "👑" : kalashaScores.priya > kalashaScores.moshe ? "💐" : "🕊️"}
                  </div>
                  <h4 className="font-decorative text-2xl text-[#0F3D32] font-bold">
                    {kalashaScores.moshe > kalashaScores.priya
                      ? "Moshe Dora Wins The Golden Ring Quest! (+100 Pts)"
                      : kalashaScores.priya > kalashaScores.moshe
                      ? "Nelluri Priya Conquers The Royal Kalasha! (+100 Pts)"
                      : "A Divine Holy Tie &bull; Perfect Biblical Equality!"}
                  </h4>
                  <p className="font-cormorant text-base text-[#2A2A2A] italic mt-2 leading-relaxed">
                    {kalashaScores.moshe > kalashaScores.priya
                      ? "Tradition says Moshe Dora gets supreme authority over Sunday road-trip music playlists!"
                      : kalashaScores.priya > kalashaScores.moshe
                      ? "Tradition decrees that Priya gets executive power over all holiday destinations & wedding shopping!"
                      : "Two hearts beating as one in God's Eden garden — blessed with laughter and mutual respect!"}
                  </p>

                  <button
                    type="button"
                    onClick={handleResetKalashaGame}
                    className="mt-5 px-6 py-2.5 rounded-full bg-[#0F3D32] hover:bg-[#2D7A62] text-[#F1DFA6] font-cinzel text-xs font-bold uppercase tracking-wider transition-all shadow cursor-pointer inline-flex items-center gap-2"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                    <span>Play Another Duel</span>
                  </button>
                </div>
              )}
            </div>
          </ScrollReveal>
        )}

      </div>
    </section>
  );
};
