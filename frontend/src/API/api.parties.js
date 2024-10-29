import { instance } from "./api.config";
import { serverUrl } from '../config.js';

const PartiesService = {
    getParties() {
        return instance.get(`${serverUrl}/api/parties/`)
    },

    createParty(obj) {
        return instance.post(`${serverUrl}/api/parties/`, obj);
    },

    // patchUser(id, obj) {
    //     return instance.patch(`${serverUrl}/api/users/?user_id=${id}`, obj);
    // },

    getPartyById(id) {
       return instance.get(`${serverUrl}/api/parties/${id}/`);
    },

    deletePartyById(id) {
       return instance.delete(`${serverUrl}/api/parties/?party_id=${id}`);
    },

    deleteParties(arr) {
        return instance.delete(`${serverUrl}/api/parties/multiple/`, arr);
    }
}

export default PartiesService;