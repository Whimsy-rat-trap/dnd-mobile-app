export interface Currency {
    gp: number;
    sp: number;
    cp: number;
}

export const EMPTY_CURRENCY: Currency = { gp: 0, sp: 0, cp: 0 };

export const addCurrency = (a: Currency, b: Currency): Currency => ({
    gp: (a.gp || 0) + (b.gp || 0),
    sp: (a.sp || 0) + (b.sp || 0),
    cp: (a.cp || 0) + (b.cp || 0),
});

export const subtractCurrency = (a: Currency, b: Currency): Currency => ({
    gp: Math.max(0, (a.gp || 0) - (b.gp || 0)),
    sp: Math.max(0, (a.sp || 0) - (b.sp || 0)),
    cp: Math.max(0, (a.cp || 0) - (b.cp || 0)),
});

export const formatCurrency = (c: Currency): string => {
    const parts: string[] = [];
    if (c.gp) parts.push(`${c.gp} gp`);
    if (c.sp) parts.push(`${c.sp} sp`);
    if (c.cp) parts.push(`${c.cp} cp`);
    return parts.join(' ') || '0 gp';
};

export const isNonEmpty = (c?: Currency): c is Currency => {
    if (!c) return false;
    return (c.gp || 0) > 0 || (c.sp || 0) > 0 || (c.cp || 0) > 0;
};

/**
 * Парсит строку типа "50 gp" или "1 gp 5 sp" в структуру Currency.
 * Возвращает null, если не удалось распарсить.
 */
export const parseCurrencyString = (value?: string): Currency | null => {
    if (!value) return null;
    const re = /(\d+)\s*(gp|sp|cp)/gi;
    let match: RegExpExecArray | null;
    const result: Currency = { gp: 0, sp: 0, cp: 0 };
    let found = false;

    while ((match = re.exec(value)) !== null) {
        const amount = parseInt(match[1], 10);
        const unit = match[2].toLowerCase();
        if (unit === 'gp') result.gp += amount;
        else if (unit === 'sp') result.sp += amount;
        else if (unit === 'cp') result.cp += amount;
        found = true;
    }

    return found ? result : null;
};