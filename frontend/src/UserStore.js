import { makeAutoObservable, runInAction } from "mobx";
import UserService from './API/api.user';

class UserStore {
    usersArr = []
    currentUser = {}

    constructor() {
        makeAutoObservable(this, {}, { autoBind: true });
    }

    setUsersArr(arr) {
        this.usersArr = arr
    }

    setCurrentUser(user) {
        this.currentUser = user;
    }

    async getUsers() {
        try {
            const resp = await UserService.getUsers()
            this.setUsersArr(resp.data)
        } catch(e) {
            console.log(e)
        }
    }

    async createUser(obj) {
        try {
            const resp = await UserService.createUser(obj)
            console.log(resp.data)
        } catch(e) {
            console.log(e)
        }
    }

    async patchUser(id, obj) {
        try {
            const resp = await UserService.patchUser(id, obj)
            console.log(resp.data)
        } catch(e) {
            console.log(e)
        }
    }

    async getCurrentUser() {
        try {
            const resp = await UserService.getCurrentUser()
            this.setCurrentUser(resp.data)
        } catch(e) {
            console.error(e)
        }
    }
}

export default new UserStore();