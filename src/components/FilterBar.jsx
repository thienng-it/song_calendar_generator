import React from 'react';
import MonthSelector from './MonthSelector.jsx';
import SearchBar from './SearchBar.jsx';

const FilterBar = ({
    selectedMonth, onMonthChange, months,
    selectedSeason, onSeasonChange,
    selectedDay, onDayChange,
    onSearch,
    lang = 'vi'
}) => {
    // Dropdown Style
    const selectStyle = {
        padding: '0.6rem 2rem 0.6rem 1rem',
        fontSize: '1rem',
        borderRadius: '0.5rem',
        border: '1px solid var(--color-border)',
        backgroundColor: 'hsl(var(--color-surface))',
        color: 'hsl(var(--color-text))',
        cursor: 'pointer',
        appearance: 'none',
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right 0.5rem center',
        backgroundSize: '1em',
        fontFamily: 'inherit'
    };

    const labelStyle = {
        fontWeight: 600,
        marginRight: '0.5rem',
        whiteSpace: 'nowrap'
    };

    const groupStyle = {
        display: 'flex',
        alignItems: 'center',
    };

    const seasons = [
        { value: 'All', label: lang === 'vi' ? 'Tất cả các mùa' : 'All Seasons' },
        { value: 'ADVENT', label: lang === 'vi' ? 'Mùa Vọng' : 'Advent' },
        { value: 'CHRISTMAS', label: lang === 'vi' ? 'Mùa Giáng Sinh' : 'Christmas' },
        { value: 'LENT', label: lang === 'vi' ? 'Mùa Chay' : 'Lent' },
        { value: 'EASTER', label: lang === 'vi' ? 'Mùa Phục Sinh' : 'Easter' },
        { value: 'ORDINARY', label: lang === 'vi' ? 'Mùa Thường Niên' : 'Ordinary Time' }
    ];

    const days = [
        { value: 'All', label: lang === 'vi' ? 'Tất cả các ngày' : 'All Days' },
        { value: 0, label: lang === 'vi' ? 'Chúa Nhật' : 'Sunday' },
        { value: 1, label: lang === 'vi' ? 'Thứ Hai' : 'Monday' },
        { value: 2, label: lang === 'vi' ? 'Thứ Ba' : 'Tuesday' },
        { value: 3, label: lang === 'vi' ? 'Thứ Tư' : 'Wednesday' },
        { value: 4, label: lang === 'vi' ? 'Thứ Năm' : 'Thursday' },
        { value: 5, label: lang === 'vi' ? 'Thứ Sáu' : 'Friday' },
        { value: 6, label: lang === 'vi' ? 'Thứ Bảy' : 'Saturday' }
    ];

    return (
        <div className="filter-bar" style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1rem',
            alignItems: 'center',
            padding: '1rem',
            backgroundColor: 'hsl(var(--color-surface))',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--color-border)',
            boxShadow: 'var(--shadow-sm)',
            marginBottom: '1.5rem'
        }}>
            {/* Search - Takes full width on mobile, auto on desktop */}
            <div style={{ flexGrow: 1, minWidth: '200px', width: '100%', maxWidth: '100%' }}>
                <SearchBar onSearch={onSearch} placeholder={lang === 'vi' ? "Tìm bài hát, lễ, ngày..." : "Search..."} />
            </div>

            {/* Filters Group - Stack on mobile */}
            <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.75rem',
                alignItems: 'center',
                width: '100%',
                justifyContent: 'flex-start'
            }}>

                {/* Month Selector */}
                <div style={{ ...groupStyle, flex: '1 1 auto', minWidth: '140px' }}>
                    <span style={labelStyle}>{lang === 'vi' ? 'Tháng:' : 'Month:'}</span>
                    <select
                        style={{ ...selectStyle, flex: 1, minWidth: '100px' }}
                        value={selectedMonth}
                        onChange={(e) => onMonthChange(e.target.value)}
                    >
                        <option value="All">{lang === 'vi' ? 'Tất cả' : 'All'}</option>
                        {months.map((month, index) => (
                            <option key={index} value={month}>{month}</option>
                        ))}
                    </select>
                </div>

                {/* Season Selector */}
                <div style={{ ...groupStyle, flex: '1 1 auto', minWidth: '140px' }}>
                    <span style={labelStyle}>{lang === 'vi' ? 'Mùa:' : 'Season:'}</span>
                    <select
                        style={{ ...selectStyle, flex: 1, minWidth: '100px' }}
                        value={selectedSeason}
                        onChange={(e) => onSeasonChange(e.target.value)}
                    >
                        {seasons.map(s => (
                            <option key={s.value} value={s.value}>{s.label}</option>
                        ))}
                    </select>
                </div>

                {/* Day Selector */}
                <div style={{ ...groupStyle, flex: '1 1 auto', minWidth: '130px' }}>
                    <span style={labelStyle}>{lang === 'vi' ? 'Thứ:' : 'Day:'}</span>
                    <select
                        style={{ ...selectStyle, flex: 1, minWidth: '90px' }}
                        value={selectedDay}
                        onChange={(e) => onDayChange(e.target.value)}
                    >
                        {days.map(d => (
                            <option key={d.value} value={d.value}>{d.label}</option>
                        ))}
                    </select>
                </div>

            </div>
        </div>
    );
};

export default FilterBar;
