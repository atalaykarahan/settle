import axios from "../axios";
import {getMyCookie} from "@/lib/get-my-cookie";

class AuthService {
    async getLoggedInUserServer() {
        const query = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
            headers: {
                Cookie: `${getMyCookie()}`,
            },
        });
        return query;
    };

    async logoutServer() {
        const query: any = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/logout`, {
            method: "POST",
            headers: {
                Cookie: `${getMyCookie()}`,
            },
            credentials: 'include'
        });
        const response = await query.status;
        return response;
    }

// login
//     async login(email: string, password: string) {
//         const props = {
//             email: email,
//             password: password
//         }
//         return await axios.post("/users/login", props, {withCredentials: true});
//     };


    // login
    async logout() {
        return await axios.post("/users/logout", {withCredentials: true});
    };


}

export const authService = new AuthService();