import { makeAutoObservable, runInAction } from "mobx";
import AuthService from "./api.auth.js";

class AuthStore {   
  isAuth = true;
  isAuthInProgress = false;
  isValidated = false;
  
  
  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  initializeAuthState() {
    
    if (localStorage.getItem("access_token")) {
      this.checkAuth()
    }

  }

  async validateLogin(email, password) {
    this.isAuthInProgress = true;
    try {
      const resp = await AuthService.validateLogin(email, password);
      runInAction(() => {
        this.isValidated = true;
      })
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
      this.isAuthInProgress = false;
    } 
  }

  async getTokens(email, code) {
    this.isAuthInProgress = true;
    try {
      const resp = await AuthService.getTokens(email, code);
      console.log(resp)
      localStorage.setItem("access_token", resp.data.access_token);
      localStorage.setItem("refresh_token", resp.data.refresh_token);
      runInAction(() => {
        this.isAuth = true;
      })
      // console.log(this.isAuth)
    } catch (err) {
      console.error(err);

      if (err.response.status === 400) {
        throw(err);
      }

    } finally {
      this.isAuthInProgress = false;
    } 
  }

  async checkAuth() {
    this.isAuthInProgress = true;
    try {
      const resp = await AuthService.refreshToken();
      localStorage.setItem("access_token", resp.data.access_token);
      runInAction(() => {
        this.isAuth = true;
      })
    } catch (err) {
      console.error(err);
      // console.log("login error");
    } finally {
      this.isAuthInProgress = false;
    } 
  }

}

export default new AuthStore();