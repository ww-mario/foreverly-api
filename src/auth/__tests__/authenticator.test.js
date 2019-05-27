const testUsername = 'dan';
const testPassword = 'testpass';
const testUserId = 1;

const mockGetUserByUsername = jest.fn();

// Mock user manager to avoid DB connections
jest.mock(
    '../../users/userManager',
    () =>
        class MockUserManager {
            static async getUserByUsername(username) {
                return mockGetUserByUsername(username);
            }
        }
);

// Mock bcrypt.compare so we always pass hash checks
jest.mock('bcrypt', () => ({
    compare: jest.fn(() => Promise.resolve(true))
}));

import bcrypt from 'bcrypt';

import Authenticator from '../authenticator';

describe('Authenticator', () => {
    test('token creation returns a string', () => {
        const token = Authenticator.createToken(testUsername, 123);
        expect(typeof token === 'string').toBe(true);
    });

    describe('Authenticator.login()', () => {
        let tokenSpy;

        beforeEach(() => {
            tokenSpy = jest.spyOn(Authenticator, 'createToken');
            tokenSpy.mockClear();
            bcrypt.compare.mockClear();
        });

        test('login will generate a token for a correct user', async () => {
            mockGetUserByUsername.mockImplementation(() => ({
                user_id: testUserId,
                password: testPassword
            }));

            const token = await Authenticator.login(testUsername, testPassword);
            expect(typeof token === 'string').toBe(true);

            expect(mockGetUserByUsername).toBeCalledWith(testUsername);
            // Make sure we compare hashes
            expect(bcrypt.compare).toBeCalledWith(testPassword, testPassword);
            // Make sure we're generating a token
            expect(tokenSpy).toBeCalled();
        });

        test('login will fail if no user is returned from `UserManager.getUserByUsername()`', async () => {
            mockGetUserByUsername.mockImplementation(() => undefined);

            const token = await Authenticator.login(testUsername, testPassword);

            expect(token).toBeNull();

            // Make sure we're not trying to compare a password or generating a token
            expect(bcrypt.compare).not.toBeCalled();
            expect(tokenSpy).not.toBeCalled();
        });

        test('login will fail if the password hash check fails', async () => {
            // Make `bcrypt.compare` fail the hash check
            bcrypt.compare.mockImplementation(() => Promise.resolve(false));

            const token = await Authenticator.login(testUsername, testPassword);

            expect(token).toBeNull();

            // Make sure we don't generate a token when check fails
            expect(tokenSpy).not.toBeCalled();
        });
    });

    describe('Authenticator.decodeToken()', () => {
        test('token decode will throw if token is blank or incorrect', () => {
            const failingValues = [false, null, '', undefined, 'invalidtoken'];

            const expectedError = new Error('Invalid JWT');

            // 2 assertions per failing value, and an extra one for `console.error` calls
            expect.assertions(failingValues.length * 2 + 1);

            console.error = jest.fn();

            for (let value in failingValues) {
                try {
                    let res = Authenticator.decodeToken(value);
                } catch (e) {
                    expect(e).toEqual(expectedError);
                    expect(e.statusCode).toEqual(403);
                }
            }

            expect(console.error).toBeCalledTimes(failingValues.length);
        });

        test('a token generated with `Authenticator.createToken()` can be decoded correctly', () => {
            const correctToken = Authenticator.createToken(
                testUsername,
                testUserId
            );

            const result = Authenticator.decodeToken(correctToken);

            expect(result).toMatchObject({
                username: testUsername,
                userId: testUserId
            });
        });
    });
});
