import {generatePassword} from '@/shared/generate-password';

describe('generatePassword', () => {

    it('should generate a rondom string with 8 characters', () => {
        const pwd = generatePassword();
        expect(pwd.length).toBe(8);
        expect(pwd.match(/[0-9a-zA-Z!]{8}/)).toBeTruthy();
    });


});
