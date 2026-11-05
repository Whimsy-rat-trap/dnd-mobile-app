/**
 * Генерирует уникальный id.
 * Если доступен crypto.randomUUID — использует его.
 * Иначе — timestamp + random (fallback для старых браузеров).
 *
 * Префикс опционален — используется для отладки и читаемости.
 */
export function newId(prefix?: string): string {
    const rand = (typeof crypto !== 'undefined' && 'randomUUID' in crypto)
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    return prefix ? `${prefix}-${rand}` : rand;
}