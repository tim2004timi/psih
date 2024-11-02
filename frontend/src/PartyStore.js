import { makeAutoObservable, runInAction } from "mobx";
import PartiesService from './API/api.parties';

class PartyStore {
    parties = []
    party = {}

    constructor() {
        makeAutoObservable(this, {}, { autoBind: true });
    }

    setParties(arr) {
        this.parties = arr;
    }

    setParty(obj) {
        this.party = obj;
    }

    async getParties() {
        try {
            const resp = await PartiesService.getParties()
            this.setParties(resp.data)
        } catch(e) {
            throw (e)
        }
    }

    async createParty(obj) {
        try {
            const resp = await PartiesService.createParty(obj)
            console.log(resp.data)
        } catch(e) {
            throw (e)
        }
    }

    async getPartyById(id) {
        try {
            const resp = await PartiesService.getPartyById(id)
            this.setParty(resp.data)
        } catch(e) {
            throw (e)
        }
    }

    async deletePartyById(id) {
        try {
            const resp = await PartiesService.deletePartyById(id)
            console.log(resp.data)
        } catch(e) {
            throw (e)
        }
    }

    async deleteParties(arr) {
        try {
            const resp = await PartiesService.deleteParties(arr)
            console.log(resp.data)
        } catch(e) {
            throw (e)
        }
    }

    async uploadPartyFile(id, file) {
        try {
            const resp = await PartiesService.uploadPartyFile(id, file)
            console.log(resp.data)
        } catch(e) {
            throw (e)
        }
    }

    async deletePartyFile(id) {
        try {
            const resp = await PartiesService.deletePartyFile(id)
            console.log(resp.data)
        } catch(e) {
            throw (e)
        }
    }
}

export default new PartyStore();