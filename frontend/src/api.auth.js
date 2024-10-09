import { instance } from "./api.config.js";

const AuthService = {
    login(email, password) {
        return instance.post("/api/jwt/login/", { email, password });
    },
    
    refreshToken() {
        return instance.get("/api/jwt/refresh/");
    },
    
    // logout() {
    //     return instance.post("/api/jwt/logout");
    // }
};

export default AuthService;