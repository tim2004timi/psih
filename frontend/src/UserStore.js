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

    setCurrentUser(obj) {
        this.currentUser = obj
    }

    async getUsers() {
        try {
            const resp = UserService.getUsers()
            this.setUsersArr(resp.data)
            console.log(this.usersArr)
        } catch(e) {
            console.log(e)
        }
    }

    async createUser() {
        try {
            const resp = UserService.createUser()
            console.log(resp.data)
        } catch(e) {
            console.log(e)
        }
    }

    async patchUser(id) {
        try {
            const resp = UserService.patchUser(id)
            console.log(resp.data)
        } catch(e) {
            console.log(e)
        }
    }

    async getCurrentUSer() {
        try {
            const resp = UserService.getCurrentUSer()
            console.log(resp.data)
        } catch(e) {
            console.log(e)
        }
    }
}

export default UserStore;