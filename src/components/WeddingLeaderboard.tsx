import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  Crown, 
  Medal, 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  User, 
  Phone, 
  Sparkles, 
  Flame, 
  TrendingUp, 
  ShieldCheck, 
  RotateCw,
  History,
  Clock,
  ArrowRightLeft,
  Filter
} from 'lucide-react';
import { collection, query, orderBy, onSnapshot, limit } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { LeaderboardPlayer, MatchLog } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { ScrollReveal } from './ScrollReveal';

interface WeddingLeaderboardProps {
  currentPlayerPhone?: string;
  currentPlayerName?: string;
}

export const WeddingLeaderboard: React.FC<WeddingLeaderboardProps> = ({
  currentPlayerPhone,
  currentPlayerName
}) => {
  const { language } = useLanguage();
  
  // Tabs: 'leaderboard' | 'history'
  const [activeTab, setActiveTab] = useState<'leaderboard' | 'history'>('leaderboard');
  
  // Leaderboard state
  const [players, setPlayers] = useState<LeaderboardPlayer[]>([]);
  const [filterTeam, setFilterTeam] = useState<'all' | 'moshe' | 'priya'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingLeaderboard, setIsLoadingLeaderboard] = useState(true);
  const PAGE_SIZE = 5;

  // History state
  const [matchHistory, setMatchHistory] = useState<MatchLog[]>([]);
  const [historyFilter, setHistoryFilter] = useState<'all' | 'my' | 'transfers' | 'moshe' | 'priya'>('all');
  const [historySearch, setHistorySearch] = useState('');
  const [historyPage, setHistoryPage] = useState(1);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const HISTORY_PAGE_SIZE = 6;

  // ============================================================
  // 1. REAL-TIME FIRESTORE & SERVER SYNC FOR LEADERBOARD
  // ============================================================
  useEffect(() => {
    const leaderboardCol = collection(db, 'game_leaderboard');
    const q = query(leaderboardCol, orderBy('score', 'desc'), limit(100));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          const list: LeaderboardPlayer[] = snapshot.docs.map((docSnap) => {
            const data = docSnap.data();
            return {
              id: docSnap.id,
              name: data.name || 'Guest Champion',
              phone: data.phone || '',
              score: Number(data.score) || 0,
              team: data.team === 'priya' ? 'priya' : 'moshe',
              gamesPlayed: Number(data.gamesPlayed) || 1,
              lastPlayed: data.lastPlayed || new Date().toISOString()
            };
          });
          list.sort((a, b) => b.score - a.score);
          setPlayers(list);
          setIsLoadingLeaderboard(false);
        } else {
          fetchLeaderboardFromServer();
        }
      },
      (err) => {
        console.warn('Firestore leaderboard listener fallback:', err);
        fetchLeaderboardFromServer();
      }
    );

    return () => unsubscribe();
  }, []);

  const fetchLeaderboardFromServer = async () => {
    try {
      const res = await fetch('/api/leaderboard');
      const data = await res.json();
      if (Array.isArray(data)) {
        setPlayers(data);
      }
    } catch (e) {
      console.warn('Failed to fetch leaderboard from server:', e);
    } finally {
      setIsLoadingLeaderboard(false);
    }
  };

  // ============================================================
  // 2. REAL-TIME FIRESTORE & SERVER SYNC FOR MATCH HISTORY
  // ============================================================
  useEffect(() => {
    const historyCol = collection(db, 'game_history');
    const q = query(historyCol, orderBy('timestamp', 'desc'), limit(150));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          const list: MatchLog[] = snapshot.docs.map((docSnap) => {
            const data = docSnap.data();
            return {
              id: docSnap.id,
              playerName: data.playerName || 'Guest Player',
              playerPhone: data.playerPhone || '',
              team: data.team === 'priya' ? 'priya' : 'moshe',
              opponentTeam: data.opponentTeam === 'moshe' ? 'moshe' : 'priya',
              gameName: data.gameName || 'Wedding Arena Challenge',
              outcome: data.outcome || 'won',
              pointsWon: Number(data.pointsWon) || 0,
              pointsLost: Number(data.pointsLost) || 0,
              pointsTransferredToOpponent: Number(data.pointsTransferredToOpponent) || 0,
              description: data.description || '',
              teluguDescription: data.teluguDescription || '',
              timestamp: data.timestamp || new Date().toISOString(),
              formattedTime: data.formattedTime || new Date(data.timestamp || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
              formattedDate: data.formattedDate || new Date(data.timestamp || Date.now()).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })
            };
          });
          setMatchHistory(list);
          setIsLoadingHistory(false);
        } else {
          fetchHistoryFromServer();
        }
      },
      (err) => {
        console.warn('Firestore history listener fallback:', err);
        fetchHistoryFromServer();
      }
    );

    return () => unsubscribe();
  }, []);

  const fetchHistoryFromServer = async () => {
    try {
      const res = await fetch('/api/match-history');
      const data = await res.json();
      if (Array.isArray(data)) {
        setMatchHistory(data);
      }
    } catch (e) {
      console.warn('Failed to fetch match history from server:', e);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  // Helper to format relative time
  const getRelativeTime = (timestampStr: string) => {
    try {
      const diffMs = Date.now() - new Date(timestampStr).getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);

      if (diffMins < 1) return language === 'te' ? 'ఇప్పుడే' : 'Just now';
      if (diffMins < 60) return language === 'te' ? `${diffMins} నిమిషాల క్రితం` : `${diffMins}m ago`;
      if (diffHours < 24) return language === 'te' ? `${diffHours} గంటల క్రితం` : `${diffHours}h ago`;
      return new Date(timestampStr).toLocaleDateString();
    } catch {
      return '';
    }
  };

  // Leaderboard Filtering & Pagination
  const filteredPlayers = players.filter((p) => {
    if (filterTeam !== 'all' && p.team !== filterTeam) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = p.name.toLowerCase().includes(q);
      const matchPhone = p.phone.includes(q);
      return matchName || matchPhone;
    }
    return true;
  });

  const totalPlayersCount = filteredPlayers.length;
  const totalPages = Math.max(1, Math.ceil(totalPlayersCount / PAGE_SIZE));
  const validCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (validCurrentPage - 1) * PAGE_SIZE;
  const currentPlayers = filteredPlayers.slice(startIndex, startIndex + PAGE_SIZE);

  // Match History Filtering & Pagination
  const cleanCurrentPhone = (currentPlayerPhone || '').replace(/[^\d+]/g, '');
  const filteredHistory = matchHistory.filter((item) => {
    if (historyFilter === 'my') {
      if (!cleanCurrentPhone) return false;
      const cleanItemPhone = (item.playerPhone || '').replace(/[^\d+]/g, '');
      if (!cleanItemPhone || !cleanCurrentPhone.includes(cleanItemPhone.slice(-8))) return false;
    } else if (historyFilter === 'transfers') {
      if ((item.pointsLost || 0) <= 0 && (item.pointsTransferredToOpponent || 0) <= 0) return false;
    } else if (historyFilter === 'moshe') {
      if (item.team !== 'moshe') return false;
    } else if (historyFilter === 'priya') {
      if (item.team !== 'priya') return false;
    }

    if (historySearch.trim()) {
      const q = historySearch.toLowerCase().trim();
      const matchPlayer = item.playerName.toLowerCase().includes(q);
      const matchDesc = item.description.toLowerCase().includes(q) || (item.teluguDescription || '').toLowerCase().includes(q);
      const matchGame = item.gameName.toLowerCase().includes(q);
      return matchPlayer || matchDesc || matchGame;
    }
    return true;
  });

  const totalHistoryCount = filteredHistory.length;
  const totalHistoryPages = Math.max(1, Math.ceil(totalHistoryCount / HISTORY_PAGE_SIZE));
  const validHistoryPage = Math.min(historyPage, totalHistoryPages);
  const startHistoryIndex = (validHistoryPage - 1) * HISTORY_PAGE_SIZE;
  const currentHistoryLogs = filteredHistory.slice(startHistoryIndex, startHistoryIndex + HISTORY_PAGE_SIZE);

  const maskPhone = (phone: string) => {
    if (!phone) return '';
    const clean = phone.replace(/[^\d+]/g, '');
    if (clean.length <= 4) return clean;
    if (clean.length <= 7) return clean.slice(0, 2) + '••••' + clean.slice(-2);
    return clean.slice(0, 4) + '••••' + clean.slice(-2);
  };

  const renderRankBadge = (rank: number) => {
    if (rank === 1) {
      return (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-300 via-yellow-400 to-amber-600 text-black flex items-center justify-center font-cinzel font-extrabold text-sm shadow-md border-2 border-white animate-pulse">
          <Crown className="w-4 h-4 fill-amber-900 text-amber-900" />
        </div>
      );
    }
    if (rank === 2) {
      return (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-200 via-gray-300 to-slate-400 text-slate-800 flex items-center justify-center font-cinzel font-extrabold text-xs shadow-sm border border-white">
          <Medal className="w-4 h-4 text-slate-700" />
        </div>
      );
    }
    if (rank === 3) {
      return (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-600 via-amber-700 to-amber-800 text-white flex items-center justify-center font-cinzel font-extrabold text-xs shadow-sm border border-white">
          <Medal className="w-4 h-4 text-amber-200" />
        </div>
      );
    }
    return (
      <div className="w-8 h-8 rounded-full bg-gray-100 border border-gray-300 text-gray-700 flex items-center justify-center font-cinzel font-bold text-xs">
        #{rank}
      </div>
    );
  };

  return (
    <div id="leaderboard" className="scroll-mt-24">
      <ScrollReveal direction="up" threshold={0.1}>
        <div className="bg-[#FFFDF9] rounded-3xl border-2 border-[#D4AF37] p-5 sm:p-8 shadow-xl relative overflow-hidden">

          {/* Section Header */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between border-b border-[#0F3D32]/20 pb-5 mb-6 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 bg-[#0F3D32] text-[#F1DFA6] font-cinzel text-[10px] sm:text-xs font-bold uppercase tracking-wider px-3 py-0.5 rounded-full mb-1.5">
                <Trophy className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>{language === 'te' ? 'వివాహ గేమ్స్ లైవ్ అరీనా' : 'Wedding Arena Live Scores & Timeline'}</span>
              </div>
              <h3 className="font-decorative text-2xl sm:text-3xl font-bold text-[#0F3D32]">
                {language === 'te' ? 'గెస్ట్ లీడర్‌బోర్డ్ & మ్యాచ్ హిస్టరీ' : 'Guest Leaderboard & Match History'}
              </h3>
              <p className="font-cormorant text-sm sm:text-base text-[#2A2A2A]/80 italic">
                {language === 'te'
                  ? 'మీ మార్కులు, పాయింట్ల బదిలీలు మరియు సమయాలతో కూడిన ప్రత్యక్ష వివరాలు ఇక్కడ చూడవచ్చు.'
                  : 'Track real-time player rankings, point transfers, failed attempts, and exact timestamps across all rounds!'}
              </p>
            </div>

            {/* Action Buttons: Refresh */}
            <div className="flex items-center gap-2 self-start lg:self-auto flex-wrap">
              <button
                type="button"
                onClick={() => {
                  fetchLeaderboardFromServer();
                  fetchHistoryFromServer();
                }}
                className="px-3.5 py-2 rounded-xl bg-[#0F3D32]/10 hover:bg-[#0F3D32]/20 text-[#0F3D32] transition-colors cursor-pointer text-xs font-cinzel font-bold flex items-center gap-1.5"
                title="Refresh scores & history"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>{language === 'te' ? 'రిఫ్రెష్' : 'Refresh'}</span>
              </button>
            </div>
          </div>

          {/* MAIN TABS NAVIGATION (LEADERBOARD vs MATCH HISTORY) */}
          <div className="flex items-center gap-2 p-1.5 bg-gray-100 rounded-2xl border border-gray-200 mb-6">
            <button
              type="button"
              onClick={() => setActiveTab('leaderboard')}
              className={`flex-1 py-2.5 px-4 rounded-xl font-cinzel text-xs sm:text-sm font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'leaderboard'
                  ? 'bg-[#0F3D32] text-[#F1DFA6] shadow-md'
                  : 'text-gray-600 hover:text-black hover:bg-white/50'
              }`}
            >
              <Trophy className={`w-4 h-4 ${activeTab === 'leaderboard' ? 'text-[#D4AF37]' : 'text-gray-500'}`} />
              <span>{language === 'te' ? '🏆 గెస్ట్ లీడర్‌బోర్డ్' : '🏆 Guest Leaderboard'} ({players.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('history')}
              className={`flex-1 py-2.5 px-4 rounded-xl font-cinzel text-xs sm:text-sm font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'history'
                  ? 'bg-[#0F3D32] text-[#F1DFA6] shadow-md'
                  : 'text-gray-600 hover:text-black hover:bg-white/50'
              }`}
            >
              <History className={`w-4 h-4 ${activeTab === 'history' ? 'text-[#D4AF37]' : 'text-gray-500'}`} />
              <span>{language === 'te' ? '📜 మ్యాచ్ హిస్టరీ & సమయాలు' : '📜 Match History & Timings'} ({matchHistory.length})</span>
            </button>
          </div>

          {/* ========================================================
              TAB 1: LEADERBOARD VIEW
             ======================================================== */}
          {activeTab === 'leaderboard' && (
            <div>
              {/* Filter Tabs & Search Bar */}
              <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 mb-6">
                {/* Team Filter Pills */}
                <div className="inline-flex p-1 rounded-2xl bg-gray-100/80 border border-gray-200 overflow-x-auto gap-1">
                  <button
                    type="button"
                    onClick={() => { setFilterTeam('all'); setCurrentPage(1); }}
                    className={`px-3.5 py-1.5 rounded-xl font-cinzel text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                      filterTeam === 'all'
                        ? 'bg-[#0F3D32] text-[#F1DFA6] shadow-sm'
                        : 'text-gray-600 hover:text-black hover:bg-white/60'
                    }`}
                  >
                    🏆 {language === 'te' ? 'అందరూ' : 'All Players'} ({players.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => { setFilterTeam('moshe'); setCurrentPage(1); }}
                    className={`px-3.5 py-1.5 rounded-xl font-cinzel text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                      filterTeam === 'moshe'
                        ? 'bg-[#0F3D32] text-[#F1DFA6] shadow-sm'
                        : 'text-gray-600 hover:text-[#0F3D32] hover:bg-white/60'
                    }`}
                  >
                    👔 {language === 'te' ? 'టీమ్ మోషే' : 'Team Moshe'} ({players.filter(p => p.team === 'moshe').length})
                  </button>
                  <button
                    type="button"
                    onClick={() => { setFilterTeam('priya'); setCurrentPage(1); }}
                    className={`px-3.5 py-1.5 rounded-xl font-cinzel text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                      filterTeam === 'priya'
                        ? 'bg-[#5E1626] text-white shadow-sm'
                        : 'text-gray-600 hover:text-[#5E1626] hover:bg-white/60'
                    }`}
                  >
                    💐 {language === 'te' ? 'టీమ్ ప్రియ' : 'Team Priya'} ({players.filter(p => p.team === 'priya').length})
                  </button>
                </div>

                {/* Search Input */}
                <div className="relative flex-1 max-w-xs">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder={language === 'te' ? "పేరు లేదా నంబర్ ద్వారా శోధించండి..." : "Search name or phone..."}
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                    className="w-full pl-9 pr-3 py-1.5 bg-white border border-gray-300 rounded-xl text-xs font-cormorant focus:outline-none focus:border-[#0F3D32]"
                  />
                </div>
              </div>

              {/* Leaderboard Table / Cards */}
              {isLoadingLeaderboard ? (
                <div className="py-12 text-center text-gray-500 font-cinzel text-xs">
                  <div className="inline-block animate-spin text-2xl mb-2">⏳</div>
                  <div>{language === 'te' ? 'స్కోర్‌లు లోడ్ అవుతున్నాయి...' : 'Loading live leaderboard...'}</div>
                </div>
              ) : filteredPlayers.length === 0 ? (
                <div className="py-12 px-4 text-center rounded-2xl bg-gray-50 border border-dashed border-gray-300">
                  <div className="text-3xl mb-2">🎮</div>
                  <h4 className="font-cinzel text-sm font-bold text-[#0F3D32] uppercase">
                    {language === 'te' ? 'ఇంకా ఎటువంటి స్కోర్‌లు నమోదు కాలేదు' : 'No Champions Yet'}
                  </h4>
                  <p className="font-cormorant text-xs text-gray-600 italic mt-1 max-w-sm mx-auto">
                    {language === 'te'
                      ? 'మీ పేరు మరియు ఫోన్ నంబర్‌తో ఆట ఆడండి. మీరే మొదటి చాంపియన్‌గా నిలవండి!'
                      : 'Register and play any of the wedding games above to put your marks at the top of the leaderboard!'}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {currentPlayers.map((player, idx) => {
                    const globalRank = startIndex + idx + 1;
                    const isCurrent = currentPlayerPhone && player.phone.includes(currentPlayerPhone.slice(-8));

                    return (
                      <div
                        key={player.id || `${player.phone}-${idx}`}
                        className={`p-3.5 sm:p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                          isCurrent
                            ? 'bg-amber-50/80 border-[#D4AF37] ring-2 ring-[#D4AF37]/40 shadow-md'
                            : globalRank === 1
                            ? 'bg-gradient-to-r from-amber-50 via-yellow-50/60 to-white border-amber-300 shadow-sm'
                            : 'bg-white border-gray-200 hover:border-[#0F3D32]/40 hover:shadow-xs'
                        }`}
                      >
                        {/* Rank & Player Info */}
                        <div className="flex items-center gap-3">
                          {renderRankBadge(globalRank)}

                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-cinzel text-sm sm:text-base font-bold text-[#0F3D32]">
                                {player.name}
                              </span>

                              {isCurrent && (
                                <span className="text-[10px] font-cinzel font-bold text-amber-800 bg-amber-200/80 px-2 py-0.5 rounded-full uppercase">
                                  {language === 'te' ? 'మీరు' : 'You'}
                                </span>
                              )}

                              <span className={`text-[10px] font-cinzel font-bold px-2.5 py-0.5 rounded-full uppercase flex items-center gap-1 ${
                                player.team === 'priya'
                                  ? 'bg-[#5E1626]/10 text-[#5E1626] border border-[#5E1626]/30'
                                  : 'bg-[#0F3D32]/10 text-[#0F3D32] border border-[#0F3D32]/30'
                              }`}>
                                <span>{player.team === 'priya' ? '💐' : '👔'}</span>
                                <span>{player.team === 'priya' ? (language === 'te' ? 'టీమ్ ప్రియ' : 'Team Priya') : (language === 'te' ? 'టీమ్ మోషే' : 'Team Moshe')}</span>
                              </span>
                            </div>

                            <div className="flex items-center gap-3 text-xs text-gray-500 font-cinzel mt-0.5">
                              <span className="flex items-center gap-1">
                                <Phone className="w-3 h-3 text-gray-400" />
                                <span>{maskPhone(player.phone)}</span>
                              </span>
                              <span>&bull;</span>
                              <span>{player.gamesPlayed} {language === 'te' ? 'ఆటలు' : 'rounds'}</span>
                            </div>
                          </div>
                        </div>

                        {/* Total Score Display */}
                        <div className="flex items-center justify-between sm:justify-end gap-3 self-end sm:self-auto w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                          <div className="text-right">
                            <div className="font-cinzel text-xl sm:text-2xl font-extrabold text-[#0F3D32] flex items-center gap-1 justify-end">
                              <Flame className="w-4 h-4 text-[#D4AF37] fill-current" />
                              <span>{player.score.toLocaleString()}</span>
                              <span className="text-xs font-normal text-gray-500">{language === 'te' ? 'మార్కులు' : 'pts'}</span>
                            </div>
                            <div className="text-[10px] font-cormorant text-gray-400 italic">
                              {language === 'te' ? 'మొత్తం సంచిత స్కోర్' : 'Cumulative Total Score'}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Pagination Controls (5 per page) */}
              {totalPages > 1 && (
                <div className="mt-6 pt-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3 font-cinzel text-xs">
                  <div className="text-gray-500">
                    {language === 'te' ? (
                      <>
                        మొత్తం <strong>{totalPlayersCount}</strong> లో <strong>{startIndex + 1}</strong> - <strong>{Math.min(startIndex + PAGE_SIZE, totalPlayersCount)}</strong> చూపిస్తోంది
                      </>
                    ) : (
                      <>
                        Showing <strong>{startIndex + 1}</strong> to <strong>{Math.min(startIndex + PAGE_SIZE, totalPlayersCount)}</strong> of <strong>{totalPlayersCount}</strong> champions (5 per page)
                      </>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      disabled={validCurrentPage <= 1}
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      className="px-3 py-1.5 rounded-xl border border-gray-300 bg-white text-[#0F3D32] hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1 font-bold"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                      <span>{language === 'te' ? 'వెనుకకు' : 'Previous'}</span>
                    </button>

                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          type="button"
                          onClick={() => setCurrentPage(page)}
                          className={`w-7 h-7 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            validCurrentPage === page
                              ? 'bg-[#0F3D32] text-[#F1DFA6] shadow-sm'
                              : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                    </div>

                    <button
                      type="button"
                      disabled={validCurrentPage >= totalPages}
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      className="px-3 py-1.5 rounded-xl border border-gray-300 bg-white text-[#0F3D32] hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1 font-bold"
                    >
                      <span>{language === 'te' ? 'తదుపరి' : 'Next'}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========================================================
              TAB 2: MATCH HISTORY & TIMINGS VIEW
             ======================================================== */}
          {activeTab === 'history' && (
            <div>
              {/* Filter Pills & Search for History */}
              <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 mb-6">
                {/* Filter Pills */}
                <div className="inline-flex p-1 rounded-2xl bg-gray-100/80 border border-gray-200 overflow-x-auto gap-1">
                  <button
                    type="button"
                    onClick={() => { setHistoryFilter('all'); setHistoryPage(1); }}
                    className={`px-3 py-1.5 rounded-xl font-cinzel text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                      historyFilter === 'all'
                        ? 'bg-[#0F3D32] text-[#F1DFA6] shadow-sm'
                        : 'text-gray-600 hover:text-black hover:bg-white/60'
                    }`}
                  >
                    📜 {language === 'te' ? 'అన్ని మ్యాచ్‌లు' : 'All Matches'} ({matchHistory.length})
                  </button>

                  <button
                    type="button"
                    onClick={() => { setHistoryFilter('transfers'); setHistoryPage(1); }}
                    className={`px-3 py-1.5 rounded-xl font-cinzel text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                      historyFilter === 'transfers'
                        ? 'bg-amber-700 text-white shadow-sm'
                        : 'text-gray-600 hover:text-amber-800 hover:bg-white/60'
                    }`}
                  >
                    <ArrowRightLeft className="w-3 h-3 inline mr-1" />
                    {language === 'te' ? 'పాయింట్ల బదిలీలు / ఓటములు' : 'Transfers & Lost Pts'}
                  </button>

                  {currentPlayerPhone && (
                    <button
                      type="button"
                      onClick={() => { setHistoryFilter('my'); setHistoryPage(1); }}
                      className={`px-3 py-1.5 rounded-xl font-cinzel text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                        historyFilter === 'my'
                          ? 'bg-[#0F3D32] text-[#F1DFA6] shadow-sm'
                          : 'text-gray-600 hover:text-[#0F3D32] hover:bg-white/60'
                      }`}
                    >
                      👤 {language === 'te' ? 'నా మ్యాచ్‌లు' : 'My Plays'}
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => { setHistoryFilter('moshe'); setHistoryPage(1); }}
                    className={`px-3 py-1.5 rounded-xl font-cinzel text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                      historyFilter === 'moshe'
                        ? 'bg-[#0F3D32] text-[#F1DFA6] shadow-sm'
                        : 'text-gray-600 hover:text-[#0F3D32] hover:bg-white/60'
                    }`}
                  >
                    👔 Team Moshe
                  </button>

                  <button
                    type="button"
                    onClick={() => { setHistoryFilter('priya'); setHistoryPage(1); }}
                    className={`px-3 py-1.5 rounded-xl font-cinzel text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                      historyFilter === 'priya'
                        ? 'bg-[#5E1626] text-white shadow-sm'
                        : 'text-gray-600 hover:text-[#5E1626] hover:bg-white/60'
                    }`}
                  >
                    💐 Team Priya
                  </button>
                </div>

                {/* History Search Input */}
                <div className="relative flex-1 max-w-xs">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder={language === 'te' ? "హిస్టరీలో శోధించండి..." : "Search logs or players..."}
                    value={historySearch}
                    onChange={(e) => { setHistorySearch(e.target.value); setHistoryPage(1); }}
                    className="w-full pl-9 pr-3 py-1.5 bg-white border border-gray-300 rounded-xl text-xs font-cormorant focus:outline-none focus:border-[#0F3D32]"
                  />
                </div>
              </div>

              {/* Match History Timeline List */}
              {isLoadingHistory ? (
                <div className="py-12 text-center text-gray-500 font-cinzel text-xs">
                  <div className="inline-block animate-spin text-2xl mb-2">⏳</div>
                  <div>{language === 'te' ? 'మ్యాచ్ హిస్టరీ లోడ్ అవుతోంది...' : 'Loading match history...'}</div>
                </div>
              ) : filteredHistory.length === 0 ? (
                <div className="py-12 px-4 text-center rounded-2xl bg-gray-50 border border-dashed border-gray-300">
                  <div className="text-3xl mb-2">📜</div>
                  <h4 className="font-cinzel text-sm font-bold text-[#0F3D32] uppercase">
                    {language === 'te' ? 'మ్యాచ్ హిస్టరీ ఇంకా ప్రారంభం కాలేదు' : 'No Match Logs Yet'}
                  </h4>
                  <p className="font-cormorant text-xs text-gray-600 italic mt-1 max-w-sm mx-auto">
                    {language === 'te'
                      ? 'మీరు ఏ ఆట ఆడినా, గెలుపు/ఓటమి పాయింట్లు మరియు సమయాలతో సహా ఇక్కడ రికార్డ్ చేయబడతాయి!'
                      : 'Every game played, points won, lost, or transferred will be displayed here with real-time timestamps!'}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {currentHistoryLogs.map((log) => {
                    const isPenaltyOrTransfer = (log.pointsLost || 0) > 0 || (log.pointsTransferredToOpponent || 0) > 0;
                    const isMyLog = cleanCurrentPhone && (log.playerPhone || '').replace(/[^\d+]/g, '').includes(cleanCurrentPhone.slice(-8));

                    return (
                      <div
                        key={log.id}
                        className={`p-4 rounded-2xl border transition-all ${
                          isPenaltyOrTransfer
                            ? 'bg-amber-50/60 border-amber-300/80 shadow-xs'
                            : log.team === 'priya'
                            ? 'bg-[#FFF8F9] border-[#E8A5B3]/50'
                            : 'bg-white border-gray-200 hover:border-[#0F3D32]/40'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2.5">
                          
                          {/* Left: Player & Event Details */}
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              {/* Game Tag */}
                              <span className="font-cinzel text-[11px] font-bold text-[#0F3D32] bg-[#0F3D32]/10 px-2.5 py-0.5 rounded-md border border-[#0F3D32]/20">
                                🎮 {log.gameName}
                              </span>

                              {/* Player Badge */}
                              <strong className="font-cinzel text-sm text-gray-900 font-bold">
                                {log.playerName}
                              </strong>

                              {isMyLog && (
                                <span className="text-[10px] font-cinzel font-bold text-amber-800 bg-amber-200/80 px-2 py-0.5 rounded-full uppercase">
                                  {language === 'te' ? 'మీరు' : 'You'}
                                </span>
                              )}

                              {/* Supported Team Badge */}
                              <span className={`text-[10px] font-cinzel font-bold px-2 py-0.5 rounded-full uppercase flex items-center gap-1 ${
                                log.team === 'priya'
                                  ? 'bg-[#5E1626]/10 text-[#5E1626] border border-[#5E1626]/20'
                                  : 'bg-[#0F3D32]/10 text-[#0F3D32] border border-[#0F3D32]/20'
                              }`}>
                                <span>{log.team === 'priya' ? '💐' : '👔'}</span>
                                <span>{language === 'te' ? (log.team === 'priya' ? 'టీమ్ ప్రియ' : 'టీమ్ మోషే') : (log.team === 'priya' ? 'Team Priya' : 'Team Moshe')}</span>
                              </span>
                            </div>

                            {/* Narrative Story of the Match */}
                            <p className="font-cormorant text-sm sm:text-base text-gray-800 font-medium leading-snug">
                              {language === 'te' && log.teluguDescription 
                                ? log.teluguDescription 
                                : log.description || `${log.playerName} played for Team ${log.team === 'priya' ? 'Priya' : 'Moshe'} in ${log.gameName}`}
                            </p>
                          </div>

                          {/* Right: Points Outcome & Exact Timings */}
                          <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-1 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                            {/* Points badge */}
                            {isPenaltyOrTransfer ? (
                              <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-100 text-amber-900 border border-amber-300 font-cinzel text-xs font-bold">
                                <ArrowRightLeft className="w-3 h-3 text-amber-700" />
                                <span>
                                  -{log.pointsLost || log.pointsTransferredToOpponent} pts lost
                                  {(log.pointsTransferredToOpponent || 0) > 0 && ` ➔ Team ${log.opponentTeam === 'priya' ? 'Priya 💐' : 'Moshe 👔'}`}
                                </span>
                              </div>
                            ) : (
                              <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-100 text-emerald-900 border border-emerald-300 font-cinzel text-xs font-bold">
                                <Sparkles className="w-3 h-3 text-emerald-700" />
                                <span>+{log.pointsWon} pts for Team {log.team === 'priya' ? 'Priya' : 'Moshe'}</span>
                              </div>
                            )}

                            {/* Exact Timestamp */}
                            <div className="flex items-center gap-1.5 text-[11px] font-cinzel text-gray-500 mt-1">
                              <Clock className="w-3 h-3 text-gray-400" />
                              <span>{log.formattedTime} &bull; {log.formattedDate}</span>
                              <span className="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.2 rounded font-sans">
                                {getRelativeTime(log.timestamp)}
                              </span>
                            </div>
                          </div>

                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* History Pagination */}
              {totalHistoryPages > 1 && (
                <div className="mt-6 pt-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3 font-cinzel text-xs">
                  <div className="text-gray-500">
                    {language === 'te' ? (
                      <>
                        మొత్తం <strong>{totalHistoryCount}</strong> హిస్టరీ లో <strong>{startHistoryIndex + 1}</strong> - <strong>{Math.min(startHistoryIndex + HISTORY_PAGE_SIZE, totalHistoryCount)}</strong> చూపిస్తోంది
                      </>
                    ) : (
                      <>
                        Showing <strong>{startHistoryIndex + 1}</strong> to <strong>{Math.min(startHistoryIndex + HISTORY_PAGE_SIZE, totalHistoryCount)}</strong> of <strong>{totalHistoryCount}</strong> match events (6 per page)
                      </>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      disabled={validHistoryPage <= 1}
                      onClick={() => setHistoryPage(p => Math.max(1, p - 1))}
                      className="px-3 py-1.5 rounded-xl border border-gray-300 bg-white text-[#0F3D32] hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1 font-bold"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                      <span>{language === 'te' ? 'వెనుకకు' : 'Previous'}</span>
                    </button>

                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalHistoryPages }, (_, i) => i + 1).slice(0, 7).map((page) => (
                        <button
                          key={page}
                          type="button"
                          onClick={() => setHistoryPage(page)}
                          className={`w-7 h-7 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            validHistoryPage === page
                              ? 'bg-[#0F3D32] text-[#F1DFA6] shadow-sm'
                              : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                    </div>

                    <button
                      type="button"
                      disabled={validHistoryPage >= totalHistoryPages}
                      onClick={() => setHistoryPage(p => Math.min(totalHistoryPages, p + 1))}
                      className="px-3 py-1.5 rounded-xl border border-gray-300 bg-white text-[#0F3D32] hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1 font-bold"
                    >
                      <span>{language === 'te' ? 'తదుపరి' : 'Next'}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      </ScrollReveal>
    </div>
  );
};
