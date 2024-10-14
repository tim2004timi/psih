import { makeAutoObservable } from "mobx";
import AuthService from "./api.auth.js";

class AuthStore {   
  isAuth = false;
  isAuthInProgress = false;
  isValidated = false;
  
  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  async validateLogin(email, password) {
    try {
      const resp = await AuthService.validateLogin(email, password);
      this.isValidated = true;
    } catch (err) {
      // console.log("login error");
      throw(err);
    } finally {
      // this.isAuthInProgress = false;
    } 
  }

  async messageFromBot(email, password) {
    try {
      const resp = await AuthService.messageFromBot(email, password);
    } catch (err) {

      if (err.response.status === 400) {
        throw(err);
      }

      console.error(err);
    } finally {
      // this.isAuthInProgress = false;
    } 
  }

  async getTokens(email, code) {
    // this.isAuthInProgress = true;
    try {
      // localStorage.clear()
      const resp = await AuthService.getTokens(email, code);
      console.log(resp);
      localStorage.setItem("access_token", resp.data.access_token);
      localStorage.setItem("refresh_token", resp.data.refresh_token);
      navigate('/');
      // this.isAuth = true;

      console.log(localStorage);
    } catch (err) {

      if (err.response.status === 400) {
        throw(err);
      }

      console.error(err);
    } finally {
      // this.isAuthInProgress = false;
    } 
  }

  async checkAuth() {
    this.isAuthInProgress = true;
    try {
      const resp = await AuthService.refreshToken();
      localStorage.setItem("access_token", resp.data.access_token);
      // console.log('checkAuth удался');
      this.isAuth = true;
    } catch (err) {
      console.error(err);
      // console.log("login error");
    } finally {
      this.isAuthInProgress = false;
    } 
  }

  async checkMe() {
    this.isAuthInProgress = true;
    try {
      const resp = await AuthService.checkMe();
      // console.log(resp);
      // console.log('доступ разрешен');
    } catch (err) {
      console.log("login error");
    } finally {
      this.isAuthInProgress = false;
    }
  }
}

export default new AuthStore();