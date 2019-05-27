import authMiddleware from '../authMiddleware';
import Authenticator from '../authenticator';

const expectInvalidJWT = e => {
    expect(e.message).toBe('Invalid JWT');
    expect(e.statusCode).toBe(403);
};

describe('authMiddleware', () => {
    test('it fails if no token is provided', () => {
        const fakeRequest = {
            headers: {}
        };

        expect.assertions(3);

        const fakeHandler = jest.fn();

        try {
            authMiddleware(fakeRequest, null, fakeHandler);
        } catch (e) {
            expect(fakeHandler).not.toBeCalled();
            expectInvalidJWT(e);
        }
    });

    test('it fails if the token is invalid', () => {
        const fakeRequest = {
            headers: {
                authorization: 'JWT thisisafaketoken'
            }
        };

        expect.assertions(3);

        const fakeHandler = jest.fn();

        try {
            authMiddleware(fakeRequest, null, fakeHandler);
        } catch (e) {
            expect(fakeHandler).not.toBeCalled();
            expectInvalidJWT(e);
        }
    });

    test('it succeeds with a valid token', () => {
        const testUsername = 'dan';
        const testUserId = 1;

        const validToken = Authenticator.createToken(testUsername, testUserId);

        const fakeRequest = {
            headers: {
                authorization: `JWT ${validToken}`
            }
        };

        const fakeHandler = jest.fn();

        authMiddleware(fakeRequest, null, fakeHandler);

        expect(fakeHandler).toBeCalled();
        expect(fakeRequest.currentUser).toMatchObject({
            username: testUsername,
            userId: testUserId
        });
    });
});
