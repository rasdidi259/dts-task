/**
 * author       :Applicant
 * date         : 30/03/2026
 * decription   :A test suite for the authentication middleware (auth) in a Node.js application using Jest.
 *              - auth: Verifies the presence and validity of a JWT token in the request header. If valid, it populates req.user with the decoded token payload. If not, it returns appropriate error responses.
 */

const auth = require('../../middleware/auth'); // Path to your middleware
const jwt = require('jsonwebtoken');

describe('auth middleware', () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    // Reset req, res, and next for every test
    req = {
      header: jest.fn()
    };
    res = {
      status: jest.fn().mockReturnValue({
        send: jest.fn()
      })
    };
    next = jest.fn();
    process.env.JWT_PRIVATE_KEY = 'test_key';
  });

  it('should return 401 if no token is provided', () => {
    req.header.mockReturnValue(null); // Simulate no header

    auth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.status().send).toHaveBeenCalledWith(expect.stringContaining('No token provided'));
  });

  it('should return 400 if token is invalid', () => {
    req.header.mockReturnValue('invalid-token');

    auth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.status().send).toHaveBeenCalledWith('Invalid Token.');
  });

  it('should populate req.user and call next() with a valid token', () => {
    const user = { _id: '123', name: 'Test User' };
    const token = jwt.sign(user, process.env.JWT_PRIVATE_KEY);
    req.header.mockReturnValue(token);

    auth(req, res, next);

    expect(req.user).toMatchObject(user);
    expect(next).toHaveBeenCalled();
  });
});
