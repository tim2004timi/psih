import { makeAutoObservable } from "mobx";
import AuthService from "./api.auth.js";

class AuthStore {   
  isAuth = false;
  isAuthInProgress = false;
  
  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  async login(email, password) {
    // console.log(AuthService.login(email, password))
    this.isAuthInProgress = true;
    try {
      const resp = await AuthService.login(email, password);
      console.log(resp)
      localStorage.setItem("token", resp.data.access_token);
      console.log(localStorage)
      this.isAuth = true;
    } catch (err) {
      console.log("login error");
    } finally {
      this.isAuthInProgress = false;
    } 
  }

  async checkAuth() {
    this.isAuthInProgress = true;
    try {
      const resp = await AuthService.refreshToken();
      localStorage.setItem("token", resp.data.access_token);
      this.isAuth = true;
    } catch (err) {
      console.error(err);
      console.log("login error");
    } finally {
      this.isAuthInProgress = false;
    } 
  }

  // async logout() {
  //   this.isAuthInProgress = true;
  //   try {
  //     await AuthService.logout();
  //     this.isAuth = false;
  //     localStorage.removeItem("token");
  //   } catch (err) {
  //     console.log("logout error");
  //   } finally {
  //     this.isAuthInProgress = false;
  //   } 
  // }

  async checkMe() {
    this.isAuthInProgress = true;
    try {
      const resp = await AuthService.checkMe();
      console.log(resp)
      console.log('доступ разрешен')
    } catch (err) {
      console.log("login error");
    } finally {
      this.isAuthInProgress = false;
    }
  }
}

export default new AuthStore();