import { instance } from "./api.config";
import { serverUrl } from '../config.js';

const UserService = {
    getUsers() {
        return instance.get(`${serverUrl}/api/users/`);
    },

    createUser() {
        return instance.post(`${serverUrl}/api/users/`);
    },

    patchUser(id) {
        return instance.patch(`${serverUrl}/api/users/?user_id=${id}`);
    },

    getCurrentUSer() {
        return instance.get(`${serverUrl}api/users/me/`);
    }
}

export default UserService;