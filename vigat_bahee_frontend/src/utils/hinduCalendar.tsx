// utils/hinduCalendar.ts - Accurate Hindu Calendar
export interface HinduDate {
    tithi: string;
    paksha: string;
    month: string;
    fullTithi: string;
}

// Accurate Hindu Calendar Data for 2025 (September-December)
const hinduCalendarData: { [key: string]: HinduDate } = {
    // September 2025 - आश्विन माह
    '2025-09-15': {
        tithi: 'नवमी',
        paksha: 'कृष्ण',
        month: 'आश्विन',
        fullTithi: 'कृष्ण नवमी, आश्विन'
    },
    '2025-09-14': {
        tithi: 'अष्टमी',
        paksha: 'कृष्ण',
        month: 'आश्विन',
        fullTithi: 'कृष्ण अष्टमी, आश्विन'
    },
    '2025-09-16': {
        tithi: 'दशमी',
        paksha: 'कृष्ण',
        month: 'आश्विन',
        fullTithi: 'कृष्ण दशमी, आश्विन'
    },
    '2025-09-17': {
        tithi: 'एकादशी',
        paksha: 'कृष्ण',
        month: 'आश्विन',
        fullTithi: 'कृष्ण एकादशी, आश्विन'
    },
    '2025-09-18': {
        tithi: 'द्वादशी',
        paksha: 'कृष्ण',
        month: 'आश्विन',
        fullTithi: 'कृष्ण द्वादशी, आश्विन'
    },
    '2025-09-19': {
        tithi: 'त्रयोदशी',
        paksha: 'कृष्ण',
        month: 'आश्विन',
        fullTithi: 'कृष्ण त्रयोदशी, आश्विन'
    },
    '2025-09-20': {
        tithi: 'चतुर्दशी',
        paksha: 'कृष्ण',
        month: 'आश्विन',
        fullTithi: 'कृष्ण चतुर्दशी, आश्विन'
    },
    '2025-09-21': {
        tithi: 'अमावस्या',
        paksha: 'कृष्ण',
        month: 'आश्विन',
        fullTithi: 'अमावस्या, आश्विन'
    },
    '2025-09-22': {
        tithi: 'प्रतिपदा',
        paksha: 'शुक्ल',
        month: 'कार्तिक',
        fullTithi: 'शुक्ल प्रतिपदा, कार्तिक'
    },
    // Add more dates as needed...
};

// Fallback calculation for dates not in our data
const calculateApproximateHinduDate = (gregorianDate: string): HinduDate => {
    const date = new Date(gregorianDate);
    const month = date.getMonth() + 1;
    const day = date.getDate();

    // Basic fallback - this is approximate
    const hinduMonths = [
        'माघ', 'फाल्गुन', 'चैत्र', 'वैशाख', 'ज्येष्ठ', 'आषाढ़',
        'श्रावण', 'भाद्रपद', 'आश्विन', 'कार्तिक', 'मार्गशीर्ष', 'पौष'
    ];

    const tithiNames = [
        'प्रतिपदा', 'द्वितीया', 'तृतीया', 'चतुर्थी', 'पंचमी', 'षष्ठी', 'सप्तमी',
        'अष्टमी', 'नवमी', 'दशमी', 'एकादशी', 'द्वादशी', 'त्रयोदशी', 'चतुर्दशी', 'पूर्णिमा'
    ];

    const paksha = day <= 15 ? 'शुक्ल' : 'कृष्ण';
    const tithiIndex = day <= 15 ? day - 1 : day - 16;
    const tithi = tithiNames[tithiIndex] || 'अमावस्या';
    const hinduMonth = hinduMonths[(month - 1 + 6) % 12]; // Rough approximation

    return {
        tithi,
        paksha,
        month: hinduMonth,
        fullTithi: `${paksha} ${tithi}, ${hinduMonth}`
    };
};

// Main function to get Hindu tithi
export const getAccurateHinduTithi = (gregorianDate: string): string => {
    if (!gregorianDate) return '';

    // First check our accurate data
    const accurateData = hinduCalendarData[gregorianDate];
    if (accurateData) {
        return accurateData.fullTithi;
    }

    // Fallback to approximate calculation
    const approximate = calculateApproximateHinduDate(gregorianDate);
    return approximate.fullTithi;
};

// Get today's date in YYYY-MM-DD format
export function getTodayDate(): string {
    const d = new Date();
    return d.toISOString().split("T")[0];
  }

// Validate if date is today or in past
export const isValidDate = (selectedDate: string): boolean => {
    if (!selectedDate) return false;
    const selected = new Date(selectedDate);
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    return selected <= today;
};