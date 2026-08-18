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
  CheckCircle2, 
  TrendingUp, 
  ShieldCheck, 
  RotateCw 
} from 'lucide-react';
import { collection, query, orderBy, onSnapshot, limit } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { LeaderboardPlayer } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { ScrollReveal } from './ScrollReveal';

interface WeddingLeaderboardProps {
  currentPlayerPhone?: string;
  currentPlayerName?: string;
  onSelectPlayer?: (player: { name: string; phone: string }) => void;
}

export const WeddingLeaderboard: React.FC<WeddingLeaderboardProps> = ({
  currentPlayerPhone,
  currentPlayerName
}) => {
  const { language } = useLanguage();
  const [players, setPlayers] = useState<LeaderboardPlayer[]>([]);
  const [filterTeam, setFilterTeam] = useState<'all' | 'moshe' | 'priya'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const PAGE_SIZE = 5;

  // Real-time Firestore sync with server API fallback
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
          // Sort descending by score
          list.sort((a, b) => b.score - a.score);
          setPlayers(list);
          setIsLoading(false);
        } else {
          // Fallback fetch from server
          fetchLeaderboardFromServer();
        }
      },
      (err) => {
        console.warn('Firestore leaderboard listener error, falling back to server API:', err);
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
      setIsLoading(false);
    }
  };

  // Filter players based on team and search query
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

  // Calculate pagination
  const totalItems = filteredPlayers.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
  const validCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (validCurrentPage - 1) * PAGE_SIZE;
  const currentPlayers = filteredPlayers.slice(startIndex, startIndex + PAGE_SIZE);

  // Helper to mask phone for privacy (e.g. 96404****77)
  const maskPhone = (phone: string) => {
    if (!phone) return '';
    const clean = phone.replace(/[^\d+]/g, '');
    if (clean.length <= 4) return clean;
    if (clean.length <= 7) return clean.slice(0, 2) + '••••' + clean.slice(-2);
    return clean.slice(0, 4) + '••••' + clean.slice(-2);
  };

  // Rank icon or badge helper
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
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#0F3D32]/20 pb-5 mb-6 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 bg-[#0F3D32] text-[#F1DFA6] font-cinzel text-[10px] sm:text-xs font-bold uppercase tracking-wider px-3 py-0.5 rounded-full mb-1.5">
                <Trophy className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>{language === 'te' ? 'వివాహ గేమ్స్ లీడర్‌బోర్డ్' : 'Wedding Games Live Leaderboard'}</span>
              </div>
              <h3 className="font-decorative text-2xl sm:text-3xl font-bold text-[#0F3D32]">
                {language === 'te' ? 'గెస్ట్ చాంపియన్స్ ర్యాంకింగ్స్' : 'Guest Champions & Highest Scorers'}
              </h3>
              <p className="font-cormorant text-sm sm:text-base text-[#2A2A2A]/80 italic">
                {language === 'te'
                  ? 'ప్రతి ఆటలో మీరు సాధించిన మార్కులు మీ ఫోన్ నంబర్‌తో నమోదు చేయబడతాయి. మళ్లీ ఆడితే పాత మార్కులకు కొత్త మార్కులు కలుస్తాయి!'
                  : 'Scores are recorded cumulatively per phone number. Play repeatedly to accumulate marks and lead the table!'}
              </p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                type="button"
                onClick={fetchLeaderboardFromServer}
                className="p-2 rounded-xl bg-[#0F3D32]/10 hover:bg-[#0F3D32]/20 text-[#0F3D32] transition-colors cursor-pointer text-xs font-cinzel flex items-center gap-1"
                title="Refresh scores"
              >
                <RotateCw className="w-4 h-4" />
                <span className="hidden sm:inline">{language === 'te' ? 'రిఫ్రెష్' : 'Refresh'}</span>
              </button>
            </div>
          </div>

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
          {isLoading ? (
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
                  : 'Be the first to play any of the wedding games above to put your name at the top of the leaderboard!'}
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
                    మొత్తం <strong>{totalItems}</strong> లో <strong>{startIndex + 1}</strong> - <strong>{Math.min(startIndex + PAGE_SIZE, totalItems)}</strong> చూపిస్తోంది
                  </>
                ) : (
                  <>
                    Showing <strong>{startIndex + 1}</strong> to <strong>{Math.min(startIndex + PAGE_SIZE, totalItems)}</strong> of <strong>{totalItems}</strong> champions (5 per page)
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

                {/* Page Number Buttons */}
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
      </ScrollReveal>
    </div>
  );
};
