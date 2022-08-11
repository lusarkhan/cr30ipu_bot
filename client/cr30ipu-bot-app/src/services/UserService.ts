import $api from "../http";
import {AxiosResponse} from "axios";
import {AuthResponse} from "../_models/response/AuthResponse";
import {IUser} from "../_models/IUser";

export default class UserService {
    static fetchUsers(): Promise<AxiosResponse<IUser[]>> {
        return $api.get<IUser[]>('/users')
    }
}
