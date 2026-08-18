import React, { useState, useRef, useEffect } from 'react';
import { 
  motion, 
  AnimatePresence 
} from 'motion/react';
import { 
  MessageCircle, 
  X, 
  Send, 
  Phone, 
  Calendar, 
  MapPin, 
  Heart, 
  Sparkles, 
  Film, 
  RotateCcw, 
  ExternalLink,
  HelpCircle,
  Clock,
  User,
  Church,
  Utensils
} from 'lucide-react';
import { weddingInfo, venueInfo } from '../data/weddingData';
import { useLanguage } from '../context/LanguageContext';

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  time: string;
  actions?: {
    label: string;
    actionType: 'call' | 'whatsapp' | 'scroll' | 'link';
    value: string;
  }[];
}

const FAQ_SUGGESTIONS_EN = [
  "📅 Date & Time",
  "📍 Venue & Directions",
  "📞 Contact Numbers",
  "👑 Bride & Groom Details",
  "🎬 Engagement Video Link",
  "🍽️ Food & Lunch Timings"
];

const FAQ_SUGGESTIONS_TE = [
  "📅 ముహూర్తం & సమయం",
  "📍 వేదిక & గూగుల్ మ్యాప్స్",
  "📞 ఫోన్ నంబర్లు & సహాయం",
  "👑 వధూవరుల వివరాలు",
  "🎬 నిశ్చితార్థం వీడియో",
  "🍽️ భోజన సమయాలు"
];

export const WeddingChatbot: React.FC = () => {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Initialize or update welcome message based on language
  useEffect(() => {
    setMessages([
      {
        id: 'welcome-1',
        sender: 'bot',
        text: language === 'te' 
          ? `మీకు దైవ శాంతి కలుగును గాక! ✨ నేను మోషే దొర & ప్రియల వివాహ అసిస్టెంట్‌ని. వివాహ తేదీ, ముహూర్తం, వేదిక, కుటుంబ వివరాలు లేదా సహాయ నంబర్ల గురించి నన్ను అడగండి!`
          : `Grace and peace to you! ✨ I am Moshe Dora & Priya's Wedding Assistant. Ask me anything about the date, venue, family details, route, or contact numbers!`,
        time: 'Just now',
        actions: [
          { label: language === 'te' ? '📞 ఫోన్ చేయండి' : '📞 Call Family', actionType: 'call', value: '+919640448277' },
          { label: language === 'te' ? '📍 వేదిక మ్యాప్' : '📍 View Venue Map', actionType: 'scroll', value: 'venue' }
        ]
      }
    ]);
  }, [language]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const isTeluguQuery = (text: string) => {
    return language === 'te' || /[\u0C00-\u0C7F]/.test(text) || text.includes('ముహూర్తం') || text.includes('వేదిక') || text.includes('ఎప్పుడు') || text.includes('ఎక్కడ');
  };

  const answerQuestion = (query: string) => {
    const q = query.toLowerCase();
    const isTe = isTeluguQuery(query);

    // Contact Numbers Query
    if (q.includes('contact') || q.includes('phone') || q.includes('number') || q.includes('call') || q.includes('whatsapp') || q.includes('help') || q.includes('rsvp') || q.includes('ఫోన్') || q.includes('నంబర్') || q.includes('సంప్రదించ')) {
      return {
        text: isTe
          ? `వివాహ సహాయం మరియు సమాచారం కొరకు కుటుంబ సంప్రదింపు నంబర్లు:\n\n• సంప్రదింపు 1: +91 96404 48277\n• సంప్రదింపు 2: +91 83749 35230\n\nఎప్పుడైనా ఫోన్ కాల్ లేదా వాట్సాప్‌లో సంప్రదించవచ్చు!`
          : `Here are the family contact numbers for any wedding assistance and enquiries:\n\n• Family Contact 1: +91 96404 48277\n• Family Contact 2: +91 83749 35230\n\nFeel free to call or message on WhatsApp anytime!`,
        actions: [
          { label: isTe ? '📞 కాల్ 9640448277' : '📞 Call 9640448277', actionType: 'call', value: '+919640448277' },
          { label: isTe ? '💬 వాట్సాప్ 9640448277' : '💬 WhatsApp 9640448277', actionType: 'whatsapp', value: '919640448277' },
          { label: isTe ? '📞 కాల్ 8374935230' : '📞 Call 8374935230', actionType: 'call', value: '+918374935230' },
          { label: isTe ? '💬 వాట్సాప్ 8374935230' : '💬 WhatsApp 8374935230', actionType: 'whatsapp', value: '918374935230' }
        ]
      };
    }

    // Date & Time Query
    if (q.includes('date') || q.includes('when') || q.includes('time') || q.includes('timing') || q.includes('day') || q.includes('september') || q.includes('schedule') || q.includes('calendar') || q.includes('తేదీ') || q.includes('ముహూర్తం') || q.includes('ఎప్పుడు') || q.includes('సమయం')) {
      return {
        text: isTe
          ? `పరిశుద్ధ వివాహ మహోత్సవ ముహూర్తం:\n\n🗓️ తేదీ: గురువారం, సెప్టెంబర్ 03, 2026\n⏰ సమయం: ఉదయం 10:00 గంటలకు\n\nదయచేసి సకాలంలో విచ్చేసి ఆశీర్వదించండి!`
          : `The Holy Matrimony ceremony will be solemnized on:\n\n🗓️ Date: Thursday, September 03, 2026\n⏰ Time: 10:00 AM IST\n\nPlease arrive on time to join the opening prayers and wedding ceremony!`,
        actions: [
          { label: isTe ? '📅 క్యాలెండర్ చూడండి' : '📅 View Countdown & Calendar', actionType: 'scroll', value: 'calendar' }
        ]
      };
    }

    // Venue & Location & Navigation
    if (q.includes('venue') || q.includes('place') || q.includes('location') || q.includes('hall') || q.includes('where') || q.includes('yeleswaram') || q.includes('reach') || q.includes('train') || q.includes('airport') || q.includes('station') || q.includes('map') || q.includes('gps') || q.includes('parking') || q.includes('distance') || q.includes('వేదిక') || q.includes('ఎక్కడ') || q.includes('స్థలం') || q.includes('దారి') || q.includes('ఏలేశ్వరం')) {
      return {
        text: isTe
          ? `వివాహ వేదిక వివరాలు:\n\n🏛️ వేదిక: వేదిక ఫంక్షన్ హాల్\n📍 చిరునామా: మెయిన్ రోడ్, ఏలేశ్వరం మండలం, ఆంధ్రప్రదేశ్ 533429\n\n🚗 సౌకర్యాలు: గ్రాండ్ ఏసీ హాల్, 200+ కార్ల పార్కింగ్, భోజన శాల.\n\n🚆 దగ్గరి రైల్వే స్టేషన్లు: సామర్లకోట (30 కి.మీ), తుని (38 కి.మీ).\n✈️ దగ్గరి విమానాశ్రయం: రాజమండ్రి ఎయిర్‌పోర్ట్ (62 కి.మీ).`
          : `The wedding is hosted at:\n\n🏛️ Venue: Vedika Function Hall\n📍 Address: Main Road, Near Town Center, Yeleswaram Mandal, Andhra Pradesh 533429\n\n🚗 Amenities: Grand AC Hall, 200+ car parking, and dining area.\n\n🚆 Nearest Stations: Samalkot Junction (30 km), Tuni (38 km).\n✈️ Nearest Airport: Rajahmundry Airport (62 km).`,
        actions: [
          { label: isTe ? '📍 గూగుల్ మ్యాప్స్ దారి' : '📍 Open GPS Map', actionType: 'scroll', value: 'venue' },
          { label: isTe ? '📞 రూట్ కోసం కాల్ చేయండి' : '📞 Call for Route Info', actionType: 'call', value: '+919640448277' }
        ]
      };
    }

    // Groom Details
    if (q.includes('groom') || q.includes('moshe') || q.includes('dora') || q.includes('velnati') || q.includes('ravikampadu') || q.includes('వరుడు') || q.includes('మోషే')) {
      return {
        text: isTe
          ? `👑 వరుడు: వేల్నాటి మోషే దొర\n\nతల్లిదండ్రులు: శ్రీ వేల్నాటి వెంకట రమణ & శ్రీమతి భాను మతి గార్ల సుపుత్రుడు\nస్వగ్రామం: రావికంపాడు\n\nదైవభక్తితో పరిశుద్ధ వివాహ బంధంలోకి అడుగుపెడుతున్నారు!`
          : `👑 The Groom: Velnati Moshe Dora\n\nParents: Son of Shri. Velnati Venkata Ramana & Smt. Velanti Bhanu Mathi\nNative: RAVIKAMPADU\n\nWalking in faith, devotion, and gratitude under God's divine grace!`,
        actions: [
          { label: isTe ? '👑 వధూవరుల వివరాలు' : '👑 View Couple Profile', actionType: 'scroll', value: 'couple' }
        ]
      };
    }

    // Bride Details
    if (q.includes('bride') || q.includes('priya') || q.includes('nelluri') || q.includes('lingamparthi') || q.includes('వధువు') || q.includes('ప్రియ')) {
      return {
        text: isTe
          ? `💐 వధువు: నెల్లూరి ప్రియ\n\nతల్లిదండ్రులు: శ్రీ నెల్లూరి జాన్ బాబు & శ్రీమతి స్వర్ణ గార్ల సుపుత్రిక\nస్వగ్రామం: లింగంపర్తి\n\nసౌమ్యతతో, క్రైస్తవ సద్గుణాలతో ప్రకాశిస్తూ వివాహ బంధంలో ఏకమవుతున్నారు!`
          : `💐 The Bride: Nelluri Priya\n\nParents: Daughter of Shri. Nelluri John Babu & Smt. Swarna\nNative: LINGAMPARTHI\n\nRadiant in grace, humility, and Christian virtues, stepping joyfully into holy matrimony!`,
        actions: [
          { label: isTe ? '💐 వధువు వివరాలు' : '💐 View Couple Profile', actionType: 'scroll', value: 'couple' }
        ]
      };
    }

    // Parents / Families
    if (q.includes('parents') || q.includes('family') || q.includes('father') || q.includes('mother') || q.includes('తల్లిదండ్రులు') || q.includes('కుటుంబం')) {
      return {
        text: isTe
          ? `ఉభయ కుటుంబాల వివరాలు:\n\n👔 వరుని తల్లిదండ్రులు: శ్రీ వేల్నాటి వెంకట రమణ & శ్రీమతి భాను మతి (రావికంపాడు)\n\n💐 వధువు తల్లిదండ్రులు: శ్రీ నెల్లూరి జాన్ బాబు & శ్రీమతి స్వర్ణ (లింగంపర్తి)`
          : `Royal Lineage of Both Families:\n\n👔 Groom's Parents: Shri. Velnati Venkata Ramana & Smt. Velanti Bhanu Mathi (Ravikampadu)\n\n💐 Bride's Parents: Shri. Nelluri John Babu & Smt. Swarna (Lingamparthi)`,
        actions: [
          { label: isTe ? '👑 వంశ పరిచయం' : '👑 View Lineage', actionType: 'scroll', value: 'couple' }
        ]
      };
    }

    // Video / Livestream Query
    if (q.includes('video') || q.includes('stream') || q.includes('live') || q.includes('youtube') || q.includes('watch') || q.includes('engagement') || q.includes('recording') || q.includes('వీడియో') || q.includes('లైవ్') || q.includes('నిశ్చితార్థం')) {
      return {
        text: isTe
          ? `మోషే దొర & ప్రియల పవిత్ర నిశ్చితార్థ వేడుక లైవ్ రికార్డింగ్ వీడియోని ఈ పేజీలో లేదా యూట్యూబ్‌లో వీక్షించవచ్చు!\n\nలింక్: https://www.youtube.com/live/PfYwSUQuexk`
          : `You can watch their sacred Engagement & Ring Ceremony live recording on YouTube directly on this page or on YouTube!\n\nLink: https://www.youtube.com/live/PfYwSUQuexk`,
        actions: [
          { label: isTe ? '🎬 వీడియో చూడండి' : '🎬 Watch Video on Page', actionType: 'scroll', value: 'video' },
          { label: isTe ? '📺 యూట్యూబ్‌లో ఓపెన్ చేయండి' : '📺 Open in YouTube App', actionType: 'link', value: 'https://www.youtube.com/live/PfYwSUQuexk?si=ua0g3_g_eCHx_a8V' }
        ]
      };
    }

    // Food & Feasting / Lunch
    if (q.includes('food') || q.includes('lunch') || q.includes('biryani') || q.includes('dinner') || q.includes('eat') || q.includes('meal') || q.includes('feast') || q.includes('భోజనం') || q.includes('లంచ్') || q.includes('తిండి')) {
      return {
        text: isTe
          ? `🍽️ వివాహ వేడుక అనంతరం వేదిక ఫంక్షన్ హాల్ భోజన శాలలో సాంప్రదాయ ఆంధ్ర వెడ్డింగ్ విందు & బిర్యానీ భోజనాలు (మధ్యాహ్నం 12:30 గంటల నుండి) ఏర్పాటు చేయబడినవి. అందరూ తప్పక ఆరగించవలసిందిగా ఆహ్వానం!`
          : `🍽️ Delicious Traditional Andhra Wedding Feast & Biryani Lunch will be served immediately following the Holy Matrimony ceremony at Vedika Function Hall dining arena (approx 12:30 PM onwards). Everyone is warmly invited!`,
        actions: [
          { label: isTe ? '📍 భోజన శాల వివరాలు' : '📍 View Venue & Dining', actionType: 'scroll', value: 'venue' }
        ]
      };
    }

    // Games & Leaderboard Query
    if (q.includes('game') || q.includes('play') || q.includes('score') || q.includes('leaderboard') || q.includes('talambralu') || q.includes('varamala') || q.includes('kalasha') || q.includes('rank') || q.includes('ఆట') || q.includes('గేమ్') || q.includes('స్కోర్') || q.includes('లీడర్‌బోర్డ్') || q.includes('తలంబ్రాలు') || q.includes('వరమాల') || q.includes('కలశం')) {
      return {
        text: isTe
          ? `🎮 వివాహ సరదా గేమ్స్ & లైవ్ లీడర్‌బోర్డ్:\n\n1. తలంబ్రాల ముత్యాల క్యాచ్ (30s)\n2. పవిత్ర వరమాల విసిరే ఛాలెంజ్\n3. బంగారు కలశం ఉంగరం ఆట\n\nమీ పేరు మరియు ఫోన్ నంబర్‌తో ఆడండి. మీరు ఆడిన ప్రతిసారీ మీ పాత మార్కులకు కొత్త మార్కులు కలుస్తాయి & లైవ్ లీడర్‌బోర్డ్‌లో 5 పేర్లు చొప్పున కనిపిస్తాయి!`
          : `🎮 Eden Garden Wedding Games & Live Leaderboard:\n\n1. Talambralu Sacred Pearl Catch (30s)\n2. Sacred Varamala Toss Challenge\n3. Golden Kalasha Ring Quest\n\nEnter your Name & Phone number as your player ID. Whenever you play again with the same number, your new points add cumulatively to your score and rank you on the 5-per-page leaderboard!`,
        actions: [
          { label: isTe ? '🎮 ఆటలు ఆడండి' : '🎮 Play Wedding Games', actionType: 'scroll', value: 'game' },
          { label: isTe ? '🏆 లీడర్‌బోర్డ్ చూడండి' : '🏆 View Leaderboard', actionType: 'scroll', value: 'leaderboard' }
        ]
      };
    }

    // Default intelligent response
    return {
      text: isTe
        ? `అడిగినందుకు ధన్యవాదాలు! ముఖ్య వివరాలు:\n\n• వివాహ తేదీ: గురువారం, సెప్టెంబర్ 03, 2026 ఉదయం 10:00 గంటలకు\n• వేదిక: వేదిక ఫంక్షన్ హాల్, ఏలేశ్వరం\n• వధూవరులు: వేల్నాటి మోషే దొర & నెల్లూరి ప్రియ\n• సహాయ నంబర్లు: +91 96404 48277, +91 83749 35230\n\nఇంకేదైనా సహాయం కావాలా?`
        : `Thank you for asking! Here are the key details:\n\n• Wedding Date: Thursday, September 03, 2026 at 10:00 AM\n• Venue: Vedika Function Hall, Yeleswaram\n• Couple: Velnati Moshe Dora & Nelluri Priya\n• Help Contacts: +91 96404 48277, +91 83749 35230\n\nHow else can I help you?`,
      actions: [
        { label: isTe ? '📞 ఫోన్ చేయండి' : '📞 Call Family', actionType: 'call', value: '+919640448277' },
        { label: isTe ? '📍 వేదిక మ్యాప్' : '📍 Venue Map', actionType: 'scroll', value: 'venue' },
        { label: isTe ? '🎬 వీడియో చూడండి' : '🎬 Watch Video', actionType: 'scroll', value: 'video' }
      ]
    };
  };

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const response = answerQuestion(text);
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: response.text,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actions: response.actions as any
      };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 450);
  };

  const handleAction = (action: { label: string; actionType: 'call' | 'whatsapp' | 'scroll' | 'link'; value: string }) => {
    if (action.actionType === 'call') {
      window.location.href = `tel:${action.value}`;
    } else if (action.actionType === 'whatsapp') {
      window.open(`https://wa.me/${action.value}?text=Hello%2C%20regarding%20Moshe%20Dora%20%26%20Priya%20Wedding%20Celebration`, '_blank');
    } else if (action.actionType === 'scroll') {
      const el = document.getElementById(action.value);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setIsOpen(false);
      }
    } else if (action.actionType === 'link') {
      window.open(action.value, '_blank');
    }
  };

  const currentFaqSuggestions = language === 'te' ? FAQ_SUGGESTIONS_TE : FAQ_SUGGESTIONS_EN;

  return (
    <>
      {/* 1. FLOATING CHATBOT LAUNCHER BUTTON */}
      <div className="fixed bottom-6 left-6 z-40 select-none">
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-[#0F3D32] via-[#2D7A62] to-[#0F3D32] text-[#F1DFA6] border-2 border-[#D4AF37] shadow-2xl cursor-pointer hover:shadow-[0_0_25px_rgba(212,175,55,0.5)] transition-all ring-4 ring-[#D4AF37]/30"
          title={language === 'te' ? "వివాహ సహాయం & సమాధానాలు" : "Ask Wedding Questions"}
        >
          <div className="w-8 h-8 rounded-full bg-[#5E1626] flex items-center justify-center text-white text-sm shadow-xs border border-[#D4AF37]">
            <MessageCircle className="w-4 h-4" />
          </div>
          <div className="text-left font-cinzel text-xs font-bold leading-tight">
            <span>{language === 'te' ? 'వివాహ అసిస్టెంట్' : 'Ask Wedding AI'}</span>
            <span className="block text-[9px] text-[#F1DFA6]/80 font-semibold tracking-wider">
              {language === 'te' ? '24/7 సహాయం & సమాధానాలు' : '24/7 Help & Contacts'}
            </span>
          </div>

          {/* Golden Pulse Badge */}
          <span className="flex h-2.5 w-2.5 relative ml-1">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D4AF37] opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#25D366]" />
          </span>
        </motion.button>
      </div>

      {/* 2. CHATBOT WINDOW DIALOG */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 280 }}
            className="fixed bottom-20 sm:bottom-24 left-4 sm:left-6 z-50 w-[calc(100vw-32px)] sm:w-[400px] h-[520px] max-h-[80vh] bg-[#FFFDF9] border-2 border-[#D4AF37] rounded-3xl shadow-2xl flex flex-col overflow-hidden backdrop-blur-lg gold-box-shadow"
          >
            {/* Chatbot Header */}
            <div className="p-4 bg-gradient-to-r from-[#0F3D32] via-[#1B5A48] to-[#0F3D32] text-[#FFFDF9] flex items-center justify-between border-b border-[#D4AF37]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#D4AF37] to-[#FFF2C4] p-0.5 shadow-md">
                  <div className="w-full h-full rounded-full bg-[#0F3D32] flex items-center justify-center text-lg font-bold">
                    🕊️
                  </div>
                </div>
                <div>
                  <h3 className="font-cinzel text-sm font-bold text-[#F1DFA6] leading-tight">
                    {language === 'te' ? 'మోషే & ప్రియ వివాహ గైడ్' : 'Moshe & Priya Wedding Guide'}
                  </h3>
                  <div className="flex items-center gap-1 text-[10px] text-[#8EB69B] font-cinzel">
                    <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
                    <span>{language === 'te' ? 'తక్షణ సమాధానాలు & సంప్రదింపులు' : 'Instant Answers & Contacts'}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                title="Close chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Contact Numbers Banner */}
            <div className="bg-[#FFF8E7] px-3.5 py-2 border-b border-[#D4AF37]/30 flex items-center justify-between text-xs font-cinzel">
              <div className="text-[#0F3D32] font-semibold flex items-center gap-1">
                <span>📞 {language === 'te' ? 'సహాయం:' : 'Help:'}</span>
                <span className="font-bold text-[#5E1626]">9640448277</span>
                <span>·</span>
                <span className="font-bold text-[#5E1626]">8374935230</span>
              </div>
              <a
                href="tel:+919640448277"
                className="px-2 py-0.5 rounded-full bg-[#0F3D32] text-[#F1DFA6] text-[10px] font-bold"
              >
                {language === 'te' ? 'కాల్ చేయండి' : 'Call Now'}
              </a>
            </div>

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[#FAF6EE]/50">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed whitespace-pre-line shadow-xs ${
                      msg.sender === 'user'
                        ? 'bg-[#0F3D32] text-[#FFFDF9] rounded-br-none border border-[#D4AF37]/40'
                        : 'bg-white text-[#2A2A2A] rounded-bl-none border border-[#D4AF37]/50'
                    }`}
                  >
                    <p className="font-cormorant text-sm text-[#2A2A2A] font-medium leading-relaxed">
                      {msg.text}
                    </p>

                    {/* Interactive Action Buttons */}
                    {msg.actions && msg.actions.length > 0 && (
                      <div className="mt-2.5 pt-2 border-t border-[#D4AF37]/30 flex flex-wrap gap-1.5">
                        {msg.actions.map((act, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleAction(act)}
                            className="px-2.5 py-1 rounded-lg bg-[#F4FAF6] hover:bg-[#E5F3EB] text-[#0F3D32] border border-[#0F3D32]/30 font-cinzel text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-all shadow-2xs"
                          >
                            <span>{act.label}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <span className="text-[9px] text-gray-400 mt-1 px-1 font-cinzel">
                    {msg.time}
                  </span>
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center gap-1.5 p-2 px-3 rounded-2xl bg-white border border-[#D4AF37]/40 w-fit text-xs text-gray-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0F3D32] animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0F3D32] animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0F3D32] animate-bounce [animation-delay:0.4s]" />
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestion Chips */}
            <div className="px-3 py-2 bg-white border-t border-[#D4AF37]/20 flex gap-1.5 overflow-x-auto no-scrollbar">
              {currentFaqSuggestions.map((faq, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(faq)}
                  className="whitespace-nowrap px-2.5 py-1 rounded-full bg-[#FFF8E7] hover:bg-[#FFE5B4] text-[#0F3D32] border border-[#D4AF37]/50 text-[10px] font-cinzel font-semibold transition-all cursor-pointer flex-shrink-0"
                >
                  {faq}
                </button>
              ))}
            </div>

            {/* Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="p-3 bg-white border-t border-[#D4AF37]/30 flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={language === 'te' ? "తేదీ, వేదిక, ఫోన్ నంబర్ల గురించి అడగండి..." : "Ask about date, venue, contacts, route..."}
                className="flex-1 px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-[#0F3D32] focus:ring-1 focus:ring-[#0F3D32] text-xs outline-none bg-[#FAF6EE]/40 font-cormorant text-sm"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="w-10 h-10 rounded-xl bg-[#0F3D32] hover:bg-[#1B5A48] disabled:opacity-40 text-[#F1DFA6] flex items-center justify-center transition-all cursor-pointer shadow-xs"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
