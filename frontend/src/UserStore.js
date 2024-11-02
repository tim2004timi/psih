import { makeAutoObservable, runInAction } from "mobx";
import UserService from './API/api.user';

class UserStore {
    usersArr = []
    currentUser = {}
    errorText = ''

    constructor() {
        makeAutoObservable(this, {}, { autoBind: true });
    }

    setUsersArr(arr) {
        this.usersArr = arr
    }

    setCurrentUser(user) {
        this.currentUser = user;
    }

    setErrorText(text) {
        this.errorText = text;
    }

    async getUsers() {
        try {
            const resp = await UserService.getUsers()
            this.setUsersArr(resp.data)
        } catch(e) {
            // console.error(e)
            this.setErrorText(e.response.data.detail)
        }
    }

    async createUser(obj) {
        try {
            const resp = await UserService.createUser(obj)
            console.log(resp.data)
        } catch(e) {
            console.log(e)
            this.setErrorText(e.response.data.detail)
        }
    }

    async patchUser(id, obj) {
        try {
            const resp = await UserService.patchUser(id, obj)
            console.log(resp.data)
        } catch(e) {
            console.log(e)
            this.setErrorText(e.response.data.detail)
        }
    }

    async getCurrentUser() {
        try {
            const resp = await UserService.getCurrentUser()
            // console.log(resp)
            this.setCurrentUser(resp.data)
        } catch(e) {
            console.error(e)
            this.setErrorText(e.response.data.detail)
        }
    }
}

export default new UserStore();