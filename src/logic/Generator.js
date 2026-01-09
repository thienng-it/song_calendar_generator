import { SONGS } from './SongDatabase.js';
import { getDayInfo } from './LiturgicalCalendar.js';

// Simple seeded random number generator (Mulberry32)
const mulberry32 = (a) => {
    return () => {
        var t = a += 0x6D2B79F5;
        t = Math.imul(t ^ t >>> 15, t | 1);
        t ^= t + Math.imul(t ^ t >>> 7, t | 61);
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }
}

export const generateSchedule = (year, seed = Date.now()) => {
    const schedule = [];
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31);

    // Initialize seeded RNG
    // Ensure seed is an integer
    const rng = mulberry32(parseInt(seed) || Date.now());

    // Iterate through every day of the year
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        const currentDate = new Date(d); // Copy date
        const dayInfo = getDayInfo(currentDate);

        // Skip Sundays as requested ("Sunday is not included")
        if (!dayInfo.validForSchedule) {
            continue;
        }

        // Select Songs
        const songs = selectSongsForDay(dayInfo, rng);

        schedule.push({
            date: currentDate,
            dayInfo: dayInfo,
            songs: songs
        });
    }

    return schedule;
};

const selectSongsForDay = (dayInfo, rng) => {
    // Filter songs by Season (or Generic/Ordinary if season specific not found enough)
    const seasonSongs = SONGS.filter(s => s.season === dayInfo.season || s.season === 'ORDINARY');

    // Need 1 NL, 1 DL, 1 HL, 1 KL
    const nl = getRandomSong(seasonSongs, 'NL', rng);
    const dl = getRandomSong(seasonSongs, 'DL', rng);
    const hl = getRandomSong(seasonSongs, 'HL', rng);
    const kl = getRandomSong(seasonSongs, 'KL', rng);

    return {
        NL: nl,
        DL: dl,
        HL: hl,
        KL: kl
    };
};

const getRandomSong = (pool, tag, rng) => {
    const candidates = pool.filter(s => s.tags.includes(tag));
    if (candidates.length === 0) return null;
    // Use seeded rng if provided, else Math.random
    const randomVal = rng ? rng() : Math.random();
    const randomIndex = Math.floor(randomVal * candidates.length);
    return candidates[randomIndex];
};

export const getAlternativeSong = (dayInfo, slot, currentSongId) => {
    const seasonSongs = SONGS.filter(s => s.season === dayInfo.season || s.season === 'ORDINARY');
    const candidates = seasonSongs.filter(s => s.tags.includes(slot));

    // Filter out current song to ensure variety if possible
    const others = candidates.filter(s => !currentSongId || s.id !== currentSongId);

    if (others.length > 0) {
        const randomIndex = Math.floor(Math.random() * others.length);
        return others[randomIndex];
    }

    // Fallback if no other option
    if (candidates.length > 0) {
        const randomIndex = Math.floor(Math.random() * candidates.length);
        return candidates[randomIndex];
    }
    return null;
};
