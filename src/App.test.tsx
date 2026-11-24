import { getModifier } from './utils/characterUtils';

describe('getModifier', () => {
    it('returns 0 for score 10', () => {
        expect(getModifier(10)).toBe(0);
    });
    it('returns +2 for score 14', () => {
        expect(getModifier(14)).toBe(2);
    });
    it('returns -1 for score 8', () => {
        expect(getModifier(8)).toBe(-1);
    });
});
