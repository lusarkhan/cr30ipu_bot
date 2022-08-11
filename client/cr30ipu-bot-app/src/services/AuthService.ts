import $api from "../http";

import {AxiosResponse} from "axios";
import {AuthResponse} from "../_models/response/AuthResponse";

export default class AuthService {
    static async login(email: string, password: string): Promise<AxiosResponse<AuthResponse>> {
        return $api.post<AuthResponse>('/login', {email, password})
    }

    static async registration(email: string, password: string, phone: string): Promise<AxiosResponse<AuthResponse>> {
        return $api.post<AuthResponse>('/registration', {email, password, phone})
    }

    static async logout(): Promise<void> {
        return $api.post('/logout')
    }
}
