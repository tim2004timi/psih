import { instance, refreshInstance } from "./api.config.js";
import axios from 'axios';
import { serverUrl } from './config.js';

const AuthService = {
    validateLogin(username, password) {
        const data = new URLSearchParams();
        data.append('username', username);
        data.append('password', password);
        
        return axios.post(`${serverUrl}/api/jwt/validate/`, data, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
    },

    messageFromBot(username, password) {
        const data = new URLSearchParams();
        data.append('username', username);
        data.append('password', password);
        
        return axios.post(`${serverUrl}/api/jwt/2fa-1-step/`, data, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
    },

    getTokens(username, code) {
        const data = new URLSearchParams();
        data.append('username', username);
        data.append('code', code);
        
        return axios.post(`${serverUrl}/api/jwt/2fa-2-step/`, data, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
    },
    
    refreshToken() {
        return (
            refreshInstance.post("/api/jwt/refresh/")
        );
    },
    
};

export default AuthService;