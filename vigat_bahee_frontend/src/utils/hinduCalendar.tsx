// utils/hinduCalendar.ts
// Accurate-ish Hindu Panchang (offline, no API)
// Based on Moon-Sun angular difference (Drik style)

const TITHI_NAMES = [
    "प्रतिपदा", "द्वितीया", "तृतीया", "चतुर्थी", "पंचमी",
    "षष्ठी", "सप्तमी", "अष्टमी", "नवमी", "दशमी",
    "एकादशी", "द्वादशी", "त्रयोदशी", "चतुर्दशी", "पूर्णिमा",
    "प्रतिपदा", "द्वितीया", "तृतीया", "चतुर्थी", "पंचमी",
    "षष्ठी", "सप्तमी", "अष्टमी", "नवमी", "दशमी",
    "एकादशी", "द्वादशी", "त्रयोदशी", "चतुर्दशी", "अमावस्या"
  ];
  
  const PAKSHA_NAMES = ["शुक्ल", "कृष्ण"];
  
  const MAAS_NAMES = [
    "चैत्र", "वैशाख", "ज्येष्ठ", "आषाढ़",
    "श्रावण", "भाद्रपद", "आश्विन", "कार्तिक",
    "मार्गशीर्ष", "पौष", "माघ", "फाल्गुन"
  ];
  
  // Julian Day
  function toJulian(date: Date): number {
    return date.getTime() / 86400000 + 2440587.5;
  }
  
  // Normalize angle 0–360
  function norm360(angle: number): number {
    return ((angle % 360) + 360) % 360;
  }
  
  // Approx Sun longitude
  function sunLongitude(jd: number): number {
    const n = jd - 2451545.0;
    const L = 280.460 + 0.9856474 * n;
    return norm360(L);
  }
  
  // Approx Moon longitude
  function moonLongitude(jd: number): number {
    const n = jd - 2451545.0;
    const L = 218.316 + 13.176396 * n;
    return norm360(L);
  }
  
  /**
   * ✅ MAIN FUNCTION
   */
  export function getAccurateHinduTithi(dateStr: string): string {
    if (!dateStr) return "";
  
    const date = new Date(dateStr + "T12:00:00"); // noon fix
    const jd = toJulian(date);
  
    const sunLon = sunLongitude(jd);
    const moonLon = moonLongitude(jd);
  
    const diff = norm360(moonLon - sunLon);
  
    const tithiIndex = Math.floor(diff / 12); // 360 / 30 = 12°
    const tithiName = TITHI_NAMES[tithiIndex];
  
    const paksha = tithiIndex < 15 ? PAKSHA_NAMES[0] : PAKSHA_NAMES[1];
  
    // Maas approx (sun longitude based)
    const maasIndex = Math.floor(sunLon / 30) % 12;
    const maasName = MAAS_NAMES[maasIndex];
  
    return `${maasName} मास, ${paksha} ${tithiName}`;
  }
  
  /**
   * Today date (YYYY-MM-DD)
   */
  export function getTodayDate(): string {
    const d = new Date();
    return d.toISOString().split("T")[0];
  }
  
  /**
   * Disallow future date
   */
  export function isValidDate(dateStr: string): boolean {
    const selected = new Date(dateStr);
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    return selected <= today;
  }  