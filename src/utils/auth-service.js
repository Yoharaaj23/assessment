import { login } from '../api/auth.js';
import { scenarioContext } from './scenario-context.js';
import jwt from 'jsonwebtoken';

export class AuthService {
  constructor() {
    this.tokenkey = 'authToken';
  }

  setToken(token) {
    scenarioContext.setData(this.tokenkey, token);
  }

  getToken() {
    return scenarioContext.getData(this.tokenkey);
  }

  clearAuth() {
    scenarioContext.clearData(this.tokenkey);
  }

  isTokenValid() {
    const token = this.getToken();
    if (!token) return false;

    try {
      const decoded = jwt.decode(token); // Do NOT use jwt.verify unless you have the secret
      if (!decoded || !decoded.exp) return false;

      const currentTime = Math.floor(Date.now() / 1000);
      return decoded.exp > currentTime;
    } catch (err) {
      return false;
    }
  }

  async authenticate(username, password) {
    if (this.isTokenValid()) {
      console.log('Using cached token');
      return { data: { token: this.getToken() }, status: 200 };
    }

    const response = await login(username, password);
    this.setToken(response.data['token']);
    return response;
  }

  async logout() {
    this.clearAuth();

  }

  async forceLogin(username, password) {
    const response = await login(username, password);
    this.setToken(response.data['token']);
    return response;
  }

}

export const authService = new AuthService();

