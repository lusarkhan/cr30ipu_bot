import $api from "../http";
import {AxiosResponse} from "axios";
import {AuthResponse} from "../_models/response/AuthResponse";
import {IUser} from "../_models/IUser";
const API_URL = 'http://localhost:5000/api/';

export default class UserService {
    static fetchUsers(): Promise<AxiosResponse<IUser[]>> {
        return $api.get<IUser[]>('/users')
    }

    static getAdminBoard() {
        return $api.get(API_URL + 'admin', {});
    }
}
