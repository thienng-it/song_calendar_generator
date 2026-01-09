import React, { useState } from 'react';
import { TRANSLATIONS } from '../utils/translations.js'
import FilterBar from './FilterBar.jsx';

const RefreshIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M23 4v6h-6"></path>
        <path d="M1 20v-6h6"></path>
        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
    </svg>
);



const EditIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
    </svg>
);

const CheckIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
);

const XIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
);

const SongItem = ({ label, song, onRegenerate, onManualUpdate }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState('');
    const [editPage, setEditPage] = useState('');

    const startEditing = () => {
        setEditName(song ? song.name : '');
        setEditPage(song && song.page ? song.page : '');
        setIsEditing(true);
    };

    const cancelEditing = () => {
        setIsEditing(false);
    };

    const saveEditing = () => {
        if (onManualUpdate) {
            onManualUpdate(label, editName, editPage);
        }
        setIsEditing(false);
    };

    if (isEditing) {
        return (
            <div className="song-item editing" style={{ alignItems: 'center' }}>
                <span className="song-label">{label}</span>
                <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="Tên bài hát"
                    className="edit-input-name"
                    style={{
                        flexGrow: 1,
                        padding: '4px 8px',
                        borderRadius: '4px',
                        border: '1px solid var(--color-border)',
                        fontSize: '0.9rem',
                        marginRight: '8px'
                    }}
                />
                <input
                    type="text"
                    value={editPage}
                    onChange={(e) => setEditPage(e.target.value)}
                    placeholder="Trang"
                    className="edit-input-page"
                    style={{
                        width: '60px',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        border: '1px solid var(--color-border)',
                        fontSize: '0.9rem',
                        marginRight: '8px'
                    }}
                />
                <button
                    onClick={saveEditing}
                    className="action-btn"
                    style={{ color: 'var(--color-success)', background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
                >
                    <CheckIcon />
                </button>
                <button
                    onClick={cancelEditing}
                    className="action-btn"
                    style={{ color: 'var(--color-error)', background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
                >
                    <XIcon />
                </button>
            </div>
        );
    }

    return (
        <div className="song-item" style={{ alignItems: 'center' }}>
            <span className="song-label">{label}</span>
            <div className="song-info" style={{
                flexGrow: 1,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginRight: '4px'
            }}>
                <span className="song-name" style={{ marginRight: '8px' }}>
                    {song ? song.name : "..."}
                </span>
                {song && song.page && (
                    <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'hsla(var(--color-primary), 0.1)',
                        color: 'hsl(var(--color-primary))',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        fontSize: '0.9em',
                        fontWeight: 600,
                        letterSpacing: '0.02em',
                        border: '1px solid hsla(var(--color-primary), 0.2)',
                        whiteSpace: 'nowrap',
                        minWidth: '2.5em'
                    }}>
                        {song.page}
                    </span>
                )}
            </div>
            <div className="item-actions" style={{ display: 'flex', gap: '4px' }}>
                {onManualUpdate && (
                    <button
                        className="regenerate-btn-small"
                        onClick={startEditing}
                        title="Chỉnh sửa thủ công"
                    >
                        <EditIcon />
                    </button>
                )}
                {onRegenerate && (
                    <button
                        className="regenerate-btn-small"
                        onClick={() => onRegenerate(label, song)}
                        title="Đổi bài khác"
                    >
                        <RefreshIcon />
                    </button>
                )}
            </div>
        </div>
    )
};

const DayCard = ({ day, lang, onRegenerate, onManualUpdate }) => {
    const { date, dayIndex, season } = day.dayInfo;
    const { songs } = day;
    const text = TRANSLATIONS[lang];

    // Format Date: DD-MM
    const dateStr = `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}`;

    let seasonColor = "hsl(var(--color-primary))";
    let seasonTextColor = "#fff"; // Default white text

    if (season === 'ADVENT') {
        seasonColor = "#7b1fa2"; // Purple
    }
    if (season === 'LENT') {
        seasonColor = "#512da8"; // Purple/Violet
    }
    if (season === 'CHRISTMAS' || season === 'EASTER') {
        seasonColor = "#fbc02d"; // Gold/White theme
        seasonTextColor = "#000"; // Dark text for contrast
    }
    if (season === 'ORDINARY') {
        seasonColor = "hsl(var(--color-success))"; // Green
    }

    const dayName = text.days[dayIndex];
    const seasonName = text.season[season] || season;

    const handleRegen = (slot, currentSong) => {
        if (onRegenerate) {
            onRegenerate(date, slot, currentSong);
        }
    };

    const handleManual = (slot, newName, newPage) => {
        if (onManualUpdate) {
            onManualUpdate(date, slot, newName, newPage);
        }
    };

    return (
        <div className="card day-card" style={{ borderLeft: `5px solid ${seasonColor}` }}>
            <div className="day-header">
                <div className="day-info">
                    <h3 className="day-name">{dayName}</h3>
                    <span className="day-date" style={{
                        fontSize: '1.5rem',
                        fontWeight: '700',
                        color: 'hsl(var(--color-primary))',
                        marginTop: '4px',
                        display: 'block'
                    }}>
                        {dateStr}
                    </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                    <div className="season-badge" style={{ backgroundColor: seasonColor, color: seasonTextColor }}>
                        {seasonName}
                    </div>
                    {day.dayInfo.hasGloria && (
                        <div className="season-badge" style={{ backgroundColor: 'hsl(var(--color-warning))', color: '#000', fontSize: '0.7rem' }}>
                            {text.gloria}
                        </div>
                    )}
                    {day.dayInfo.notes && day.dayInfo.notes.map((note, i) => (
                        <div key={i} className="season-badge" style={{ backgroundColor: 'hsl(var(--color-secondary))', color: '#fff', fontSize: '0.7rem' }}>
                            {note}
                        </div>
                    ))}
                </div>
            </div>

            <div className="songs-list">
                <SongItem label="NL" song={songs.NL} onRegenerate={handleRegen} onManualUpdate={handleManual} />
                <SongItem label="DL" song={songs.DL} onRegenerate={handleRegen} onManualUpdate={handleManual} />
                <SongItem label="HL" song={songs.HL} onRegenerate={handleRegen} onManualUpdate={handleManual} />
                <SongItem label="KL" song={songs.KL} onRegenerate={handleRegen} onManualUpdate={handleManual} />
            </div>
        </div>
    );
};

const ScheduleView = ({ schedule, lang = 'vi', onRegenerate, onManualUpdate }) => {
    const text = TRANSLATIONS[lang];
    const [selectedMonth, setSelectedMonth] = useState('All');
    const [selectedSeason, setSelectedSeason] = useState('All');
    const [selectedDay, setSelectedDay] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    if (!schedule || schedule.length === 0) {
        return (
            <div className="empty-state">
                <p>{text.emptyState}</p>
            </div>
        );
    }

    // 1. Get List of Months for Selector
    const allMonths = [...new Set(schedule.map(day =>
        day.date.toLocaleString(lang === 'vi' ? 'vi-VN' : 'en-US', { month: 'long', year: 'numeric' })
    ))];

    // 2. Filter Schedule
    const filteredSchedule = schedule.filter(day => {
        const monthStr = day.date.toLocaleString(lang === 'vi' ? 'vi-VN' : 'en-US', { month: 'long', year: 'numeric' });

        // Month Filter
        if (selectedMonth !== 'All' && monthStr !== selectedMonth) return false;

        // Season Filter
        if (selectedSeason !== 'All' && day.dayInfo.season !== selectedSeason) return false;

        // Day Filter
        if (selectedDay !== 'All' && day.dayInfo.dayIndex !== parseInt(selectedDay)) return false;

        // Search Filter
        if (searchQuery.trim() !== '') {
            const query = searchQuery.toLowerCase();
            const dayName = text.days[day.dayInfo.dayIndex].toLowerCase();
            const season = (text.season[day.dayInfo.season] || day.dayInfo.season).toLowerCase();
            const dateStr = day.date.toLocaleDateString(lang === 'vi' ? 'vi-VN' : 'en-US').toLowerCase();

            // Songs check
            const songMatches = Object.values(day.songs).some(song => {
                if (!song) return false;
                return (song.name && song.name.toLowerCase().includes(query)) ||
                    (song.page && song.page.toString().includes(query));
            });

            // Notes check
            const notesMatch = day.dayInfo.notes && day.dayInfo.notes.some(note => note.toLowerCase().includes(query));

            return dayName.includes(query) || season.includes(query) || dateStr.includes(query) || songMatches || notesMatch;
        }

        return true;
    });

    // Group filtered results
    const grouped = filteredSchedule.reduce((acc, day) => {
        const month = day.date.toLocaleString(lang === 'vi' ? 'vi-VN' : 'en-US', { month: 'long', year: 'numeric' });
        if (!acc[month]) acc[month] = [];
        acc[month].push(day);
        return acc;
    }, {});

    return (
        <div className="schedule-view">
            {/* Filter Bar */}
            <FilterBar
                selectedMonth={selectedMonth}
                onMonthChange={setSelectedMonth}
                months={allMonths}
                selectedSeason={selectedSeason}
                onSeasonChange={setSelectedSeason}
                selectedDay={selectedDay}
                onDayChange={setSelectedDay}
                onSearch={setSearchQuery}
                lang={lang}
            />

            {Object.keys(grouped).length === 0 ? (
                <div className="empty-state" style={{ padding: '2rem', textAlign: 'center' }}>
                    <p style={{ fontSize: '1.1rem', color: 'var(--color-text-muted)' }}>
                        {lang === 'vi' ? 'Không tìm thấy kết quả nào phù hợp.' : 'No results found.'}
                    </p>
                </div>
            ) : (
                Object.keys(grouped).map(month => (
                    <div key={month} className="month-block">
                        <h2 className="month-title">{month}</h2>
                        <div className="days-grid">
                            {grouped[month].map((day, idx) => (
                                <DayCard key={idx} day={day} lang={lang} onRegenerate={onRegenerate} onManualUpdate={onManualUpdate} />
                            ))}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default ScheduleView;
