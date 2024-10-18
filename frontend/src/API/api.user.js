import { instance } from "./api.config";
import { serverUrl } from '../config.js';

const UserService = {
    getUsers() {
        return instance.get(`${serverUrl}/api/users/`);
    },

    createUser(obj) {
        return instance.post(`${serverUrl}/api/users/`, obj);
    },

    patchUser(id, obj) {
        return instance.patch(`${serverUrl}/api/users/?user_id=${id}`, obj);
    },

    getCurrentUser() {
        return instance.get(`${serverUrl}/api/users/me/`);
    }
}

export default UserService;