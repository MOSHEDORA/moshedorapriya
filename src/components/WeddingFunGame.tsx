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
import { useLanguage } from '../context/LanguageContext';

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
  const { language } = useLanguage();

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
          const synced = {
            moshe: Number(data.moshe) || 0,
            priya: Number(data.priya) || 0,
            totalPlays: Number(data.totalPlays) || 0
          };
          setTeamScores(synced);
          try {
            localStorage.setItem(STORAGE_TEAM_SCORES_KEY, JSON.stringify(synced));
          } catch {}
        }
      },
      (err) => {
        console.warn('Firestore game score listener fallback to local:', err);
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  // Write points to Firestore and local state
  const addPointsToTeam = async (points: number, targetTeam?: 'moshe' | 'priya') => {
    const designatedTeam = targetTeam || userTeam;
    if (points <= 0) return;

    // Trigger visual celebration flyout
    setRecentPointFlyout({ team: designatedTeam, pts: points });
    setTimeout(() => setRecentPointFlyout(null), 3000);

    // Optimistic local update
    setTeamScores(prev => {
      const updated = {
        ...prev,
        [designatedTeam]: prev[designatedTeam] + points,
        totalPlays: prev.totalPlays + 1
      };
      try {
        localStorage.setItem(STORAGE_TEAM_SCORES_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });

    // Write to Firestore database
    try {
      const scoresDocRef = doc(db, 'game_scores', 'global_scores');
      await setDoc(
        scoresDocRef,
        {
          [designatedTeam]: increment(points),
          totalPlays: increment(1),
          lastUpdated: new Date().toISOString()
        },
        { merge: true }
      );
    } catch (err) {
      console.warn('Firestore score write fallback:', err);
    }
  };

  const handleSelectTeam = (team: 'moshe' | 'priya') => {
    setUserTeam(team);
    try {
      localStorage.setItem(STORAGE_USER_CHAMPION_KEY, team);
    } catch {}
    confetti({
      particleCount: 30,
      spread: 50,
      origin: { y: 0.8 },
      colors: team === 'moshe' ? ['#0F3D32', '#2D7A62', '#D4AF37'] : ['#5E1626', '#8C1D36', '#D4AF37']
    });
  };

  // Percentage calculations for dynamic tug-of-war bar
  const totalPoints = teamScores.moshe + teamScores.priya;
  const moshePercent = totalPoints === 0 ? 50 : Math.round((teamScores.moshe / totalPoints) * 100);
  const priyaPercent = 100 - moshePercent;

  // ==========================================
  // GAME 1: TALAMBRALU BLESSING CATCHER (SLOWER & GENTLE)
  // ==========================================
  const [gameActive, setGameActive] = useState(false);
  const [gameTimeLeft, setGameTimeLeft] = useState(30);
  const [blessingScore, setBlessingScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [thaliX, setThaliX] = useState(50); // percentage 10% to 90%
  const [fallingItems, setFallingItems] = useState<FallingItem[]>([]);
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const nextItemIdRef = useRef(1);

  const startTalambraluGame = () => {
    setBlessingScore(0);
    setCombo(0);
    setGameTimeLeft(30);
    setFallingItems([]);
    setThaliX(50);
    setGameActive(true);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!gameActive || !gameAreaRef.current) return;
    const rect = gameAreaRef.current.getBoundingClientRect();
    const clientX = e.clientX;
    const relativeX = ((clientX - rect.left) / rect.width) * 100;
    const clampedX = Math.max(8, Math.min(92, relativeX));
    setThaliX(clampedX);
  };

  // Keyboard navigation for desktop accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!gameActive) return;
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        setThaliX(prev => Math.max(8, prev - 6));
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        setThaliX(prev => Math.min(92, prev + 6));
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
            continue; // caught!
          }

          if (newY < 105) {
            nextList.push({ ...item, y: newY });
          }
        }
        return nextList;
      });
    };

    const animInterval = setInterval(updatePhysics, 24);

    return () => {
      clearInterval(timerInterval);
      clearInterval(animInterval);
    };
  }, [gameActive, thaliX, blessingScore, combo, highScore]);

  const playCatchChime = (type: FallingItem['type']) => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'ring') {
        osc.frequency.setValueAtTime(880, ctx.currentTime); // High sparkle A5
        osc.frequency.exponentialRampToValueAtTime(1760, ctx.currentTime + 0.15); // A6
      } else if (type === 'chilli') {
        osc.frequency.setValueAtTime(220, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + 0.12);
      } else {
        osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        osc.frequency.exponentialRampToValueAtTime(659.25, ctx.currentTime + 0.1); // E5
      }

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    } catch {}
  };

  // ==========================================
  // GAME 2: VARAMALA SACRED GARLAND TOSS (EDEN GARDEN CHALLENGE)
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
        let next = prev + varamalaDir * 2.2;
        if (next >= 90) {
          next = 90;
          setVaramalaDir(-1);
        } else if (next <= 10) {
          next = 10;
          setVaramalaDir(1);
        }
        return next;
      });
    }, 20);

    return () => clearInterval(interval);
  }, [varamalaActive, varamalaDir, isVaramalaComplete]);

  const handleStartVaramala = () => {
    setVaramalaTossesLeft(5);
    setVaramalaTotalScore(0);
    setVaramalaResult(null);
    setIsVaramalaComplete(false);
    setVaramalaActive(true);
  };

  const handleTossGarland = () => {
    if (!varamalaActive || varamalaTossesLeft <= 0) return;

    // Calculate distance from center (50%)
    const distFromCenter = Math.abs(varamalaOscillator - 50);
    let pts = 20;
    let quality = language === 'te' ? 'శుభమాల!' : 'Nice Toss!';
    let msg = language === 'te' ? 'సువాసన గల మాల వేదికను అలంకరించింది!' : 'Fragrant jasmine touched the altar.';

    if (distFromCenter < 7) {
      pts = 100;
      quality = language === 'te' ? '✨ దివ్యమైన గురి! (బుల్స్‌ఐ)' : '✨ Sacred Bullseye!';
      msg = language === 'te' ? 'పరిపూర్ణమైన దైవ సంకల్పం! నేరుగా వధూవరుల మెడలో పడింది!' : 'Directly crowned upon the royal couple in perfect love!';
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.65 },
        colors: ['#0F3D32', '#D4AF37', '#FFF2C4', '#2D7A62']
      });
    } else if (distFromCenter < 18) {
      pts = 50;
      quality = language === 'te' ? '🌸 అద్భుతమైన విసిరివేత!' : '🌸 Royal Accuracy!';
      msg = language === 'te' ? 'మాల అందంగా వేదికపై కొలువైంది!' : 'A majestic garland toss onto the holy altar.';
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

  // ==========================================
  // GAME 3: KALASHA RING DUEL (BEST OF 3)
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
        setRoundOutcome(language === 'te' 
          ? "మోషే దొర పాల కలశంలో బంగారు ఉంగరాన్ని కనిపెట్టారు! (+50 పాయింట్లు టీమ్ మోషే 👑)"
          : "Moshe Dora's swift instinct found the sacred gold ring! (+50 Pts for Team Moshe 👑)");
        addPointsToTeam(50, 'moshe');
      } else {
        setKalashaScores(prev => ({ ...prev, priya: prev.priya + 1 }));
        setRoundOutcome(language === 'te'
          ? "నెల్లూరి ప్రియ రాచరిక నైపుణ్యంతో బంగారు ఉంగరాన్ని తీశారు! (+50 పాయింట్లు టీమ్ ప్రియ 💐)"
          : "Nelluri Priya's royal intuition seized the gold ring! (+50 Pts for Team Priya 💐)");
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
        setRoundOutcome(language === 'te'
          ? "ప్రియ చక్కగా వేరే కలశం నుండి ఉంగరాన్ని కనిపెట్టారు! (+50 పాయింట్లు టీమ్ ప్రియ 🌹)"
          : "Priya gracefully fished out the ring from the other pot! (+50 Pts for Team Priya 🌹)");
        addPointsToTeam(50, 'priya');
      } else {
        setKalashaScores(prev => ({ ...prev, moshe: prev.moshe + 1 }));
        setRoundOutcome(language === 'te'
          ? "మోషే దొర సునాయాసంగా ఉంగరాన్ని పట్టుకున్నారు! (+50 పాయింట్లు టీమ్ మోషే 👔)"
          : "Moshe Dora skillfully discovered the hidden ring! (+50 Pts for Team Moshe 👔)");
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

  const scrollToGame = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section className="relative py-20 px-4 sm:px-6 bg-[#F4F8F5] border-b border-[#0F3D32]/20" id="game">
      <div className="max-w-4xl mx-auto space-y-16">
        
        {/* Section Header */}
        <ScrollReveal direction="up" threshold={0.15}>
          <div className="text-center">
            <div className="inline-flex items-center gap-2 font-cinzel text-xs uppercase tracking-[0.3em] text-[#0F3D32] font-semibold mb-2 bg-white/80 px-4 py-1.5 rounded-full border border-[#D4AF37]/50 shadow-xs">
              <Trees className="w-3.5 h-3.5 text-[#2D7A62]" />
              {language === 'te' ? 'వివాహ వేడుకలు • వరుడు vs వధువు ఛాలెంజ్' : 'Eden Garden Celebrations • Groom vs Bride'}
              <Trees className="w-3.5 h-3.5 text-[#2D7A62]" />
            </div>
            <h2 className="font-decorative text-3xl sm:text-4xl md:text-5xl text-[#0F3D32] font-bold">
              {language === 'te' ? 'వివాహ సరదా గేమ్స్ & ఛాలెంజ్' : 'Eden Garden Wedding Games'}
            </h2>
            <p className="font-cormorant text-lg sm:text-xl text-[#2A2A2A]/80 italic max-w-xl mx-auto mt-2">
              {language === 'te'
                ? 'మీ అభిమాన టీమ్‌ను ఎంచుకోండి! మీరు ఆడే ప్రతి గేమ్ పాయింట్లు టీమ్ మోషే లేదా టీమ్ ప్రియ స్కోర్‌ను పెంచుతాయి!'
                : 'Pick your champion! Every point you score in each game increases the genuine celebration score of Team Moshe Dora or Team Nelluri Priya!'}
            </p>
          </div>
        </ScrollReveal>

        {/* ========================================================
            GRAND WEDDING BATTLE SCOREBOARD (100% REAL GUEST SCORES)
           ======================================================== */}
        <ScrollReveal direction="up" delay={60} threshold={0.15}>
          <div className="p-5 sm:p-7 rounded-3xl bg-gradient-to-br from-[#FFFDF9] via-[#F2F7F4] to-[#FFFDF9] border-2 border-[#D4AF37] shadow-lg relative overflow-hidden">
            
            {/* Top Battle Header */}
            <div className="flex flex-wrap items-center justify-between border-b border-[#0F3D32]/20 pb-3 mb-4 gap-2">
              <div className="flex items-center gap-2">
                <Crown className="w-4 h-4 text-[#D4AF37]" />
                <span className="font-cinzel text-xs sm:text-sm font-bold uppercase tracking-wider text-[#0F3D32]">
                  {language === 'te' ? 'వరుడు vs వధువు లైవ్ స్కోర్‌బోర్డ్' : 'Eden Garden Championship Battle'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-cinzel text-[11px] text-gray-500 font-semibold">
                  {language === 'te' ? 'మొత్తం ఆటలు:' : 'Total Real Plays:'} <strong className="text-[#0F3D32]">{teamScores.totalPlays}</strong>
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
                    <Check className="w-3 h-3" /> {language === 'te' ? 'సపోర్ట్' : 'Supporting'}
                  </span>
                )}
                <div className="flex items-center gap-2">
                  <span className="text-2xl sm:text-3xl">👔</span>
                  <div>
                    <div className="font-cinzel text-xs sm:text-sm font-bold text-[#0F3D32] uppercase">
                      {language === 'te' ? 'టీమ్ మోషే దొర' : 'Team Moshe Dora'}
                    </div>
                    <div className="font-cormorant text-xs text-gray-600 italic">
                      {language === 'te' ? 'వరుడు' : 'The Royal Groom'}
                    </div>
                  </div>
                </div>
                <div className="font-cinzel text-2xl sm:text-3xl font-extrabold text-[#0F3D32] mt-2">
                  {teamScores.moshe.toLocaleString()} <span className="text-xs font-normal text-gray-500">{language === 'te' ? 'పాయింట్లు' : 'pts'}</span>
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
                    <Check className="w-3 h-3" /> {language === 'te' ? 'సపోర్ట్' : 'Supporting'}
                  </span>
                )}
                <div className="flex items-center gap-2">
                  <span className="text-2xl sm:text-3xl">💐</span>
                  <div>
                    <div className="font-cinzel text-xs sm:text-sm font-bold text-[#5E1626] uppercase">
                      {language === 'te' ? 'టీమ్ నెల్లూరి ప్రియ' : 'Team Nelluri Priya'}
                    </div>
                    <div className="font-cormorant text-xs text-gray-600 italic">
                      {language === 'te' ? 'వధువు' : 'The Radiant Bride'}
                    </div>
                  </div>
                </div>
                <div className="font-cinzel text-2xl sm:text-3xl font-extrabold text-[#5E1626] mt-2">
                  {teamScores.priya.toLocaleString()} <span className="text-xs font-normal text-gray-500">{language === 'te' ? 'పాయింట్లు' : 'pts'}</span>
                </div>
              </button>
            </div>

            {/* Tug-of-War Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-cinzel font-bold">
                <span className="text-[#0F3D32]">Moshe: {moshePercent}%</span>
                <span className="text-gray-400 font-cormorant italic">{language === 'te' ? 'పాయింట్లు జోడించడానికి టీమ్‌ని ఎంచుకోండి' : 'Select a team to contribute your game points'}</span>
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
                  <span>+{recentPointFlyout.pts} {language === 'te' ? 'పాయింట్లు జోడించబడ్డాయి:' : 'Points Added to'} Team {recentPointFlyout.team === 'moshe' ? 'Moshe Dora 👔' : 'Nelluri Priya 💐'}!</span>
                </span>
              </div>
            )}

            {/* Quick Jumps to Games */}
            <div className="mt-4 pt-3 border-t border-[#D4AF37]/30 flex flex-wrap items-center justify-center gap-2 text-xs font-cinzel">
              <span className="text-gray-500 font-semibold">{language === 'te' ? 'ఆటల జాబితా:' : 'Jump to Game:'}</span>
              <button
                type="button"
                onClick={() => scrollToGame('game-talambralu')}
                className="px-3 py-1 rounded-full bg-white border border-[#0F3D32]/30 text-[#0F3D32] hover:bg-[#0F3D32] hover:text-[#F1DFA6] transition-all cursor-pointer font-bold shadow-2xs"
              >
                🌸 1. {language === 'te' ? 'తలంబ్రాల క్యాచ్' : 'Talambralu Catch'}
              </button>
              <button
                type="button"
                onClick={() => scrollToGame('game-varamala')}
                className="px-3 py-1 rounded-full bg-white border border-[#0F3D32]/30 text-[#0F3D32] hover:bg-[#0F3D32] hover:text-[#F1DFA6] transition-all cursor-pointer font-bold shadow-2xs"
              >
                💐 2. {language === 'te' ? 'వరమాల విసిరే ఛాలెంజ్' : 'Varamala Toss'}
              </button>
              <button
                type="button"
                onClick={() => scrollToGame('game-kalasha')}
                className="px-3 py-1 rounded-full bg-white border border-[#0F3D32]/30 text-[#0F3D32] hover:bg-[#0F3D32] hover:text-[#F1DFA6] transition-all cursor-pointer font-bold shadow-2xs"
              >
                🏺 3. {language === 'te' ? 'కలశం ఉంగరం ఆట' : 'Kalasha Ring Quest'}
              </button>
            </div>

          </div>
        </ScrollReveal>

        {/* ========================================================
            GAME 1: TALAMBRALU BLESSING CATCHER (SEPARATED CARD)
           ======================================================== */}
        <div id="game-talambralu" className="scroll-mt-24">
          <ScrollReveal direction="up" threshold={0.1}>
            <div className="bg-[#FFFDF9] rounded-3xl border-2 border-[#0F3D32]/40 p-4 sm:p-8 shadow-xl relative overflow-hidden">
              
              {/* Badge & Game Title Header */}
              <div className="flex flex-wrap items-center justify-between border-b border-[#0F3D32]/20 pb-4 mb-4 gap-2">
                <div>
                  <div className="inline-flex items-center gap-1.5 bg-[#0F3D32] text-[#F1DFA6] font-cinzel text-[10px] sm:text-xs font-bold uppercase tracking-wider px-3 py-0.5 rounded-full mb-1">
                    <span>🎮 {language === 'te' ? 'ఆట 01' : 'Game 01'}</span>
                  </div>
                  <h3 className="font-decorative text-2xl sm:text-3xl text-[#0F3D32] font-bold">
                    🌸 {language === 'te' ? 'తలంబ్రాల ముత్యాల క్యాచ్' : 'Talambralu Sacred Pearl Catch'}
                  </h3>
                  <p className="font-cormorant text-sm sm:text-base text-[#2A2A2A]/80 italic">
                    {language === 'te'
                      ? 'బంగారు తాంబూల తట్టను నడిపిస్తూ కురుస్తున్న పవిత్ర ముత్యాలు (🌟), మల్లెలు (🌸), గులాబీలు (🌹) & ఉంగరాలు (💍) పట్టుకోండి!'
                      : 'Glide the royal thali plate to catch falling pearls (🌟), jasmines (🌸), roses (🌹) & rings (💍)! Avoid chillies (🌶️).'}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0F3D32]/10 text-[#0F3D32] font-cinzel text-xs font-bold uppercase">
                    <Trophy className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>{language === 'te' ? 'పాయింట్లు:' : 'Score:'} {blessingScore}</span>
                  </div>

                  {combo > 2 && (
                    <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#0F3D32] text-[#F1DFA6] font-cinzel text-xs font-bold animate-bounce border border-[#D4AF37]">
                      <Flame className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>{combo}x Combo!</span>
                    </div>
                  )}

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
                    {language === 'te' ? 'మౌస్ లేదా టచ్ ద్వారా తట్టను కదపండి' : 'Move cursor or swipe touch to glide the sacred thali'}
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
                      ✨ {language === 'te' ? 'తాంబూలం' : 'Thali'}
                    </span>
                  </div>
                  <div className="w-12 h-2 bg-black/20 rounded-full blur-[2px] mt-0.5" />
                </div>

                {/* Overlay when game is idle / game over */}
                {!gameActive && (
                  <div className="absolute inset-0 bg-[#061C16]/65 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center z-30">
                    {blessingScore > 0 ? (
                      <div className="space-y-3 animate-fadeIn">
                        <div className="text-4xl">🎊</div>
                        <h4 className="font-decorative text-2xl sm:text-3xl font-bold text-[#FFF2C4]">
                          {language === 'te' ? 'తలంబ్రాల ఆట పూర్తయింది!' : 'Eden Blessing Shower Complete!'}
                        </h4>
                        <p className="font-cinzel text-base text-[#F1DFA6] font-bold">
                          +{blessingScore} {language === 'te' ? 'పాయింట్లు' : 'Points'} &bull; Team {userTeam === 'moshe' ? 'Moshe Dora 👔' : 'Nelluri Priya 💐'}!
                        </p>
                        <p className="font-cormorant text-sm text-[#FFFDF9]/90 italic max-w-sm">
                          {language === 'te' ? 'మీ పాయింట్లు స్కోర్‌బోర్డ్‌లో విజయవంతంగా చేర్చబడ్డాయి!' : 'Your points have been recorded to the live wedding leaderboard!'}
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="text-4xl animate-bounce">🌸</div>
                        <h4 className="font-decorative text-2xl sm:text-3xl font-bold text-[#FFF2C4]">
                          {language === 'te' ? 'తలంబ్రాల ముత్యాల క్యాచ్' : 'Talambralu Blessing Catcher'}
                        </h4>
                        <p className="font-cormorant text-sm sm:text-base text-[#F1DFA6] italic max-w-md">
                          {language === 'te' 
                            ? '30 సెకన్ల వ్యవధిలో పడే ముత్యాలు, మల్లెలు మరియు ఉంగరాలను పట్టుకుని పాయింట్లు సంపాదించండి.'
                            : 'Catch falling golden pearls, jasmines, roses and sacred rings to score high for your team!'}
                        </p>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={startTalambraluGame}
                      className="mt-5 px-8 py-3 rounded-full bg-gradient-to-r from-[#0F3D32] via-[#2D7A62] to-[#0F3D32] hover:scale-105 text-[#FFF2C4] font-cinzel text-xs sm:text-sm font-bold uppercase tracking-[0.2em] border-2 border-[#D4AF37] shadow-xl flex items-center gap-2 cursor-pointer transition-all"
                    >
                      <Play className="w-4 h-4 fill-current text-[#D4AF37]" />
                      <span>{blessingScore > 0 ? (language === 'te' ? "మళ్లీ ఆడండి (30s)" : "Play Again (30s)") : (language === 'te' ? "ఆట ప్రారంభించండి" : "Start Pearl Catch Game")}</span>
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
                    ⬅️ {language === 'te' ? 'ఎడమ' : 'Left'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setThaliX(prev => Math.min(90, prev + 15))}
                    className="flex-1 py-2 rounded-xl bg-[#0F3D32]/15 text-[#0F3D32] font-cinzel text-xs font-bold uppercase"
                  >
                    {language === 'te' ? 'కుడి' : 'Right'} ➡️
                  </button>
                </div>
              )}
            </div>
          </ScrollReveal>
        </div>

        {/* ========================================================
            GAME 2: VARAMALA SACRED GARLAND TOSS (SEPARATED CARD)
           ======================================================== */}
        <div id="game-varamala" className="scroll-mt-24">
          <ScrollReveal direction="up" threshold={0.1}>
            <div className="bg-[#FFFDF9] rounded-3xl border-2 border-[#0F3D32]/40 p-6 sm:p-10 shadow-xl text-center">
              
              <div className="max-w-xl mx-auto mb-6">
                <div className="inline-flex items-center gap-1.5 bg-[#0F3D32] text-[#F1DFA6] font-cinzel text-[10px] sm:text-xs font-bold uppercase tracking-wider px-3 py-0.5 rounded-full mb-1">
                  <span>🎯 {language === 'te' ? 'ఆట 02' : 'Game 02'}</span>
                </div>
                <h3 className="font-decorative text-2xl sm:text-3xl text-[#0F3D32] font-bold">
                  💐 {language === 'te' ? 'వరమాల విసిరే ఛాలెంజ్' : 'Sacred Garland Toss Challenge'}
                </h3>
                <p className="font-cormorant text-base text-[#2A2A2A]/80 italic mt-1">
                  {language === 'te'
                    ? 'సువాసన గల మల్లెలు మరియు గులాబీల మాలను సరైన సమయంలో వేదికపైకి విసరండి! బంగారు కేంద్రంలో పడితే 100 పాయింట్లు లభిస్తాయి!'
                    : 'Time your toss to land the fragrant jasmine & rose garland onto the ceremonial altar! Hit the golden center for 100 points!'}
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
                      {language === 'te' ? 'పరిశుద్ధ వివాహ వేదిక' : 'Holy Altar Target'}
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
                          ✨ {language === 'te' ? 'బుల్స్‌ఐ (100 Pts)' : 'Bullseye (100 Pts)'}
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
                    <span>{isVaramalaComplete ? (language === 'te' ? "మళ్లీ విసరండి (5 రౌండ్లు)" : "Toss Again (5 Rounds)") : (language === 'te' ? "వరమాల ఛాలెంజ్ ప్రారంభించండి" : "Start Garland Toss Challenge")}</span>
                  </button>
                ) : (
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <button
                      type="button"
                      onClick={handleTossGarland}
                      className="px-10 py-4 rounded-full bg-gradient-to-r from-[#0F3D32] via-[#2D7A62] to-[#0F3D32] hover:scale-105 active:scale-95 text-[#FFF2C4] font-cinzel text-sm sm:text-base font-extrabold uppercase tracking-[0.22em] border-2 border-[#D4AF37] shadow-2xl flex items-center gap-2 cursor-pointer transition-all animate-pulse"
                    >
                      <span>💐 {language === 'te' ? 'ఇప్పుడే మాల విసరండి!' : 'TOSS GARLAND NOW!'}</span>
                    </button>
                    <div className="font-cinzel text-xs font-bold text-gray-600">
                      {language === 'te' ? 'మిగిలిన విసిరివేతలు:' : 'Tosses Remaining:'} <span className="text-[#0F3D32] text-base font-bold">{varamalaTossesLeft}</span> / 5
                    </div>
                  </div>
                )}

                {varamalaTotalScore > 0 && (
                  <div className="text-xs font-cinzel text-[#0F3D32] font-semibold">
                    {language === 'te' ? 'మొత్తం స్కోర్:' : 'Session Score:'} <strong>+{varamalaTotalScore} pts</strong> &bull; Team {userTeam === 'moshe' ? 'Moshe' : 'Priya'}!
                  </div>
                )}
              </div>

            </div>
          </ScrollReveal>
        </div>

        {/* ========================================================
            GAME 3: SACRED KALASHA RING DUEL (SEPARATED CARD)
           ======================================================== */}
        <div id="game-kalasha" className="scroll-mt-24">
          <ScrollReveal direction="up" threshold={0.1}>
            <div className="bg-[#FFFDF9] rounded-3xl border-2 border-[#0F3D32]/40 p-6 sm:p-10 shadow-xl text-center">
              
              <div className="max-w-xl mx-auto mb-6">
                <div className="inline-flex items-center gap-1.5 bg-[#0F3D32] text-[#F1DFA6] font-cinzel text-[10px] sm:text-xs font-bold uppercase tracking-wider px-3 py-0.5 rounded-full mb-1">
                  <span>🏺 {language === 'te' ? 'ఆట 03' : 'Game 03'}</span>
                </div>
                <h3 className="font-decorative text-2xl sm:text-3xl text-[#0F3D32] font-bold">
                  🏺 {language === 'te' ? 'బంగారు కలశం ఉంగరం ఆట' : 'The Golden Kalasha Ring Quest'}
                </h3>
                <p className="font-cormorant text-base text-[#2A2A2A]/80 italic mt-1">
                  {language === 'te'
                    ? 'పాల కలశంలో దాగి ఉన్న పవిత్ర బంగారు ఉంగరాన్ని కనిపెట్టండి! 3 రౌండ్లలో ఎవరు ఎక్కువసార్లు ఉంగరాన్ని కనిపెడతారో చూద్దాం!'
                    : 'A consecrated gold ring is slipped into one of the three milk & rose petal pots. Guess the right pot to win points! (Best of 3)'}
                </p>
              </div>

              {/* Kalasha Duel Scoreboard */}
              <div className="grid grid-cols-2 gap-4 max-w-md mx-auto mb-6">
                <div className={`p-3 rounded-2xl border-2 text-center ${userTeam === 'moshe' ? 'border-[#0F3D32] bg-[#0F3D32]/10' : 'border-gray-200'}`}>
                  <div className="text-xl">👔</div>
                  <div className="font-cinzel text-xs font-bold text-[#0F3D32]">{language === 'te' ? 'మోషే దొర' : 'Moshe Dora'}</div>
                  <div className="font-cinzel text-xl font-bold text-[#0F3D32]">{kalashaScores.moshe} {language === 'te' ? 'విజయాలు' : 'Wins'}</div>
                </div>

                <div className={`p-3 rounded-2xl border-2 text-center ${userTeam === 'priya' ? 'border-[#5E1626] bg-[#5E1626]/10' : 'border-gray-200'}`}>
                  <div className="text-xl">💐</div>
                  <div className="font-cinzel text-xs font-bold text-[#5E1626]">{language === 'te' ? 'నెల్లూరి ప్రియ' : 'Nelluri Priya'}</div>
                  <div className="font-cinzel text-xl font-bold text-[#5E1626]">{kalashaScores.priya} {language === 'te' ? 'విజయాలు' : 'Wins'}</div>
                </div>
              </div>

              {/* Round Indicator */}
              {!isMatchOver && (
                <div className="font-cinzel text-xs font-bold text-[#0F3D32] uppercase tracking-wider mb-4">
                  {language === 'te' ? `రౌండ్ ${roundNumber} / 3 • ఒక కలశాన్ని ఎంచుకోండి` : `Round ${roundNumber} of 3 • Select a Milk & Rose Kalasha`}
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
                          {language === 'te' ? `కలశం #${idx + 1}` : `Kalasha #${idx + 1}`}
                        </div>
                        <div className="text-[11px] font-cormorant text-gray-500 italic">
                          {isRevealed && hasRing 
                            ? (language === 'te' ? "ఉంగరం దొరికింది!" : "Gold Ring Found!") 
                            : (language === 'te' ? "పాల గులాబీ దళాలు" : "Milk & Rose Petals")}
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
                    {roundNumber >= 3 
                      ? (language === 'te' ? "ఫలితాలు చూడండి 👑" : "View Tournament Outcome 👑") 
                      : (language === 'te' ? "తదుపరి రౌండ్‌కు వెళ్లండి ➡️" : "Proceed to Next Round ➡️")}
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
                      ? (language === 'te' ? "మోషే దొర బంగారు ఉంగరాల విజేత! (+100 Pts)" : "Moshe Dora Wins The Golden Ring Quest! (+100 Pts)")
                      : kalashaScores.priya > kalashaScores.moshe
                      ? (language === 'te' ? "నెల్లూరి ప్రియ రాచరిక కలశ విజేత! (+100 Pts)" : "Nelluri Priya Conquers The Royal Kalasha! (+100 Pts)")
                      : (language === 'te' ? "ఇరువైపులా సమాన విజయం • పరిపూర్ణ దైవ బంధం!" : "A Divine Holy Tie • Perfect Biblical Equality!")}
                  </h4>
                  <p className="font-cormorant text-base text-[#2A2A2A] italic mt-2 leading-relaxed">
                    {kalashaScores.moshe > kalashaScores.priya
                      ? (language === 'te' ? "వివాహ సంప్రదాయం ప్రకారం ప్రయాణాలలో సంగీతాన్ని ఎంచుకునే హక్కు మోషే దొర గారిది!" : "Tradition says Moshe Dora gets supreme authority over Sunday road-trip music playlists!")
                      : kalashaScores.priya > kalashaScores.moshe
                      ? (language === 'te' ? "సంప్రదాయం ప్రకారం షాపింగ్ మరియు విహారయాత్రలను నిర్ణయించే అధికారం ప్రియ గారిది!" : "Tradition decrees that Priya gets executive power over all holiday destinations & wedding shopping!")
                      : (language === 'te' ? "దేవుని సన్నిధిలో ఏకమైన ఇద్దరు వ్యక్తులు — ఆనందం, పరస్పర గౌరవంతో ఆశీర్వదించబడ్డారు!" : "Two hearts beating as one in God's Eden garden — blessed with laughter and mutual respect!")}
                  </p>

                  <button
                    type="button"
                    onClick={handleResetKalashaGame}
                    className="mt-5 px-6 py-2.5 rounded-full bg-[#0F3D32] hover:bg-[#2D7A62] text-[#F1DFA6] font-cinzel text-xs font-bold uppercase tracking-wider transition-all shadow cursor-pointer inline-flex items-center gap-2"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                    <span>{language === 'te' ? 'మరో మ్యాచ్ ఆడండి' : 'Play Another Duel'}</span>
                  </button>
                </div>
              )}
            </div>
          </ScrollReveal>
        </div>

      </div>
    </section>
  );
};
