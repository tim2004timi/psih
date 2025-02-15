import { makeAutoObservable, runInAction } from "mobx";
import PartiesService from './API/api.parties';

class PartyStore {
    parties = []
    party = {}
    isLoading = true

    constructor() {
        makeAutoObservable(this, {}, { autoBind: true });
    }

    setParties(arr) {
        this.parties = arr;
    }

    setParty(obj) {
        this.party = obj;
    }
    
    setIsLoading(bool) {
        this.isLoading = bool;
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
            return resp
        } catch(e) {
            throw (e)
        }
    }

    async patchParty(id, obj) {
        try {
            const resp = await PartiesService.patchParty(id, obj)
            console.log(resp.data)
            return resp?.data
        } catch(e) {
            throw (e)
        }
    }

    async getPartyById(id) {
        try {
            const resp = await PartiesService.getPartyById(id)
            this.setParty(resp.data)
            this.setIsLoading(false)
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
        console.log(arr)
        try {
            const resp = await PartiesService.deleteParties(arr)
            // console.log(resp.data)
        } catch(e) {
            throw (e)
        }
    }

    async uploadPartyFile(id, file) {
        try {
            const resp = await PartiesService.uploadPartyFile(id, file)
            console.log(resp.data)
            return resp
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

    resetIsLoading() {
        this.setIsLoading(true)
    }
}

export default new PartyStore();