import { instance } from "./api.config.js";

const AuthService = {
    login(username, password) {
        const data = new URLSearchParams();
        data.append('username', username);
        data.append('password', password);
        
        return instance.post("/api/jwt/login/", data, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
    },
    

    refreshToken() {
        return instance.post("/api/jwt/refresh/");
    },
    
    // logout() {
    //     return instance.post("/api/jwt/logout");
    // }

    checkMe() {
        return instance.get("/api/jwt/users/me/");
    }
};

export default AuthService;