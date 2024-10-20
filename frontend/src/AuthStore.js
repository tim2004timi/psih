import { makeAutoObservable, runInAction } from "mobx";
import AuthService from "./API/api.auth";

class AuthStore {   
  isAuth = false;
  isAuthInProgress = false;
  isValidated = false;
  
  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  setAuth(bool) {
    this.isAuth = bool;
  }

  setValidated(bool) {
    this.isValidated = bool;
  }

  setAuthInProgress(bool) {
    this.isAuthInProgress = bool;
  }

  initializeAuthState() {
    this.setAuthInProgress(true);
    if (localStorage.getItem("access_token")) {
      this.checkAuth();
    } else {
      this.setAuthInProgress(false);
    }
  }

  async validateLogin(email, password) {
    this.setAuthInProgress(true);
    try {
      const resp = await AuthService.validateLogin(email, password);
      this.setValidated(true);
    } catch (err) {
      if (err.response.status === 401) {
        throw err;
      }
      console.error(err);
    } finally {
      this.setAuthInProgress(false);
    } 
  }

  async messageFromBot(email, password) {
    this.setAuthInProgress(true);
    try {
      const resp = await AuthService.messageFromBot(email, password);
    } catch (err) {
      if (err.response.status === 400) {
        throw err;
      }
      console.error(err);
    } finally {
      this.setAuthInProgress(false);
    } 
  }

  async getTokens(email, code) {
    this.setAuthInProgress(true);
    try {
      const resp = await AuthService.getTokens(email, code);
      localStorage.setItem("access_token", resp.data.access_token);
      localStorage.setItem("refresh_token", resp.data.refresh_token);
      this.setAuth(true);
    } catch (err) {
      console.error(err);
      if (err.response.status === 400) {
        throw err;
      }
    } finally {
      this.setAuthInProgress(false);
    } 
  }

  async checkAuth() {
    this.setAuthInProgress(true);
    try {
      const resp = await AuthService.refreshToken();
      localStorage.setItem("access_token", resp.data.access_token);
      this.setAuth(true);
    } catch (err) {
      console.error(err);
    } finally {
      this.setAuthInProgress(false);
    } 
  }

  logout() {
    this.setAuthInProgress(true);
    AuthService.logout();
    this.setAuth(false);
    this.setAuthInProgress(false);
  }
}

export default new AuthStore();