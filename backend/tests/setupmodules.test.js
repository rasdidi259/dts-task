/**
 * author       :Applicant
 * date         :30/01/2026
 * decription   :A test suite for the authentication middleware (ensureAuth and ensureGuest) in a Node.js application using Jest.
 *              - ensureAuth: Verifies that the user is authenticated. If not, it redirects to the home page.
 *              - ensureGuest: Verifies that the user is NOT authenticated. If they are, it redirects to the home page.
 */

const {ensureAuth, ensureGuest} = require('../config/setupmodules'); // Path to your file

describe('Auth Middleware', () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    // Mock the request object with Passport's isAuthenticated method
    req = {
      isAuthenticated: jest.fn()
    };
    // Mock the response object with a redirect method
    res = {
      redirect: jest.fn()
    };
    // Mock the next function
    next = jest.fn();
  });

  describe('ensureAuth', () => {
    it('should call next() if user is authenticated', () => {
      req.isAuthenticated.mockReturnValue(true);

      ensureAuth(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.redirect).not.toHaveBeenCalled();
    });

    it('should redirect to "/" if user is NOT authenticated', () => {
      req.isAuthenticated.mockReturnValue(false);

      ensureAuth(req, res, next);

      expect(res.redirect).toHaveBeenCalledWith('/');
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('ensureGuest', () => {
    it('should redirect to "/" if user is authenticated', () => {
      req.isAuthenticated.mockReturnValue(true);

      ensureGuest(req, res, next);

      expect(res.redirect).toHaveBeenCalledWith('/');
      expect(next).not.toHaveBeenCalled();
    });

    it('should call next() if user is NOT authenticated', () => {
      req.isAuthenticated.mockReturnValue(false);

      ensureGuest(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.redirect).not.toHaveBeenCalled();
    });
  });
});
