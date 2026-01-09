import { useState, useEffect } from 'react'
import { generateSchedule, getAlternativeSong } from './logic/Generator.js'
import ScheduleView from './components/ScheduleView.jsx'
import { TRANSLATIONS } from './utils/translations.js'
import './App.css'

// Helper to get params
const getParams = () => new URLSearchParams(window.location.search);

function App() {
  const params = getParams();
  const initialYear = parseInt(params.get('year')) || new Date().getFullYear();
  const initialSeed = params.get('seed') ? parseInt(params.get('seed')) : null;

  const [year, setYear] = useState(initialYear);
  const [schedule, setSchedule] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [lang, setLang] = useState('vi'); // Default to Vietnamese

  // Theme State
  const [theme, setTheme] = useState(() => localStorage.getItem('app-theme') || 'auto');

  // Apply Theme Effect
  useEffect(() => {
    if (theme === 'auto') {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', theme);
    }
    localStorage.setItem('app-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    const modes = ['auto', 'light', 'dark', 'soft'];
    const nextIndex = (modes.indexOf(theme) + 1) % modes.length;
    setTheme(modes[nextIndex]);
  };

  const getThemeIcon = () => {
    switch (theme) {
      case 'light': return '☀️'; // Sun
      case 'dark': return '🌙';  // Moon
      case 'soft': return '☕';  // Coffee/Soft
      default: return '⚙️';      // Gear/Auto
    }
  };

  // Auto-generate if seed is present on load and schedule is empty
  useEffect(() => {
    if (initialSeed && schedule.length === 0) {
      // Small timeout to allow render
      const data = generateSchedule(initialYear, initialSeed);
      setSchedule(data);
    }
  }, [initialSeed, initialYear, schedule.length]);


  const text = TRANSLATIONS[lang];

  const handleGenerate = () => {
    setIsGenerating(true);
    // Create a new random seed
    const newSeed = Math.floor(Math.random() * 10000000);

    // Update URL without reload
    const newUrl = `${window.location.pathname}?year=${year}&seed=${newSeed}`;
    window.history.pushState({ path: newUrl }, '', newUrl);

    // Simulate async for effect
    setTimeout(() => {
      const data = generateSchedule(year, newSeed);
      setSchedule(data);
      setIsGenerating(false);
    }, 400);
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      const btn = document.getElementById('share-btn');
      if (btn) {
        const originalText = btn.innerText;
        btn.innerText = lang === 'vi' ? 'Đã chép!' : 'Copied!';
        setTimeout(() => btn.innerText = originalText, 2000);
      }
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const handleRegenerate = (dayDate, slotType, currentSong) => {
    setSchedule(prevSchedule => {
      return prevSchedule.map(day => {
        if (day.date.getTime() === dayDate.getTime()) {
          const currentId = currentSong ? currentSong.id : null;
          const newSong = getAlternativeSong(day.dayInfo, slotType, currentId);
          return {
            ...day,
            songs: {
              ...day.songs,
              [slotType]: newSong
            }
          };
        }
        return day;
      });
    });
  };

  const handleManualUpdate = (dayDate, slotType, newName, newPage) => {
    setSchedule(prevSchedule => {
      return prevSchedule.map(day => {
        if (day.date.getTime() === dayDate.getTime()) {
          return {
            ...day,
            songs: {
              ...day.songs,
              [slotType]: {
                ...day.songs[slotType],
                name: newName,
                page: newPage,
                id: 'manual-' + Date.now() // Ensure it has an ID
              }
            }
          };
        }
        return day;
      });
    });
  };

  const handleExportCSV = () => {
    if (schedule.length === 0) return;

    const BOM = "\uFEFF";
    let csv = BOM + "Date,Day,Season,Feast/Notes,Entrance (NL),Offertory (DL),Communion (HL),Recessional (KL)\n";

    schedule.forEach(day => {
      const dateStr = day.date.toLocaleDateString(lang === 'vi' ? 'vi-VN' : 'en-US');
      const dayIdx = day.dayInfo.dayIndex;
      const dayName = text.days[dayIdx];
      const season = text.season[day.dayInfo.season] || day.dayInfo.season;
      const notes = day.dayInfo.notes ? day.dayInfo.notes.join('; ') : '';

      const nl = day.songs.NL ? day.songs.NL.name : '';
      const dl = day.songs.DL ? day.songs.DL.name : '';
      const hl = day.songs.HL ? day.songs.HL.name : '';
      const kl = day.songs.KL ? day.songs.KL.name : '';

      const row = [
        `"${dateStr}"`,
        `"${dayName}"`,
        `"${season}"`,
        `"${notes}"`,
        `"${nl}"`,
        `"${dl}"`,
        `"${hl}"`,
        `"${kl}"`
      ];
      csv += row.join(",") + "\n";
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `lich_hat_${year}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toggleLang = () => {
    setLang(prev => prev === 'vi' ? 'en' : 'vi');
  };

  return (
    <div className="app-container">
      <header className="main-header">
        <div className="container header-content">
          <div className="header-top-row" style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '0.5rem',
            marginBottom: '0.5rem'
          }}>
            <button
              onClick={toggleTheme}
              className="lang-toggle"
              title="Theme: Auto/Light/Dark/Soft"
              style={{ minWidth: '36px' }}
            >
              {getThemeIcon()}
            </button>
            <button
              onClick={toggleLang}
              className="lang-toggle"
              title={lang === 'vi' ? "Switch to English" : "Chuyển sang Tiếng Việt"}
            >
              {lang === 'vi' ? 'EN' : 'VN'}
            </button>
          </div>
          <h1 className="logo">{text.title}</h1>
          <p className="subtitle">{text.subtitle}</p>
        </div>
      </header>

      <main className="main-content container">
        <div className="controls-panel card" style={{ flexWrap: 'wrap' }}>
          <div className="control-group">
            <label htmlFor="year-select">{text.liturgicalYear}:</label>
            <input
              id="year-select"
              type="number"
              value={year}
              onChange={(e) => setYear(parseInt(e.target.value))}
              min="2020" max="2050"
              draggable={false}
            />
          </div>

          <button
            className="btn btn-primary generate-btn"
            onClick={handleGenerate}
            disabled={isGenerating}
          >
            {isGenerating ? text.generating : text.generateBtn}
          </button>

          <div className="action-buttons" style={{
            display: 'flex',
            gap: '0.5rem',
            flexWrap: 'wrap',
            justifyContent: 'center'
          }}>
            <button
              className="btn"
              style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }}
              onClick={handleExportCSV}
              disabled={schedule.length === 0}
            >
              {text.exportBtn}
            </button>
            <button
              id="share-btn"
              className="btn"
              style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }}
              onClick={handleShare}
              disabled={schedule.length === 0}
              title={lang === 'vi' ? "Chia sẻ liên kết" : "Share Link"}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}>
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                <polyline points="16 6 12 2 8 6"></polyline>
                <line x1="12" y1="2" x2="12" y2="15"></line>
              </svg>
              {lang === 'vi' ? 'Chia sẻ' : 'Share'}
            </button>
            <button
              className="btn"
              style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }}
              onClick={() => window.print()}
              disabled={schedule.length === 0}
            >
              {text.printBtn}
            </button>
          </div>
        </div>

        <div className="results-area">
          <ScheduleView
            schedule={schedule}
            lang={lang}
            onRegenerate={handleRegenerate}
            onManualUpdate={handleManualUpdate}
          />
        </div>
      </main>

      <footer className="main-footer">
        <div className="container">
          &copy; {new Date().getFullYear()} Catholic Mass Song Generator.
        </div>
      </footer>
    </div>
  )
}

export default App
