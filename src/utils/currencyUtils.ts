export interface Currency {
    gp: number;
    sp: number;
    cp: number;
}

export const EMPTY_CURRENCY: Currency = { gp: 0, sp: 0, cp: 0 };

// 1 gp = 10 sp = 100 cp
const CP_PER_SP = 10;
const CP_PER_GP = 100;

/**
 * Переводит { gp, sp, cp } в медяки.
 */
export const toCopper = (c: Currency): number => {
    return (c.gp || 0) * CP_PER_GP + (c.sp || 0) * CP_PER_SP + (c.cp || 0);
};

/**
 * Переводит медяки в { gp, sp, cp }.
 * Отрицательное значение зажимается в 0.
 */
export const fromCopper = (copper: number): Currency => {
    const safe = Math.max(0, Math.floor(copper));
    return {
        gp: Math.floor(safe / CP_PER_GP),
        sp: Math.floor((safe % CP_PER_GP) / CP_PER_SP),
        cp: safe % CP_PER_SP,
    };
};

/**
 * Нормализует валюту: 12 sp → 1 gp 2 sp, 150 cp → 1 gp 5 sp.
 */
export const normalizeCurrency = (c: Currency): Currency => {
    return fromCopper(toCopper(c));
};

/**
 * Сложение двух сумм.
 */
export const addCurrency = (a: Currency, b: Currency): Currency => {
    return fromCopper(toCopper(a) + toCopper(b));
};

/**
 * Вычитание. Возвращает { result, ok } — если денег не хватает,
 * ok === false и result = исходная сумма (не меняется).
 *
 * Если хотите разрешить «долг», используйте `subtractCurrencyRaw` ниже.
 */
export const subtractCurrency = (
    a: Currency,
    b: Currency
): { result: Currency; ok: boolean } => {
    const aCp = toCopper(a);
    const bCp = toCopper(b);
    if (bCp > aCp) {
        return { result: normalizeCurrency(a), ok: false };
    }
    return { result: fromCopper(aCp - bCp), ok: true };
};

/**
 * Вычитание без проверки (с зажимом в 0). Используется, например,
 * когда нужно отобразить «сколько бы осталось».
 */
export const subtractCurrencyRaw = (a: Currency, b: Currency): Currency => {
    return fromCopper(Math.max(0, toCopper(a) - toCopper(b)));
};

/**
 * Форматирование валюты в строку. Пропускает нулевые деноминации.
 */
export const formatCurrency = (c: Currency): string => {
    const n = normalizeCurrency(c);
    const parts: string[] = [];
    if (n.gp) parts.push(`${n.gp} gp`);
    if (n.sp) parts.push(`${n.sp} sp`);
    if (n.cp) parts.push(`${n.cp} cp`);
    return parts.join(' ') || '0 gp';
};

/**
 * Есть ли ненулевая сумма.
 */
export const isNonEmpty = (c?: Currency): c is Currency => {
    if (!c) return false;
    return (c.gp || 0) > 0 || (c.sp || 0) > 0 || (c.cp || 0) > 0;
};

/**
 * Парсит строку вида "50 gp", "1 gp 5 sp", "100 cp" в Currency.
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

    return found ? normalizeCurrency(result) : null;
};

/**
 * Извлекает валюту из описания предмета.
 * Ловит только контексты с предлогами: "with / contains / holds".
 */
export const extractCurrencyFromDescription = (
    description?: string
): Currency | null => {
    if (!description) return null;
    const re = /(?:with|contains?|holds?)\s+(\d+)\s*(gp|sp|cp)/gi;
    let match: RegExpExecArray | null;
    const result: Currency = { gp: 0, sp: 0, cp: 0 };
    let found = false;

    while ((match = re.exec(description)) !== null) {
        const amount = parseInt(match[1], 10);
        const unit = match[2].toLowerCase();
        if (unit === 'gp') result.gp += amount;
        else if (unit === 'sp') result.sp += amount;
        else if (unit === 'cp') result.cp += amount;
        found = true;
    }

    return found ? normalizeCurrency(result) : null;
};

/**
 * Единая проверка: является ли предмет «предметом-деньгами».
 * Порядок приоритета: явное поле → поле из библиотеки → парсинг описания.
 */
export const resolveItemCurrency = (item: {
    currency?: Currency;
    description?: string;
}): Currency | null => {
    if (item.currency && isNonEmpty(item.currency)) {
        return normalizeCurrency(item.currency);
    }
    return extractCurrencyFromDescription(item.description);
};