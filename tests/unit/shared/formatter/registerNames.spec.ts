import {formatRegisterName} from '@/shared/formatter/registerNames';

describe('registerNamesFormatter', () => {

    it('should format a registername without the name', () => {
        const formatted = formatRegisterName('010060320003');
        expect(formatted).toEqual('Minimale Chiptemperatur');
    });

    it('should format a registername with the name', () => {
        const formatted = formatRegisterName('010060320003', true);
        expect(formatted).toEqual('010060320003 - Minimale Chiptemperatur');
    });

    it('should use the name if there is no human readable name configured', () => {
        const formatted = formatRegisterName('0000a000');
        expect(formatted).toEqual('0000A000');
    });
});
