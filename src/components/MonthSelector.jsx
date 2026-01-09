import React from 'react';

const MonthSelector = ({ selectedMonth, onMonthChange, months, lang = 'vi' }) => {
    return (
        <div className="month-selector" style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <label htmlFor="month-select" style={{ fontWeight: 600 }}>Tháng:</label>
            <div className="select-wrapper" style={{ position: 'relative' }}>
                <select
                    id="month-select"
                    value={selectedMonth}
                    onChange={(e) => onMonthChange(e.target.value)}
                    style={{
                        padding: '0.5rem 2rem 0.5rem 1rem',
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
                        minWidth: '150px'
                    }}
                >
                    <option value="All">{lang === 'vi' ? 'Tất cả các tháng' : 'All Months'}</option>
                    {months.map((month, index) => (
                        <option key={index} value={month}>{month}</option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export default MonthSelector;
