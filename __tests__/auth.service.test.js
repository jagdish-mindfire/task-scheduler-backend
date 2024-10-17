// user.service.test.js
const userService = require('../services/user.service');
const userRepository = require('../repository/user.repo');
const tokenRepository = require('../repository/token.repo');
const passwordHelper = require('../utils/password');
const bcrypt = require('bcrypt');
const TOKEN_LIB = require('../utils/token');
const sessionHelper = require('../utils/session');
const { APIError } = require('../utils/custom-errors');
const constantErrors = require('../constants/errors');
const constantStrings = require('../constants/strings');

// Mock dependencies
jest.mock('../repository/user.repo');
jest.mock('../repository/token.repo');
jest.mock('../utils/password');
jest.mock('../utils/session');
jest.mock('bcrypt');
jest.mock('../utils/token');

describe('User Service', () => {
  const email = 'test@example.com';
  const name = 'Test User';
  const password = 'password123';
  const uid = 'user123';
  const refresh_token = 'valid-refresh-token';
  const encryptedPassword = 'hashed-password';
  const sessionId = 'session123';

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Test: signup
  describe('signup', () => {
    test('should create a user when email does not exist', async () => {
      userRepository.findUser.mockResolvedValue(null);
      passwordHelper.encryptePassword.mockReturnValue(encryptedPassword);
      userRepository.createUser.mockResolvedValue();

      const result = await userService.signup({ email, name, password });

      expect(userRepository.findUser).toHaveBeenCalledWith({ email });
      expect(passwordHelper.encryptePassword).toHaveBeenCalledWith(password);
      expect(userRepository.createUser).toHaveBeenCalledWith({
        email,
        name,
        password: encryptedPassword,
      });
      expect(result).toEqual({ message: constantStrings.USER_CREATED });
    });

    test('should throw APIError when email already exists', async () => {
      userRepository.findUser.mockResolvedValue({ email });

      await expect(userService.signup({ email, name, password }))
        .rejects.toThrow(new APIError(constantErrors.EMAIL_ALREADY_EXISTS));

      expect(userRepository.findUser).toHaveBeenCalledWith({ email });
    });
  });

  // Test: login
  describe('login', () => {
    test('should return refresh token and user name on successful login', async () => {
      const user = { _id: uid, name, password: encryptedPassword };
      userRepository.findUser.mockResolvedValue(user);
      bcrypt.compare.mockResolvedValue(true);
      const tokenInstance = { createRefreshToken: jest.fn().mockResolvedValue(refresh_token) };
      TOKEN_LIB.mockImplementation(() => tokenInstance);

      const result = await userService.login({ email, password });

      expect(userRepository.findUser).toHaveBeenCalledWith({ email });
      expect(bcrypt.compare).toHaveBeenCalledWith(password, encryptedPassword);
      expect(tokenInstance.createRefreshToken).toHaveBeenCalledWith({ uid });
      expect(result).toEqual({
        message: constantStrings.SUCCESSFULLY_LOGGED_IN,
        refresh_token,
        name,
      });
    });

    test('should throw APIError for incorrect password', async () => {
      const user = { _id: uid, password: encryptedPassword };
      userRepository.findUser.mockResolvedValue(user);
      bcrypt.compare.mockResolvedValue(false);

      await expect(userService.login({ email, password }))
        .rejects.toThrow(new APIError(constantErrors.INCORRECT_PASSWORD));

      expect(bcrypt.compare).toHaveBeenCalledWith(password, encryptedPassword);
    });

    test('should throw APIError when account does not exist', async () => {
      userRepository.findUser.mockResolvedValue(null);

      await expect(userService.login({ email, password }))
        .rejects.toThrow(new APIError(constantErrors.ACCOUNT_DOEN_NOT_EXISTS));

      expect(userRepository.findUser).toHaveBeenCalledWith({ email });
    });
  });

  // Test: refreshToken
  describe('refreshToken', () => {
    test('should return a new access token', async () => {
      const tokenInstance = { accessToken: jest.fn().mockResolvedValue('new-access-token') };
      TOKEN_LIB.mockImplementation(() => tokenInstance);

      const result = await userService.refreshToken({ refresh_token });

      expect(tokenInstance.accessToken).toHaveBeenCalledWith({ refreshToken: refresh_token });
      expect(result).toEqual({ accessToken: 'new-access-token' });
    });
  });

  // Test: logout
  describe('logout', () => {
    const tokenData = { uid, sessionId };

    test('should delete one session and return logout success', async () => {
      tokenRepository.getTokenData.mockResolvedValue(tokenData);
      tokenRepository.deleteTokens.mockResolvedValue();
      sessionHelper.deleteSessionId.mockResolvedValue();

      const result = await userService.logout({ refresh_token, type: 'one' });

      expect(tokenRepository.getTokenData).toHaveBeenCalledWith({ refreshToken: refresh_token });
      expect(tokenRepository.deleteTokens).toHaveBeenCalledWith({ refreshToken: refresh_token });
      expect(sessionHelper.deleteSessionId).toHaveBeenCalledWith(sessionId);
      expect(result).toEqual({ message: constantStrings.LOGOUT_SUCCESS });
    });

    test('should delete all sessions and return logout success', async () => {
      tokenRepository.getTokenData.mockResolvedValue(tokenData);
      const allTokens = [{ sessionId }, { sessionId: 'session456' }];
      tokenRepository.getAllTokens.mockResolvedValue(allTokens);
      sessionHelper.deleteSessionId.mockResolvedValue();

      const result = await userService.logout({ refresh_token, type: 'all' });

      expect(tokenRepository.getTokenData).toHaveBeenCalledWith({ refreshToken: refresh_token });
      expect(tokenRepository.getAllTokens).toHaveBeenCalledWith({ uid });
      expect(sessionHelper.deleteSessionId).toHaveBeenCalledTimes(2);
      expect(tokenRepository.deleteTokens).toHaveBeenCalledWith({ uid });
      expect(result).toEqual({ message: constantStrings.LOGOUT_SUCCESS });
    });

    test('should throw APIError for invalid refresh token', async () => {
      tokenRepository.getTokenData.mockResolvedValue(null);

      await expect(userService.logout({ refresh_token, type: 'one' }))
        .rejects.toThrow(new APIError(constantErrors.INVALID_REFRESH_TOKEN));

      expect(tokenRepository.getTokenData).toHaveBeenCalledWith({ refreshToken: refresh_token });
    });
  });
});
