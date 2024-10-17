import { instance } from "../api.config";

export async function getUsers() {
    try {
        let response = await instance.get(`${serverUrl}/api/users/`);
        return response;
    } catch (e) {
        throw e;
    }
}

export async function createUser() {
    try {
        let response = await instance.post(`${serverUrl}/api/users/`);
        return response;
    } catch (e) {
        throw e;
    }
}

export async function patchUser(id) {
    try {
        let response = await instance.patch(`${serverUrl}/api/users/?user_id=${id}`);
        return response;
    } catch (e) {
        throw e;
    }
}

export async function getCurrentUSer() {
    try {
        let response = await instance.get(`${serverUrl}api/users/me/`);
        return response;
    } catch (e) {
        throw e;
    }
}
