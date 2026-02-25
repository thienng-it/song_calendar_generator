import { SEASONS } from './SongDatabase.js';
import { FIXED_FEASTS } from './SpecialDates.js';

// Helper to check if a date is between two dates (inclusive)
const isBetween = (date, start, end) => {
    return date >= start && date <= end;
};

// Calculate Easter Sunday for a given year (Western Calendar - Gregorian)
// Using anonymous algorithm
const getEasterDate = (year) => {
    const f = Math.floor,
        G = year % 19,
        C = f(year / 100),
        H = (C - f(C / 4) - f((8 * C + 13) / 25) + 19 * G + 15) % 30,
        I = H - f(H / 28) * (1 - f(29 / (H + 1)) * f((21 - G) / 11)),
        J = (year + f(year / 4) + I + 2 - C + f(C / 4)) % 7,
        L = I - J,
        month = 3 + f((L + 40) / 44),
        day = L + 28 - 31 * f(month / 4);

    return new Date(year, month - 1, day);
};

export const getLiturgicalSeason = (date) => {
    const year = date.getFullYear();

    // Fixed dates
    const christmas = new Date(year, 11, 25); // Dec 25
    const epiphany = new Date(year, 0, 6); // Jan 6 (Simplified)

    // Easter variable dates
    const easter = getEasterDate(year);
    const ashWednesday = new Date(easter);
    ashWednesday.setDate(easter.getDate() - 46);

    const pentecost = new Date(easter);
    pentecost.setDate(easter.getDate() + 49);

    // Advent: 4 Sundays before Christmas
    // Simplified: Dec 1st to Dec 24th roughly covers most
    // Accurate: Sunday closest to Nov 30
    const christmasDayOfWeek = new Date(year, 11, 25).getDay();
    const daysToAdvent = (christmasDayOfWeek === 0 ? 7 : christmasDayOfWeek) + 21;
    // Actually simpler: 4th Sunday before Xmas.
    // Let's just use simplified "Late Nov/Dec" logic or fixed for now if acceptable, 
    // but let's try to be slightly dynamic.
    // Advent starts on the Sunday closest to St. Andrew (Nov 30).
    // Range: Nov 27 - Dec 3.
    const nov30 = new Date(year, 10, 30);
    const adventStart = new Date(nov30);
    adventStart.setDate(nov30.getDate() - nov30.getDay()); // Previous Sunday (or today if Sunday)
    if (adventStart.getDate() > 30 || adventStart.getMonth() !== 10) {
        // Ensure it's nearest Sunday
        // If Nov 30 is Mon(1), minus 1 -> Nov 29.
        // If Nov 30 is Thu(4), minus 4 -> Nov 26.
        // If Nov 30 is Sun(0), minus 0 -> Nov 30.
        // Wait, rule is: Sunday closest to Nov 30.
        // If Nov 30 is Mon, closest Sunday is Nov 29? No, Sunday Dec 3 is further. 
        // Actually Advent starts 4 Sundays before Dec 25.
    }

    // Re-calc Advent start accurately: 4 Sundays before Dec 25.
    const fourthSundayAdvent = new Date(year, 11, 25); // Start at Xmas
    fourthSundayAdvent.setDate(fourthSundayAdvent.getDate() - fourthSundayAdvent.getDay()); // Go back to Sunday before Xmas (4th Sunday)
    if (fourthSundayAdvent.getDate() === 25) { // If Xmas is Sunday, 4th Sunday is Dec 18? No. 
        // If Xmas is Sunday, the 4th Sunday of Advent is Dec 18.
        // Let's just follow: 4 Sundays before Christmas.
        fourthSundayAdvent.setDate(fourthSundayAdvent.getDate() - 7);
    }
    const firstSundayAdvent = new Date(fourthSundayAdvent);
    firstSundayAdvent.setDate(firstSundayAdvent.getDate() - 21);


    // --- Logic Checks ---

    // ADVENT
    if (date >= firstSundayAdvent && date < christmas) {
        return SEASONS.ADVENT;
    }

    // CHRISTMAS (Dec 25 - Epiphany/Baptism)
    // Check end of year part
    if (date >= christmas) {
        return SEASONS.CHRISTMAS;
    }
    // Check start of year part (until approx mid Jan)
    // Actually checking "Last year's Xmas season" at start of year is tricky if we just pass `date`.
    // We should handle the year transition. 
    // If date is Jan, check if before Epiphany+1
    if (date.getMonth() === 0 && date.getDate() <= 12) { // Rough estimate for Baptism of Lord
        return SEASONS.CHRISTMAS;
    }

    // LENT (Ash Wed to Holy Thursday)
    if (date >= ashWednesday && date < easter) {
        return SEASONS.LENT;
    }

    // EASTER (Easter to Pentecost)
    if (date >= easter && date <= pentecost) {
        return SEASONS.EASTER;
    }

    // Ordinary Time
    return SEASONS.ORDINARY;
};


export const getDayInfo = (date) => {
    const season = getLiturgicalSeason(date);
    const dayOfWeek = date.getDay(); // 0 is Sun, 6 is Sat

    // Check Fixed Feasts
    // Month is 0-indexed in JS, so +1 for string format
    const dateKey = `${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    const fixedFeast = FIXED_FEASTS[dateKey];

    // Determine Gloria (Kinh Vinh Danh)
    let hasGloria = false;
    let notes = [];

    // Rule 1: Sundays outside Advent/Lent (User excludes Sunday, but good logic to have)
    if (dayOfWeek === 0 && season !== SEASONS.ADVENT && season !== SEASONS.LENT) {
        hasGloria = true;
    }

    // Rule 2: Solemnities and Feasts
    if (fixedFeast) {
        if (fixedFeast.gloria) hasGloria = true;
        notes.push(fixedFeast.name);
    }

    // Variable Feasts Based on Easter
    const year = date.getFullYear();
    const easter = getEasterDate(year);

    // Calculate Variable Dates
    const palmSunday = new Date(easter);
    palmSunday.setDate(easter.getDate() - 7);

    const holyThursday = new Date(easter);
    holyThursday.setDate(easter.getDate() - 3);

    const goodFriday = new Date(easter);
    goodFriday.setDate(easter.getDate() - 2);

    // Vietnamese standard: Ascension is 7th Sunday of Easter (42 days after Easter)
    const ascension = new Date(easter);
    ascension.setDate(easter.getDate() + 42);

    const pentecost = new Date(easter);
    pentecost.setDate(easter.getDate() + 49);

    const holyTrinity = new Date(easter);
    holyTrinity.setDate(easter.getDate() + 56);

    // Vietnamese standard: Corpus Christi is Sunday after Trinity Sunday (63 days after Easter)
    const corpusChristi = new Date(easter);
    corpusChristi.setDate(easter.getDate() + 63);

    // Sacred Heart is Friday after 2nd Sunday after Pentecost (68 days after Easter)
    const sacredHeart = new Date(easter);
    sacredHeart.setDate(easter.getDate() + 68);

    // Christ the King is the Sunday before the 1st Sunday of Advent
    const christmasDayOfWeek = new Date(year, 11, 25).getDay();
    const christTheKing = new Date(year, 11, 25);
    christTheKing.setDate(christTheKing.getDate() - christmasDayOfWeek - 28); // 4 Sundays before Xmas, minus 7 days

    // Check Variable Feasts Matches
    const checkDateMatches = (d1, d2) => {
        return d1.getFullYear() === d2.getFullYear() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getDate() === d2.getDate();
    }

    if (checkDateMatches(date, palmSunday)) {
        notes.push("Lễ Lá");
        hasGloria = false;
    } else if (checkDateMatches(date, holyThursday)) {
        notes.push("Thứ Năm Tuần Thánh (Thánh Lễ Tiệc Ly)");
        hasGloria = true;
    } else if (checkDateMatches(date, goodFriday)) {
        notes.push("Thứ Sáu Tuần Thánh (Tưởng Niệm Cuộc Thương Khó)");
        hasGloria = false;
    } else if (checkDateMatches(date, easter)) {
        notes.push("Đại Lễ Phục Sinh (Lễ Trọng)");
        hasGloria = true;
    } else if (checkDateMatches(date, ascension)) {
        notes.push("Chúa Lên Trời (Lễ Trọng)");
        hasGloria = true;
    } else if (checkDateMatches(date, pentecost)) {
        notes.push("Chúa Thánh Thần Hiện Xuống (Lễ Trọng)");
        hasGloria = true;
    } else if (checkDateMatches(date, holyTrinity)) {
        notes.push("Chúa Ba Ngôi (Lễ Trọng)");
        hasGloria = true;
    } else if (checkDateMatches(date, corpusChristi)) {
        notes.push("Mình Máu Thánh Chúa (Lễ Trọng)");
        hasGloria = true;
    } else if (checkDateMatches(date, sacredHeart)) {
        notes.push("Thánh Tâm Chúa Giêsu (Lễ Trọng)");
        hasGloria = true;
    } else if (checkDateMatches(date, christTheKing)) {
        notes.push("Chúa Giêsu Vua (Lễ Trọng)");
        hasGloria = true;
    }

    // Rule 3: Easter Octave (Monday to Saturday after Easter)
    const octaveEnd = new Date(easter);
    octaveEnd.setDate(easter.getDate() + 7); // Until Divine Mercy Sunday

    // Check Christmas Octave (Dec 25 - Jan 1)
    if (date.getMonth() === 11 && date.getDate() >= 25) hasGloria = true; // Dec 25-31
    if (date.getMonth() === 0 && date.getDate() === 1) hasGloria = true; // Jan 1

    if (date > easter && date < octaveEnd) {
        hasGloria = true;
        notes.push("Bát Nhật Phục Sinh");
    }

    // Check Ash Wednesday
    const ashWed = new Date(easter);
    ashWed.setDate(easter.getDate() - 46);
    if (date.getTime() === ashWed.getTime()) {
        notes.push("Lễ Tro - Giữ Chay");
    }

    return {
        date: date,
        dayIndex: dayOfWeek,
        season: season,
        isSunday: dayOfWeek === 0,
        validForSchedule: dayOfWeek !== 0,
        hasGloria: hasGloria,
        isFeast: !!fixedFeast || notes.length > 0,
        notes: notes
    };
};
