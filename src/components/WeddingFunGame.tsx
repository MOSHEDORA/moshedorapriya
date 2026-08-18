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
  Flower2,
  User,
  Phone,
  Edit3,
  X,
  Lock,
  ArrowRight,
  ShieldAlert,
  ArrowRightLeft
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { doc, onSnapshot, setDoc, increment, getDoc, collection, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { ScrollReveal } from './ScrollReveal';
import { useLanguage } from '../context/LanguageContext';
import { WeddingLeaderboard } from './WeddingLeaderboard';

// Persistent LocalStorage Keys
const STORAGE_TEAM_SCORES_KEY = 'moshe_priya_eden_scores_clean_v1';
const STORAGE_USER_CHAMPION_KEY = 'moshe_priya_user_champion_clean_v1';
const STORAGE_PLAYER_PROFILE_KEY = 'moshe_priya_player_profile_v1';

const INITIAL_SCORES = {
  moshe: 0,
  priya: 0,
  totalPlays: 0
};

interface PlayerProfile {
  name: string;
  phone: string;
}

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
  // PLAYER IDENTITY & REGISTRATION GATE
  // ==========================================
  const [playerProfile, setPlayerProfile] = useState<PlayerProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_PLAYER_PROFILE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.name && parsed.phone) {
          return {
            name: parsed.name,
            phone: parsed.phone
          };
        }
      }
    } catch {}
    return { name: '', phone: '' };
  });

  // Registration Form State
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regTeam, setRegTeam] = useState<'moshe' | 'priya'>('moshe');
  const [regError, setRegError] = useState('');

  // Profile Edit Modal State
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [modalName, setModalName] = useState('');
  const [modalPhone, setModalPhone] = useState('');
  const [modalError, setModalError] = useState('');

  const [playerCumulativeMarks, setPlayerCumulativeMarks] = useState<number>(0);

  // ==========================================
  // TEAM SELECTION & LIVE SCORES
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
    } catch {}
    return INITIAL_SCORES;
  });

  const [recentPointFlyout, setRecentPointFlyout] = useState<{ 
    team: 'moshe' | 'priya'; 
    pts: number; 
    playerName?: string;
    isLoss?: boolean;
    transferredTo?: 'moshe' | 'priya';
    msg?: string;
  } | null>(null);

  // Sync player cumulative marks from Firestore in real-time
  useEffect(() => {
    if (!playerProfile.phone) return;
    const cleanPhone = playerProfile.phone.replace(/[^\d+]/g, '').slice(-15);
    if (!cleanPhone) return;

    const playerDocRef = doc(db, 'game_leaderboard', `player_${cleanPhone}`);
    const unsubscribe = onSnapshot(
      playerDocRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setPlayerCumulativeMarks(Number(data.score) || 0);
        }
      },
      (err) => {
        console.warn('Player marks listener fallback:', err);
      }
    );

    return () => unsubscribe();
  }, [playerProfile.phone]);

  // Sync global team scores
  useEffect(() => {
    const scoresDocRef = doc(db, 'game_scores', 'global_scores');
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

    return () => unsubscribe();
  }, []);

  // Check if player is registered
  const isRegistered = Boolean(playerProfile.name && playerProfile.phone);

  // ==========================================
  // REGISTRATION & PROFILE HANDLERS
  // ==========================================
  const handleInitialRegistration = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = regName.trim();
    const cleanPhone = regPhone.replace(/[^\d+]/g, '').trim();

    if (!cleanName) {
      setRegError(language === 'te' ? 'దయచేసి మీ పేరు నమోదు చేయండి' : 'Please enter your full name');
      return;
    }
    if (!cleanPhone || cleanPhone.length < 5) {
      setRegError(language === 'te' ? 'దయచేసి సరైన ఫోన్ నంబర్ నమోదు చేయండి' : 'Please enter a valid phone number');
      return;
    }

    setRegError('');
    const newProf = { name: cleanName, phone: cleanPhone };
    setPlayerProfile(newProf);
    setUserTeam(regTeam);

    try {
      localStorage.setItem(STORAGE_PLAYER_PROFILE_KEY, JSON.stringify(newProf));
      localStorage.setItem(STORAGE_USER_CHAMPION_KEY, regTeam);
    } catch {}

    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 },
      colors: regTeam === 'moshe' ? ['#0F3D32', '#2D7A62', '#D4AF37'] : ['#5E1626', '#8C1D36', '#D4AF37']
    });
  };

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = modalName.trim();
    const cleanPhone = modalPhone.replace(/[^\d+]/g, '').trim();

    if (!cleanName) {
      setModalError(language === 'te' ? 'దయచేసి మీ పేరు నమోదు చేయండి' : 'Please enter your name');
      return;
    }
    if (!cleanPhone || cleanPhone.length < 5) {
      setModalError(language === 'te' ? 'దయచేసి సరైన ఫోన్ నంబర్ నమోదు చేయండి' : 'Please enter a valid phone number');
      return;
    }

    setModalError('');
    const newProf = { name: cleanName, phone: cleanPhone };
    setPlayerProfile(newProf);
    try {
      localStorage.setItem(STORAGE_PLAYER_PROFILE_KEY, JSON.stringify(newProf));
    } catch {}
    setShowProfileModal(false);
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

  // ============================================================
  // UNIFIED MATCH EVENT & POINT TRANSFER LOGGER
  // ============================================================
  const logMatchResult = async ({
    gameName,
    outcome,
    pointsWon = 0,
    pointsLost = 0,
    pointsTransferredToOpponent = 0,
    customDesc,
    customTeluguDesc
  }: {
    gameName: string;
    outcome: 'won' | 'lost' | 'partial';
    pointsWon?: number;
    pointsLost?: number;
    pointsTransferredToOpponent?: number;
    customDesc?: string;
    customTeluguDesc?: string;
  }) => {
    if (!playerProfile.name || !playerProfile.phone) return;

    const cleanPhone = playerProfile.phone.replace(/[^\d+]/g, '').slice(-15);
    const playerId = `player_${cleanPhone}`;
    const opponentTeam = userTeam === 'moshe' ? 'priya' : 'moshe';
    const teamTitle = userTeam === 'moshe' ? 'Moshe Dora' : 'Nelluri Priya';
    const opponentTitle = opponentTeam === 'moshe' ? 'Moshe Dora' : 'Nelluri Priya';
    const teamTitleTe = userTeam === 'moshe' ? 'మోషే దొర' : 'నెల్లూరి ప్రియ';
    const opponentTitleTe = opponentTeam === 'moshe' ? 'మోషే దొర' : 'నెల్లూరి ప్రియ';

    // Default descriptions if custom not provided
    let defaultDesc = '';
    let defaultTeluguDesc = '';

    if (outcome === 'lost' || pointsLost > 0 || pointsTransferredToOpponent > 0) {
      defaultDesc = `${playerProfile.name} supported Team ${teamTitle} in ${gameName} but failed, so Team ${teamTitle} lost ${pointsLost || pointsTransferredToOpponent} points to Team ${opponentTitle}!`;
      defaultTeluguDesc = `${playerProfile.name} టీమ్ ${teamTitleTe} తరఫున ${gameName}లో విఫలమయ్యారు, కాబట్టి ${teamTitleTe} ${pointsLost || pointsTransferredToOpponent} పాయింట్లు కోల్పోయి టీమ్ ${opponentTitleTe}కు బదిలీ అయ్యాయి!`;
    } else {
      defaultDesc = `${playerProfile.name} achieved a stellar victory in ${gameName}, earning ${pointsWon} points for Team ${teamTitle}!`;
      defaultTeluguDesc = `${playerProfile.name} ${gameName}లో అద్భుత విజయం సాధించి, టీమ్ ${teamTitleTe}కు ${pointsWon} పాయింట్లను తెచ్చిపెట్టారు!`;
    }

    const finalDesc = customDesc || defaultDesc;
    const finalTeluguDesc = customTeluguDesc || defaultTeluguDesc;

    // Trigger visual notification banner
    setRecentPointFlyout({
      team: userTeam,
      pts: pointsWon > 0 ? pointsWon : pointsLost || pointsTransferredToOpponent,
      playerName: playerProfile.name,
      isLoss: pointsLost > 0 || pointsTransferredToOpponent > 0,
      transferredTo: pointsTransferredToOpponent > 0 ? opponentTeam : undefined,
      msg: finalDesc
    });
    setTimeout(() => setRecentPointFlyout(null), 4500);

    // 1. Update Global Team Scores in state & Firestore
    setTeamScores(prev => {
      let newMoshe = prev.moshe;
      let newPriya = prev.priya;

      if (userTeam === 'moshe') {
        newMoshe = Math.max(0, newMoshe + pointsWon - pointsLost);
        if (pointsTransferredToOpponent > 0) {
          newPriya += pointsTransferredToOpponent;
        }
      } else {
        newPriya = Math.max(0, newPriya + pointsWon - pointsLost);
        if (pointsTransferredToOpponent > 0) {
          newMoshe += pointsTransferredToOpponent;
        }
      }

      const updated = {
        moshe: newMoshe,
        priya: newPriya,
        totalPlays: prev.totalPlays + 1
      };

      try {
        localStorage.setItem(STORAGE_TEAM_SCORES_KEY, JSON.stringify(updated));
      } catch {}

      return updated;
    });

    try {
      const scoresDocRef = doc(db, 'game_scores', 'global_scores');
      const scoreUpdates: Record<string, unknown> = {
        totalPlays: increment(1),
        lastUpdated: new Date().toISOString()
      };

      if (pointsWon > 0) {
        scoreUpdates[userTeam] = increment(pointsWon);
      }
      if (pointsLost > 0) {
        scoreUpdates[userTeam] = increment(-pointsLost);
      }
      if (pointsTransferredToOpponent > 0) {
        scoreUpdates[opponentTeam] = increment(pointsTransferredToOpponent);
      }

      await setDoc(scoresDocRef, scoreUpdates, { merge: true });
    } catch (e) {
      console.warn('Firestore team scores write error:', e);
    }

    // 2. Update Leaderboard Entry for Player
    try {
      const playerDocRef = doc(db, 'game_leaderboard', playerId);
      await setDoc(
        playerDocRef,
        {
          name: playerProfile.name,
          phone: playerProfile.phone,
          score: increment(Math.max(0, pointsWon - pointsLost)),
          team: userTeam,
          gamesPlayed: increment(1),
          lastPlayed: new Date().toISOString()
        },
        { merge: true }
      );
    } catch (e) {
      console.warn('Firestore player score write error:', e);
    }

    // 3. Dual write via Server Leaderboard API
    try {
      await fetch('/api/leaderboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: playerProfile.name,
          phone: playerProfile.phone,
          points: pointsWon,
          pointsLost,
          pointsTransferredToOpponent,
          team: userTeam
        })
      });
    } catch (e) {
      console.warn('Server leaderboard write fallback:', e);
    }

    // 4. Save to Match History (Firestore + Server API)
    const now = new Date();
    const historyPayload = {
      playerName: playerProfile.name,
      playerPhone: playerProfile.phone,
      team: userTeam,
      opponentTeam,
      gameName,
      outcome,
      pointsWon,
      pointsLost,
      pointsTransferredToOpponent,
      description: finalDesc,
      teluguDescription: finalTeluguDesc,
      timestamp: now.toISOString(),
      formattedTime: now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true }),
      formattedDate: now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };

    try {
      await addDoc(collection(db, 'game_history'), historyPayload);
    } catch (e) {
      console.warn('Firestore game history write fallback:', e);
    }

    try {
      await fetch('/api/match-history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(historyPayload)
      });
    } catch (e) {
      console.warn('Server match history write fallback:', e);
    }
  };

  // Percentage calculations for dynamic tug-of-war bar
  const totalPoints = teamScores.moshe + teamScores.priya;
  const moshePercent = totalPoints === 0 ? 50 : Math.round((teamScores.moshe / totalPoints) * 100);
  const priyaPercent = 100 - moshePercent;

  const maskPhone = (phone: string) => {
    if (!phone) return '';
    const clean = phone.replace(/[^\d+]/g, '');
    if (clean.length <= 4) return clean;
    if (clean.length <= 7) return clean.slice(0, 2) + '••••' + clean.slice(-2);
    return clean.slice(0, 4) + '••••' + clean.slice(-2);
  };

  // ==========================================
  // GAME 1: TALAMBRALU BLESSING CATCHER
  // ==========================================
  const [gameActive, setGameActive] = useState(false);
  const [gameTimeLeft, setGameTimeLeft] = useState(30);
  const [blessingScore, setBlessingScore] = useState(0);
  const [chilliesCaught, setChilliesCaught] = useState(0);
  const [combo, setCombo] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [thaliX, setThaliX] = useState(50);
  const [fallingItems, setFallingItems] = useState<FallingItem[]>([]);
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const nextItemIdRef = useRef(1);

  const startTalambraluGame = () => {
    setBlessingScore(0);
    setChilliesCaught(0);
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

  useEffect(() => {
    if (!gameActive) return;

    const timerInterval = setInterval(() => {
      setGameTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerInterval);
          setGameActive(false);

          // Calculate match outcome
          const teamName = userTeam === 'moshe' ? 'Moshe Dora' : 'Nelluri Priya';
          const opponentName = userTeam === 'moshe' ? 'Nelluri Priya' : 'Moshe Dora';
          const teamNameTe = userTeam === 'moshe' ? 'మోషే దొర' : 'నెల్లూరి ప్రియ';
          const opponentNameTe = userTeam === 'moshe' ? 'నెల్లూరి ప్రియ' : 'మోషే దొర';

          if (blessingScore <= 20 || chilliesCaught >= 3) {
            // Failed attempt / penalty: points lost and transferred to opponent!
            const lostPts = 100;
            logMatchResult({
              gameName: 'Talambralu Pearl Catch',
              outcome: 'lost',
              pointsWon: 0,
              pointsLost: lostPts,
              pointsTransferredToOpponent: lostPts,
              customDesc: `${playerProfile.name} supported Team ${teamName} in Talambralu Pearl Catch but caught ${chilliesCaught} fiery chillies, causing Team ${teamName} to lose ${lostPts} points to Team ${opponentName}!`,
              customTeluguDesc: `${playerProfile.name} టీమ్ ${teamNameTe} తరఫున తలంబ్రాలు ఆటలో ${chilliesCaught} ఎండుమిరపకాయలు పట్టి విఫలమయ్యారు, కాబట్టి ${teamNameTe} ${lostPts} పాయింట్లు కోల్పోయి టీమ్ ${opponentNameTe}కు బదిలీ అయ్యాయి!`
            });
          } else {
            // Won game!
            logMatchResult({
              gameName: 'Talambralu Pearl Catch',
              outcome: 'won',
              pointsWon: blessingScore,
              pointsLost: 0,
              pointsTransferredToOpponent: 0,
              customDesc: `${playerProfile.name} scored ${blessingScore} sacred pearl points for Team ${teamName} in Talambralu Catch!`,
              customTeluguDesc: `${playerProfile.name} తలంబ్రాల ఆటలో టీమ్ ${teamNameTe} కోసం ${blessingScore} పవిత్ర పాయింట్లను సాధించారు!`
            });
            confetti({
              particleCount: 75,
              spread: 80,
              origin: { y: 0.6 },
              colors: ['#0F3D32', '#2D7A62', '#D4AF37', '#FFFDF9', '#E8A5B3']
            });
          }

          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    let lastSpawn = Date.now();

    const updatePhysics = () => {
      const now = Date.now();
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
        } else if (rand < 0.90) {
          itemType = 'ring';
          emoji = '💍';
          points = 50;
          name = 'Sacred Gold Ring!';
        } else {
          itemType = 'chilli';
          emoji = '🌶️';
          points = -15;
          name = 'Fiery Chilli';
        }

        const newItem: FallingItem = {
          id: nextItemIdRef.current++,
          x: 12 + Math.random() * 76,
          y: 0,
          speed: 0.42 + Math.random() * 0.28,
          type: itemType,
          emoji,
          points,
          name
        };

        setFallingItems(prev => [...prev.slice(-20), newItem]);
      }

      setFallingItems(prev => {
        const nextList: FallingItem[] = [];
        for (const item of prev) {
          const newY = item.y + item.speed;

          if (newY >= 78 && newY <= 92 && Math.abs(item.x - thaliX) <= 15) {
            playCatchChime(item.type);
            if (item.type === 'chilli') {
              setBlessingScore(s => Math.max(0, s + item.points));
              setChilliesCaught(c => c + 1);
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
  }, [gameActive, thaliX, blessingScore, chilliesCaught, combo, highScore, userTeam, playerProfile]);

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
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1760, ctx.currentTime + 0.15);
      } else if (type === 'chilli') {
        osc.frequency.setValueAtTime(220, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + 0.12);
      } else {
        osc.frequency.setValueAtTime(523.25, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(659.25, ctx.currentTime + 0.1);
      }

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    } catch {}
  };

  // ==========================================
  // GAME 2: VARAMALA SACRED GARLAND TOSS
  // ==========================================
  const [varamalaOscillator, setVaramalaOscillator] = useState(50);
  const [varamalaDir, setVaramalaDir] = useState(1);
  const [varamalaTossesLeft, setVaramalaTossesLeft] = useState(5);
  const [varamalaResult, setVaramalaResult] = useState<{ quality: string; pts: number; msg: string; isMiss?: boolean } | null>(null);
  const [varamalaTotalScore, setVaramalaTotalScore] = useState(0);
  const [varamalaMisses, setVaramalaMisses] = useState(0);
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
    setVaramalaMisses(0);
    setVaramalaResult(null);
    setIsVaramalaComplete(false);
    setVaramalaActive(true);
  };

  const handleTossGarland = () => {
    if (!varamalaActive || varamalaTossesLeft <= 0) return;

    const distFromCenter = Math.abs(varamalaOscillator - 50);
    const teamName = userTeam === 'moshe' ? 'Moshe Dora' : 'Nelluri Priya';
    const opponentName = userTeam === 'moshe' ? 'Nelluri Priya' : 'Moshe Dora';
    const teamNameTe = userTeam === 'moshe' ? 'మోషే దొర' : 'నెల్లూరి ప్రియ';
    const opponentNameTe = userTeam === 'moshe' ? 'నెల్లూరి ప్రియ' : 'మోషే దొర';

    let pts = 0;
    let quality = '';
    let msg = '';
    let isMiss = false;

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
    } else if (distFromCenter < 20) {
      pts = 40;
      quality = language === 'te' ? '🌸 అద్భుతమైన విసిరివేత!' : '🌸 Royal Accuracy!';
      msg = language === 'te' ? 'మాల అందంగా వేదికపై కొలువైంది!' : 'A majestic garland toss onto the holy altar.';
    } else {
      // Complete Miss -> Penalty / Points lost to opponent!
      isMiss = true;
      pts = 0;
      quality = language === 'te' ? '❌ గురి తప్పింది!' : '❌ Missed the Altar!';
      msg = language === 'te' ? 'మాల వేదిక దాటిపోయింది! 30 పాయింట్లు ప్రత్యర్థి టీమ్‌కి బదిలీ అయ్యాయి.' : 'Garland missed the podium! 30 points transferred to rival team.';
      setVaramalaMisses(m => m + 1);
    }

    setVaramalaTotalScore(prev => prev + pts);
    setVaramalaResult({ quality, pts, msg, isMiss });

    // Single toss log if it's a critical miss or critical bullseye
    if (isMiss) {
      logMatchResult({
        gameName: 'Varamala Garland Toss',
        outcome: 'lost',
        pointsWon: 0,
        pointsLost: 30,
        pointsTransferredToOpponent: 30,
        customDesc: `${playerProfile.name} supported Team ${teamName} but missed the garland toss, so Team ${teamName} lost 30 points to Team ${opponentName}!`,
        customTeluguDesc: `${playerProfile.name} టీమ్ ${teamNameTe} తరఫున వరమాల విసురుతూ గురి తప్పారు, కాబట్టి ${teamNameTe} 30 పాయింట్లు కోల్పోయి టీమ్ ${opponentNameTe}కు బదిలీ అయ్యాయి!`
      });
    } else {
      logMatchResult({
        gameName: 'Varamala Garland Toss',
        outcome: 'won',
        pointsWon: pts,
        pointsLost: 0,
        pointsTransferredToOpponent: 0,
        customDesc: `${playerProfile.name} tossed garland with royal precision (+${pts} pts for Team ${teamName})!`,
        customTeluguDesc: `${playerProfile.name} వరమాలను దివ్యంగా విసిరి టీమ్ ${teamNameTe}కు +${pts} పాయింట్లను సాధించారు!`
      });
    }

    setVaramalaTossesLeft(prev => {
      const next = prev - 1;
      if (next <= 0) {
        setIsVaramalaComplete(true);
        confetti({
          particleCount: 80,
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

    const teamName = userTeam === 'moshe' ? 'Moshe Dora' : 'Nelluri Priya';
    const opponentName = userTeam === 'moshe' ? 'Nelluri Priya' : 'Moshe Dora';
    const teamNameTe = userTeam === 'moshe' ? 'మోషే దొర' : 'నెల్లూరి ప్రియ';
    const opponentNameTe = userTeam === 'moshe' ? 'నెల్లూరి ప్రియ' : 'మోషే దొర';

    if (isWinner) {
      if (userTeam === 'moshe') {
        setKalashaScores(prev => ({ ...prev, moshe: prev.moshe + 1 }));
        setRoundOutcome(language === 'te' 
          ? "మోషే దొర పాల కలశంలో బంగారు ఉంగరాన్ని కనిపెట్టారు! (+50 పాయింట్లు టీమ్ మోషే 👑)"
          : "Moshe Dora's swift instinct found the sacred gold ring! (+50 Pts for Team Moshe 👑)");
      } else {
        setKalashaScores(prev => ({ ...prev, priya: prev.priya + 1 }));
        setRoundOutcome(language === 'te'
          ? "నెల్లూరి ప్రియ రాచరిక నైపుణ్యంతో బంగారు ఉంగరాన్ని తీశారు! (+50 పాయింట్లు టీమ్ ప్రియ 💐)"
          : "Nelluri Priya's royal intuition seized the gold ring! (+50 Pts for Team Priya 💐)");
      }

      logMatchResult({
        gameName: 'Kalasha Ring Duel',
        outcome: 'won',
        pointsWon: 50,
        pointsLost: 0,
        pointsTransferredToOpponent: 0,
        customDesc: `${playerProfile.name} supported Team ${teamName} and found the sacred gold ring in the milk kalasha (+50 pts)!`,
        customTeluguDesc: `${playerProfile.name} టీమ్ ${teamNameTe} తరఫున పాల కలశంలో బంగారు ఉంగరాన్ని కనిపెట్టి +50 పాయింట్లు సాధించారు!`
      });

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.65 },
        colors: ['#0F3D32', '#D4AF37', '#FFF2C4', '#2D7A62']
      });
    } else {
      // Picked wrong pot -> Opponent found the ring! Penalty of 50 pts transferred to opponent
      if (userTeam === 'moshe') {
        setKalashaScores(prev => ({ ...prev, priya: prev.priya + 1 }));
        setRoundOutcome(language === 'te'
          ? "ప్రియ చక్కగా వేరే కలశం నుండి ఉంగరాన్ని కనిపెట్టారు! (మోషే 50 పాయింట్లు కోల్పోయి ప్రియకు బదిలీ అయ్యాయి 🌹)"
          : "Priya gracefully fished out the ring from the other pot! (Moshe lost 50 pts ➔ Priya gained 50 pts 🌹)");
      } else {
        setKalashaScores(prev => ({ ...prev, moshe: prev.moshe + 1 }));
        setRoundOutcome(language === 'te'
          ? "మోషే దొర సునాయాసంగా ఉంగరాన్ని పట్టుకున్నారు! (ప్రియ 50 పాయింట్లు కోల్పోయి మోషేకు బదిలీ అయ్యాయి 👔)"
          : "Moshe Dora skillfully discovered the hidden ring! (Priya lost 50 pts ➔ Moshe gained 50 pts 👔)");
      }

      logMatchResult({
        gameName: 'Kalasha Ring Duel',
        outcome: 'lost',
        pointsWon: 0,
        pointsLost: 50,
        pointsTransferredToOpponent: 50,
        customDesc: `${playerProfile.name} supported Team ${teamName} but picked the empty pot; Team ${opponentName} claimed the sacred ring (+50 pts to ${opponentName}, -50 pts lost by ${teamName})!`,
        customTeluguDesc: `${playerProfile.name} టీమ్ ${teamNameTe} తరఫున ఆడుతూ ఖాళీ కలశాన్ని ఎంచుకున్నారు; టీమ్ ${opponentNameTe} ఉంగరాన్ని గెలుచుకుంది (+50 పాయింట్లు ${opponentNameTe}కు, -50 పాయింట్లు ${teamNameTe} కోల్పోయారు)!`
      });
    }
  };

  const handleNextRound = () => {
    if (roundNumber >= 3) {
      setIsMatchOver(true);
      const winningTeam = kalashaScores.moshe > kalashaScores.priya ? 'moshe' : 'priya';
      const winnerTitle = winningTeam === 'moshe' ? 'Moshe Dora 👔' : 'Nelluri Priya 💐';
      const winnerTitleTe = winningTeam === 'moshe' ? 'మోషే దొర 👔' : 'నెల్లూరి ప్రియ 💐';

      logMatchResult({
        gameName: 'Kalasha Championship (Best of 3)',
        outcome: winningTeam === userTeam ? 'won' : 'lost',
        pointsWon: winningTeam === userTeam ? 100 : 0,
        pointsLost: winningTeam !== userTeam ? 100 : 0,
        pointsTransferredToOpponent: winningTeam !== userTeam ? 100 : 0,
        customDesc: `${playerProfile.name} concluded 3 rounds of Kalasha Ring Duel. Team ${winnerTitle} emerged as the ultimate Champion (+100 Grand Bonus)!`,
        customTeluguDesc: `${playerProfile.name} కలశ ఉంగరాల పోరును పూర్తి చేశారు. టీమ్ ${winnerTitleTe} గ్రాండ్ చాంపియన్‌గా నిలిచింది (+100 బోనస్)!`
      });

      confetti({
        particleCount: 90,
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

  return (
    <section className="relative py-20 px-4 sm:px-6 bg-[#F4F8F5] border-b border-[#0F3D32]/20" id="game">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* Section Header */}
        <ScrollReveal direction="up" threshold={0.15}>
          <div className="text-center">
            <div className="inline-flex items-center gap-2 font-cinzel text-xs uppercase tracking-[0.3em] text-[#0F3D32] font-semibold mb-2 bg-white/80 px-4 py-1.5 rounded-full border border-[#D4AF37]/50 shadow-xs">
              <Trees className="w-3.5 h-3.5 text-[#2D7A62]" />
              {language === 'te' ? 'వివాహ వేడుకలు • వరుడు vs వధువు ఛాలెంజ్' : 'Eden Garden Celebrations • Groom vs Bride Arena'}
              <Trees className="w-3.5 h-3.5 text-[#2D7A62]" />
            </div>
            <h2 className="font-decorative text-3xl sm:text-4xl md:text-5xl text-[#0F3D32] font-bold">
              {language === 'te' ? 'వివాహ సరదా గేమ్స్ & లైవ్ అరీనా' : 'Eden Garden Wedding Games Arena'}
            </h2>
            <p className="font-cormorant text-lg sm:text-xl text-[#2A2A2A]/80 italic max-w-xl mx-auto mt-2">
              {language === 'te'
                ? 'ముందుగా మీ పేరు & ఫోన్ నంబర్‌తో నమోదు చేసుకోండి. అప్పుడు మాత్రమే అన్ని ఆటలు తెరవబడతాయి!'
                : 'Register with your Name and Phone Number to unlock all interactive wedding games and lead the live scoreboard!'}
            </p>
          </div>
        </ScrollReveal>

        {/* ========================================================
            CASE 1: REGISTRATION GATE (GAMES LOCKED UNTIL REGISTERED)
           ======================================================== */}
        {!isRegistered ? (
          <ScrollReveal direction="up" delay={50} threshold={0.15}>
            <div className="bg-white rounded-3xl border-2 border-[#D4AF37] p-6 sm:p-10 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/10 rounded-full blur-2xl pointer-events-none" />
              
              <div className="max-w-xl mx-auto space-y-6">
                <div className="text-center space-y-2">
                  <div className="w-14 h-14 rounded-2xl bg-[#0F3D32] text-[#F1DFA6] border-2 border-[#D4AF37] flex items-center justify-center mx-auto shadow-lg">
                    <Lock className="w-7 h-7" />
                  </div>
                  <h3 className="font-decorative text-2xl sm:text-3xl font-bold text-[#0F3D32]">
                    {language === 'te' ? 'ఆటలలో ప్రవేశించడానికి రిజిస్ట్రేషన్ చేసుకోండి' : 'Register to Unlock Wedding Games'}
                  </h3>
                  <p className="font-cormorant text-base sm:text-lg text-gray-600 italic">
                    {language === 'te'
                      ? 'దయచేసి మీ పేరు, ఫోన్ నంబర్ మరియు మీరు సపోర్ట్ చేయాలనుకుంటున్న టీమ్‌ను ఎంచుకోండి. అప్పుడు గేమ్స్ ఓపెన్ అవుతాయి!'
                      : 'Please enter your Name, Phone Number, and select your Team (Moshe Dora 👔 or Nelluri Priya 💐) to enter the Wedding Battle Arena.'}
                  </p>
                </div>

                {regError && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-cinzel font-bold text-center">
                    {regError}
                  </div>
                )}

                <form onSubmit={handleInitialRegistration} className="space-y-5">
                  {/* Name Input */}
                  <div>
                    <label className="block font-cinzel text-xs font-bold uppercase tracking-wider text-[#0F3D32] mb-1.5">
                      {language === 'te' ? 'మీ పూర్తి పేరు (Full Name) *' : 'Your Full Name *'}
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-[#D4AF37] absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        placeholder={language === 'te' ? 'ఉదా: తేజ / రవి / ప్రియాంక' : 'e.g. Teja / Ravi / Priyanka'}
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-[#F4F8F5] border border-gray-300 rounded-xl font-cormorant text-base text-gray-900 focus:outline-none focus:border-[#0F3D32] focus:ring-1 focus:ring-[#0F3D32]"
                      />
                    </div>
                  </div>

                  {/* Phone Input */}
                  <div>
                    <label className="block font-cinzel text-xs font-bold uppercase tracking-wider text-[#0F3D32] mb-1.5">
                      {language === 'te' ? 'ఫోన్ నంబర్ (ప్లేయర్ ఐడీగా ఉపయోగపడుతుంది) *' : 'Phone Number (Used as Player ID) *'}
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-[#D4AF37] absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        required
                        placeholder={language === 'te' ? 'ఉదా: 9876543210' : 'e.g. 9876543210'}
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-[#F4F8F5] border border-gray-300 rounded-xl font-cormorant text-base text-gray-900 focus:outline-none focus:border-[#0F3D32] focus:ring-1 focus:ring-[#0F3D32]"
                      />
                    </div>
                    <span className="text-[11px] font-cormorant text-gray-500 italic mt-1 block">
                      {language === 'te' ? 'మీ ఫోన్ నంబర్ ద్వారా మీరు ఆడిన ప్రతిసారీ మార్కులు లీడర్‌బోర్డ్‌లో కలుస్తాయి.' : 'Your points will accumulate under this phone ID across all 3 wedding games.'}
                    </span>
                  </div>

                  {/* Team Selection */}
                  <div>
                    <label className="block font-cinzel text-xs font-bold uppercase tracking-wider text-[#0F3D32] mb-2">
                      {language === 'te' ? 'మీరు ఎవరికి సపోర్ట్ చేస్తున్నారు? (Choose Team) *' : 'Which Team Are You Supporting? *'}
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setRegTeam('moshe')}
                        className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer text-left ${
                          regTeam === 'moshe'
                            ? 'border-[#0F3D32] bg-[#0F3D32]/10 ring-2 ring-[#0F3D32]/30 shadow-sm'
                            : 'border-gray-200 bg-white hover:border-[#0F3D32]/50'
                        }`}
                      >
                        <div className="text-2xl mb-1">👔</div>
                        <div className="font-cinzel text-xs sm:text-sm font-bold text-[#0F3D32]">
                          Team Moshe Dora
                        </div>
                        <div className="text-[11px] font-cormorant text-gray-500 italic">
                          {language === 'te' ? 'వరుడి బృందం' : 'Royal Groom'}
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setRegTeam('priya')}
                        className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer text-left ${
                          regTeam === 'priya'
                            ? 'border-[#5E1626] bg-[#5E1626]/10 ring-2 ring-[#5E1626]/30 shadow-sm'
                            : 'border-gray-200 bg-white hover:border-[#5E1626]/50'
                        }`}
                      >
                        <div className="text-2xl mb-1">💐</div>
                        <div className="font-cinzel text-xs sm:text-sm font-bold text-[#5E1626]">
                          Team Nelluri Priya
                        </div>
                        <div className="text-[11px] font-cormorant text-gray-500 italic">
                          {language === 'te' ? 'వధువు బృందం' : 'Radiant Bride'}
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full py-3.5 px-6 rounded-2xl bg-[#0F3D32] hover:bg-[#2D7A62] text-[#F1DFA6] font-cinzel text-sm font-bold uppercase tracking-wider transition-all shadow-lg hover:shadow-xl cursor-pointer flex items-center justify-center gap-2 border border-[#D4AF37]"
                  >
                    <span>{language === 'te' ? 'గేమ్స్ ఓపెన్ చేయండి & ప్రవేశించండి' : 'Unlock Wedding Games & Enter Battle'}</span>
                    <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
                  </button>
                </form>
              </div>
            </div>
          </ScrollReveal>
        ) : (
          /* ========================================================
              CASE 2: UNLOCKED ARENA (REGISTRATION COMPLETED)
             ======================================================== */
          <>
            {/* Active Player Status Badge */}
            <ScrollReveal direction="up" delay={40} threshold={0.15}>
              <div className="p-4 sm:p-5 rounded-2xl bg-white border-2 border-[#D4AF37]/70 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <div className="w-11 h-11 rounded-full bg-[#0F3D32]/10 border border-[#0F3D32]/30 flex items-center justify-center text-[#0F3D32] shrink-0">
                    <UserCheck className="w-6 h-6 text-[#0F3D32]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-cinzel text-xs text-gray-500 font-semibold uppercase">
                        {language === 'te' ? 'ప్లేయర్:' : 'Active Player:'}
                      </span>
                      <strong className="font-cinzel text-base text-[#0F3D32] font-bold">
                        {playerProfile.name}
                      </strong>
                      <span className="text-xs font-cinzel text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md">
                        {maskPhone(playerProfile.phone)}
                      </span>
                      <span className={`text-[10px] font-cinzel font-bold px-2 py-0.5 rounded-full uppercase flex items-center gap-1 ${
                        userTeam === 'priya' ? 'bg-[#5E1626]/10 text-[#5E1626]' : 'bg-[#0F3D32]/10 text-[#0F3D32]'
                      }`}>
                        <span>{userTeam === 'priya' ? '💐 Team Priya' : '👔 Team Moshe'}</span>
                      </span>
                    </div>
                    <div className="font-cormorant text-xs sm:text-sm text-gray-600 italic mt-0.5">
                      {language === 'te' ? 'మీ మొత్తం సంచిత స్కోర్:' : 'Your Total Cumulative Marks:'}{' '}
                      <strong className="text-[#0F3D32] font-cinzel font-bold">{playerCumulativeMarks.toLocaleString()} pts</strong>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setModalName(playerProfile.name);
                      setModalPhone(playerProfile.phone);
                      setModalError('');
                      setShowProfileModal(true);
                    }}
                    className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[#0F3D32] text-[#F1DFA6] hover:bg-[#2D7A62] font-cinzel text-xs font-bold uppercase tracking-wider transition-all shadow cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>{language === 'te' ? 'ఐడీ మార్చండి' : 'Switch / Edit Player'}</span>
                  </button>
                </div>
              </div>
            </ScrollReveal>

            {/* GRAND WEDDING BATTLE SCOREBOARD */}
            <ScrollReveal direction="up" delay={60} threshold={0.15}>
              <div className="p-5 sm:p-7 rounded-3xl bg-gradient-to-br from-[#FFFDF9] via-[#F2F7F4] to-[#FFFDF9] border-2 border-[#D4AF37] shadow-lg relative overflow-hidden">
                
                {/* Top Battle Header */}
                <div className="flex flex-wrap items-center justify-between border-b border-[#0F3D32]/20 pb-3 mb-4 gap-2">
                  <div className="flex items-center gap-2">
                    <Crown className="w-4 h-4 text-[#D4AF37]" />
                    <span className="font-cinzel text-xs sm:text-sm font-bold uppercase tracking-wider text-[#0F3D32]">
                      {language === 'te' ? 'వరుడు vs వధువు లైవ్ స్కోర్‌బోర్డ్' : 'Eden Garden Live Tug-Of-War Championship'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-cinzel text-[11px] text-gray-500 font-semibold">
                      {language === 'te' ? 'మొత్తం రౌండ్లు:' : 'Total Match Rounds:'} <strong className="text-[#0F3D32]">{teamScores.totalPlays}</strong>
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
                    <span className="text-gray-400 font-cormorant italic">
                      {language === 'te' ? 'మీరు గెలిస్తే మీ టీమ్‌కి పాయింట్లు, ఓడితే ప్రత్యర్థి టీమ్‌కి పాయింట్లు వెళ్తాయి!' : 'Win points for your team or lose them to your rival upon failure!'}
                    </span>
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

                {/* Live Flyout Notification */}
                {recentPointFlyout && (
                  <div className="mt-3.5 text-center animate-bounce">
                    <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full font-cinzel text-xs font-bold shadow-md border ${
                      recentPointFlyout.isLoss
                        ? 'bg-amber-800 text-white border-amber-400'
                        : 'bg-[#0F3D32] text-[#F1DFA6] border-[#D4AF37]'
                    }`}>
                      {recentPointFlyout.isLoss ? (
                        <ArrowRightLeft className="w-3.5 h-3.5 text-amber-300" />
                      ) : (
                        <Zap className="w-3.5 h-3.5 fill-current text-[#D4AF37]" />
                      )}
                      <span>{recentPointFlyout.msg}</span>
                    </span>
                  </div>
                )}
              </div>
            </ScrollReveal>

            {/* ========================================================
                3 PLAYABLE INTERACTIVE WEDDING GAMES
               ======================================================== */}
            
            {/* GAME 1: TALAMBRALU PEARL CATCH */}
            <ScrollReveal direction="up" threshold={0.15}>
              <div className="bg-white rounded-3xl border-2 border-[#D4AF37] p-5 sm:p-7 shadow-lg space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 pb-3 gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-[#0F3D32]/10 flex items-center justify-center text-lg">
                      ✨
                    </div>
                    <div>
                      <h4 className="font-decorative text-xl sm:text-2xl font-bold text-[#0F3D32]">
                        {language === 'te' ? 'ఆట 1: తలంబ్రాల ముత్యాల వేట' : 'Game 1: Talambralu Pearl Catch'}
                      </h4>
                      <span className="font-cormorant text-xs text-gray-500 italic">
                        {language === 'te' ? 'పవిత్ర ముత్యాలు, పువ్వులు మరియు ఉంగరాలను ఒడిసిపట్టండి. ఎండుమిర్చి తగిలితే పాయింట్లు పోతాయి!' : 'Catch roses, pearls & gold rings. Avoid fiery chillies or lose points to rival!'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-cinzel text-xs font-bold text-gray-500">
                      {language === 'te' ? 'హై స్కోర్:' : 'Best:'} <strong className="text-[#0F3D32]">{highScore} pts</strong>
                    </span>
                  </div>
                </div>

                {!gameActive ? (
                  <div className="py-8 px-4 text-center rounded-2xl bg-[#F4F8F5] border border-dashed border-[#0F3D32]/30 space-y-3">
                    <div className="text-4xl animate-bounce">🍚✨</div>
                    <h5 className="font-cinzel text-sm font-bold text-[#0F3D32] uppercase">
                      {language === 'te' ? 'తలంబ్రాల ఛాలెంజ్ ప్రారంభించండి' : 'Start 30-Second Talambralu Catch'}
                    </h5>
                    <p className="font-cormorant text-xs sm:text-sm text-gray-600 italic max-w-md mx-auto">
                      {language === 'te'
                        ? '30 సెకన్లలో మీరు సాధించిన ప్రతి పాయింట్ మీ టీమ్‌కు చేరుతుంది. ఎండుమిరపకాయలు పడితే ప్రత్యర్థికి పాయింట్లు వెళ్తాయి!'
                        : 'Move your golden plate left and right to catch blessings! Fiery chillies transfer points to the rival team!'}
                    </p>
                    <button
                      type="button"
                      onClick={startTalambraluGame}
                      className="px-6 py-2.5 rounded-xl bg-[#0F3D32] hover:bg-[#2D7A62] text-[#F1DFA6] font-cinzel text-xs font-bold uppercase tracking-wider transition-all shadow cursor-pointer inline-flex items-center gap-2"
                    >
                      <Play className="w-4 h-4 fill-current text-[#D4AF37]" />
                      <span>{language === 'te' ? 'ఆట ప్రారంభించండి' : 'Play Talambralu Catch'}</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {/* Active Game Top HUD */}
                    <div className="flex items-center justify-between p-3 rounded-xl bg-[#0F3D32] text-white font-cinzel text-xs font-bold">
                      <div>
                        {language === 'te' ? 'సమయం:' : 'Time:'} <span className="text-[#F1DFA6] text-sm">{gameTimeLeft}s</span>
                      </div>
                      <div>
                        {language === 'te' ? 'స్కోర్:' : 'Score:'} <span className="text-[#F1DFA6] text-sm">{blessingScore} pts</span>
                      </div>
                      <div>
                        {language === 'te' ? 'కాంబో:' : 'Combo:'} <span className="text-[#D4AF37]">{combo}x</span>
                      </div>
                    </div>

                    {/* Interactive Canvas Area */}
                    <div
                      ref={gameAreaRef}
                      onPointerMove={handlePointerMove}
                      className="relative h-64 sm:h-72 w-full bg-gradient-to-b from-amber-50/50 via-white to-emerald-50/40 rounded-2xl border-2 border-[#D4AF37]/50 overflow-hidden cursor-crosshair touch-none select-none"
                    >
                      {/* Falling Items */}
                      {fallingItems.map(item => (
                        <div
                          key={item.id}
                          className="absolute transform -translate-x-1/2 -translate-y-1/2 text-2xl transition-all duration-75 pointer-events-none"
                          style={{ left: `${item.x}%`, top: `${item.y}%` }}
                        >
                          {item.emoji}
                        </div>
                      ))}

                      {/* Golden Thali Paddle */}
                      <div
                        className="absolute bottom-2 transform -translate-x-1/2 flex flex-col items-center pointer-events-none transition-all duration-75"
                        style={{ left: `${thaliX}%` }}
                      >
                        <div className="w-24 sm:w-28 h-6 rounded-full bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 border-2 border-amber-600 shadow-lg flex items-center justify-center text-[10px] font-cinzel font-bold text-amber-950">
                          👑 Thali
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollReveal>

            {/* GAME 2: VARAMALA SACRED GARLAND TOSS */}
            <ScrollReveal direction="up" threshold={0.15}>
              <div className="bg-white rounded-3xl border-2 border-[#D4AF37] p-5 sm:p-7 shadow-lg space-y-4">
                <div className="flex items-center gap-2.5 border-b border-gray-100 pb-3">
                  <div className="w-9 h-9 rounded-xl bg-[#5E1626]/10 flex items-center justify-center text-lg">
                    🌸
                  </div>
                  <div>
                    <h4 className="font-decorative text-xl sm:text-2xl font-bold text-[#0F3D32]">
                      {language === 'te' ? 'ఆట 2: దివ్య వరమాల సమర్పణ' : 'Game 2: Sacred Varamala Garland Toss'}
                    </h4>
                    <span className="font-cormorant text-xs text-gray-500 italic">
                      {language === 'te' ? 'సరిగ్గా మధ్యలో (బుల్స్‌ఐ) మాలను వేయండి. గురి తప్పితే 30 పాయింట్లు ప్రత్యర్థికి బదిలీ అవుతాయి!' : 'Time your toss at the center target! Missed tosses transfer 30 points to rival team.'}
                    </span>
                  </div>
                </div>

                {!varamalaActive ? (
                  <div className="py-8 px-4 text-center rounded-2xl bg-[#F4F8F5] border border-dashed border-[#0F3D32]/30 space-y-3">
                    <div className="text-4xl animate-pulse">💐🎯</div>
                    <h5 className="font-cinzel text-sm font-bold text-[#0F3D32] uppercase">
                      {language === 'te' ? '5 వరమాలల ఛాలెంజ్' : '5-Garland Precision Toss'}
                    </h5>
                    <button
                      type="button"
                      onClick={handleStartVaramala}
                      className="px-6 py-2.5 rounded-xl bg-[#0F3D32] hover:bg-[#2D7A62] text-[#F1DFA6] font-cinzel text-xs font-bold uppercase tracking-wider transition-all shadow cursor-pointer inline-flex items-center gap-2"
                    >
                      <Play className="w-4 h-4 fill-current text-[#D4AF37]" />
                      <span>{language === 'te' ? 'వరమాల ఆట ఆడండి' : 'Play Varamala Toss'}</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4 p-4 rounded-2xl bg-[#F4F8F5] border border-gray-200">
                    <div className="flex items-center justify-between text-xs font-cinzel font-bold text-[#0F3D32]">
                      <span>{language === 'te' ? 'మిగిలిన మాలలు:' : 'Tosses Left:'} <strong className="text-base text-[#D4AF37]">{varamalaTossesLeft}</strong>/5</span>
                      <span>{language === 'te' ? 'ఈ ఆట స్కోర్:' : 'Round Total:'} <strong className="text-base">{varamalaTotalScore} pts</strong></span>
                    </div>

                    {/* Oscillating Bar & Target */}
                    <div className="relative h-12 bg-gray-200 rounded-2xl overflow-hidden border border-gray-300 flex items-center justify-center">
                      {/* Bullseye Zone */}
                      <div className="absolute w-12 h-full bg-gradient-to-r from-amber-300 to-yellow-400 opacity-80 border-x-2 border-amber-600 flex items-center justify-center font-cinzel text-[10px] font-bold text-amber-950">
                        🎯 Bullseye
                      </div>

                      {/* Moving Garland Indicator */}
                      <div
                        className="absolute transform -translate-x-1/2 text-2xl transition-all duration-75 pointer-events-none"
                        style={{ left: `${varamalaOscillator}%` }}
                      >
                        🌸
                      </div>
                    </div>

                    {/* Result Callout */}
                    {varamalaResult && (
                      <div className={`p-3 rounded-xl text-center font-cinzel text-xs font-bold ${
                        varamalaResult.isMiss ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                      }`}>
                        <div>{varamalaResult.quality} {varamalaResult.pts > 0 ? `(+${varamalaResult.pts} pts)` : ''}</div>
                        <div className="font-cormorant text-xs font-normal mt-0.5">{varamalaResult.msg}</div>
                      </div>
                    )}

                    {/* Action Button */}
                    {!isVaramalaComplete ? (
                      <button
                        type="button"
                        onClick={handleTossGarland}
                        className="w-full py-3 rounded-xl bg-[#0F3D32] hover:bg-[#2D7A62] text-[#F1DFA6] font-cinzel text-xs font-bold uppercase tracking-wider transition-all shadow cursor-pointer flex items-center justify-center gap-2"
                      >
                        <Target className="w-4 h-4 text-[#D4AF37]" />
                        <span>{language === 'te' ? 'మాల విసరండి! (Toss Garland)' : 'Toss Sacred Garland Now!'}</span>
                      </button>
                    ) : (
                      <div className="text-center space-y-2 pt-2">
                        <div className="font-cinzel text-sm font-bold text-[#0F3D32]">
                          🎉 {language === 'te' ? 'వరమాల రౌండ్ పూర్తయింది!' : 'Varamala Round Finished!'}
                        </div>
                        <button
                          type="button"
                          onClick={handleStartVaramala}
                          className="px-5 py-2 rounded-xl bg-[#0F3D32] text-[#F1DFA6] font-cinzel text-xs font-bold uppercase cursor-pointer"
                        >
                          {language === 'te' ? 'మళ్లీ ఆడండి' : 'Play Again'}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </ScrollReveal>

            {/* GAME 3: KALASHA RING QUEST DUEL */}
            <ScrollReveal direction="up" threshold={0.15}>
              <div className="bg-white rounded-3xl border-2 border-[#D4AF37] p-5 sm:p-7 shadow-lg space-y-4">
                <div className="flex items-center gap-2.5 border-b border-gray-100 pb-3">
                  <div className="w-9 h-9 rounded-xl bg-[#D4AF37]/20 flex items-center justify-center text-lg">
                    💍
                  </div>
                  <div>
                    <h4 className="font-decorative text-xl sm:text-2xl font-bold text-[#0F3D32]">
                      {language === 'te' ? 'ఆట 3: కలశ ఉంగరాల అన్వేషణ (Best of 3)' : 'Game 3: Sacred Kalasha Ring Duel'}
                    </h4>
                    <span className="font-cormorant text-xs text-gray-500 italic">
                      {language === 'te' ? '3 కలశాలలో ఒకదాంట్లో దాచిన ఉంగరాన్ని కనిపెట్టండి. తప్పు కుండను ఎంచుకుంటే ప్రత్యర్థికి 50 పాయింట్లు బదిలీ అవుతాయి!' : 'Find the ring hidden in 3 holy pots. Wrong pick transfers 50 points directly to rival!'}
                    </span>
                  </div>
                </div>

                <div className="p-4 sm:p-6 rounded-2xl bg-[#F4F8F5] border border-gray-200 space-y-5">
                  <div className="flex items-center justify-between text-xs font-cinzel font-bold text-[#0F3D32]">
                    <span>{language === 'te' ? 'రౌండ్:' : 'Round:'} {roundNumber}/3</span>
                    <span>Moshe: {kalashaScores.moshe} &bull; Priya: {kalashaScores.priya}</span>
                  </div>

                  {/* 3 Kalasha Pots */}
                  <div className="grid grid-cols-3 gap-3 sm:gap-6">
                    {[0, 1, 2].map((idx) => {
                      const isSelected = selectedKalasha === idx;
                      const hasRing = idx === kalashaTarget;

                      return (
                        <button
                          key={idx}
                          type="button"
                          disabled={selectedKalasha !== null || isMatchOver}
                          onClick={() => handlePickKalasha(idx)}
                          className={`p-4 sm:p-6 rounded-2xl border-2 transition-all cursor-pointer flex flex-col items-center justify-center gap-2 ${
                            selectedKalasha === null
                              ? 'bg-white border-amber-300 hover:border-[#0F3D32] hover:scale-105 shadow-sm'
                              : isSelected && hasRing
                              ? 'bg-emerald-100 border-emerald-500 shadow-md scale-105 ring-2 ring-emerald-300'
                              : isSelected && !hasRing
                              ? 'bg-amber-100 border-amber-500 shadow-md scale-105'
                              : hasRing
                              ? 'bg-emerald-50 border-emerald-300'
                              : 'bg-gray-100 border-gray-200 opacity-60'
                          }`}
                        >
                          <div className="text-4xl sm:text-5xl">
                            {selectedKalasha !== null && hasRing ? '💍' : '🏺'}
                          </div>
                          <span className="font-cinzel text-xs font-bold text-[#0F3D32]">
                            {language === 'te' ? `కలశం ${idx + 1}` : `Kalasha ${idx + 1}`}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Outcome Message */}
                  {roundOutcome && (
                    <div className="p-3.5 rounded-xl bg-white border border-gray-200 text-center font-cinzel text-xs font-bold text-[#0F3D32] shadow-xs">
                      {roundOutcome}
                    </div>
                  )}

                  {/* Next / Reset Controls */}
                  {selectedKalasha !== null && (
                    <div className="text-center pt-2">
                      {!isMatchOver ? (
                        <button
                          type="button"
                          onClick={handleNextRound}
                          className="px-6 py-2.5 rounded-xl bg-[#0F3D32] hover:bg-[#2D7A62] text-[#F1DFA6] font-cinzel text-xs font-bold uppercase tracking-wider transition-all shadow cursor-pointer inline-flex items-center gap-2"
                        >
                          <span>{language === 'te' ? 'తదుపరి రౌండ్' : 'Next Round'}</span>
                          <ArrowRight className="w-3.5 h-3.5 text-[#D4AF37]" />
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={handleResetKalashaGame}
                          className="px-6 py-2.5 rounded-xl bg-[#0F3D32] hover:bg-[#2D7A62] text-[#F1DFA6] font-cinzel text-xs font-bold uppercase tracking-wider transition-all shadow cursor-pointer inline-flex items-center gap-2"
                        >
                          <RotateCw className="w-3.5 h-3.5" />
                          <span>{language === 'te' ? 'మళ్లీ కలశం ఆట ఆడండి' : 'Play Kalasha Match Again'}</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </ScrollReveal>

            {/* ========================================================
                LEADERBOARD & MATCH HISTORY TIMELINE TABS
               ======================================================== */}
            <WeddingLeaderboard
              currentPlayerPhone={playerProfile.phone}
              currentPlayerName={playerProfile.name}
            />
          </>
        )}

        {/* ========================================================
            PROFILE EDIT MODAL (FOR SWITCHING IDENTITIES)
           ======================================================== */}
        {showProfileModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border-2 border-[#D4AF37] shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-[#0F3D32]" />
                  <h4 className="font-decorative text-2xl font-bold text-[#0F3D32]">
                    {language === 'te' ? 'ప్లేయర్ ఐడీ వివరాలు' : 'Switch / Edit Player ID'}
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={() => setShowProfileModal(false)}
                  className="p-1 rounded-full text-gray-400 hover:text-black cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {modalError && (
                <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-cinzel text-center">
                  {modalError}
                </div>
              )}

              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div>
                  <label className="block font-cinzel text-xs font-bold uppercase text-gray-700 mb-1">
                    {language === 'te' ? 'మీ పేరు (Player Name)' : 'Player Name'}
                  </label>
                  <input
                    type="text"
                    required
                    value={modalName}
                    onChange={(e) => setModalName(e.target.value)}
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-300 rounded-xl font-cormorant text-base text-gray-900 focus:outline-none focus:border-[#0F3D32]"
                  />
                </div>

                <div>
                  <label className="block font-cinzel text-xs font-bold uppercase text-gray-700 mb-1">
                    {language === 'te' ? 'ఫోన్ నంబర్ (Phone Number)' : 'Phone Number'}
                  </label>
                  <input
                    type="tel"
                    required
                    value={modalPhone}
                    onChange={(e) => setModalPhone(e.target.value)}
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-300 rounded-xl font-cormorant text-base text-gray-900 focus:outline-none focus:border-[#0F3D32]"
                  />
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowProfileModal(false)}
                    className="flex-1 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-cinzel text-xs font-bold hover:bg-gray-100 cursor-pointer"
                  >
                    {language === 'te' ? 'రద్దు' : 'Cancel'}
                  </button>

                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-[#0F3D32] hover:bg-[#2D7A62] text-[#F1DFA6] font-cinzel text-xs font-bold uppercase tracking-wider shadow cursor-pointer"
                  >
                    {language === 'te' ? 'భద్రపరచు' : 'Save ID'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
