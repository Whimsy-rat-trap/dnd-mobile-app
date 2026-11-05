/**
 * Группирует элементы по числовому полю `level`.
 * Возвращает Map<level, items[]>, отсортированный по возрастанию уровня.
 *
 * Работает с любым объектом, у которого есть `level: number`
 * (Spell, SpellData, что угодно).
 */
export function groupByLevel<T extends { level: number }>(items: T[]): Map<number, T[]> {
    const map = new Map<number, T[]>();
    for (const item of items) {
        if (!map.has(item.level)) map.set(item.level, []);
        map.get(item.level)!.push(item);
    }
    return new Map(
        Array.from(map.entries()).sort((a, b) => a[0] - b[0])
    );
}