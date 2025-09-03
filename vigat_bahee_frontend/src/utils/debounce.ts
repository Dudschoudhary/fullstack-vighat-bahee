// utils/debounce.ts
export const debounce = <T extends (...args: any[]) => any>(
    func: T,
    delay: number
  ): ((...args: Parameters<T>) => void) => {
    let timeoutId: NodeJS.Timeout;
    
    return (...args: Parameters<T>) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };
  
  export const getHinduTithi = (date: string): string => {
    if (!date) return '';
    const selectedDate = new Date(date);
    const day = selectedDate.getDate();
    const tithiNames = [
      'प्रतिपदा','द्वितीया','तृतीया','चतुर्थी','पंचमी','षष्ठी','सप्तमी','अष्टमी',
      'नवमी','दशमी','एकादशी','द्वादशी','त्रयोदशी','चतुर्दशी','पूर्णिमा'
    ];
    const paksha = day <= 15 ? 'शुक्ल' : 'कृष्ण';
    const tithiIndex = day <= 15 ? day - 1 : day - 16;
    const tithiName = tithiNames[tithiIndex] || tithiNames[0];
    return `${paksha} ${tithiName}`;
  };  