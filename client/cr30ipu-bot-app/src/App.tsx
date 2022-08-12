import React, {FC, Component, useContext, useEffect, useState} from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import LoginForm from "./components/LoginForm";
import {Context} from "./index";
import {observer} from "mobx-react-lite";
import {IUser} from "./_models/IUser";
import UserService from "./services/UserService";


const App: FC = () => {
    const [data, setData] = useState(null);
    const {store} = useContext(Context);
    const [users, setUsers] = useState<IUser[]>([]);

    useEffect(() => {
        fetch('/api')
            .then((response) => response.json())
            .then(response => setData(response.message))
        if (localStorage.getItem('token')) {
            store.checkAuth()
        }
    }, [])

    async function getUsers() {
        try {
            const response = await UserService.fetchUsers();
            setUsers(response.data);
        } catch (e) {
            console.log(e);
        }
    }

    async function getAdminBoard() {
        try {
            const response = await UserService.getAdminBoard();
            setUsers(response.data);
        } catch (e) {
            console.log(e);
        }
    }

    if (store.isLoading) {
        return <div>Загрузка...</div>
    }

    if (!store.isAuth) {
        return (
            <div>
                <LoginForm/>
                <button onClick={getUsers}>Получить пользователей</button>
            </div>
        )
    }
    return (
        <div>
            {
                !data ? "Loading..." : data
            }
            <h1>{store.isAuth ? `Пользователь авторизован ${store.user.email}` : 'АВТОРИЗУЙТЕСЬ'}</h1>
            <h1>{store.user.confirmed ? `Аккаунт подтвержден по почте` : 'ПОДТВЕРДИТЕ АККАУНТ'}</h1>
            <button onClick={() => store.logout()}>Выйти</button>
            <div>
                <button onClick={() => store.user.confirmed ? getUsers() : 'ПОДТВЕРДИТЕ АККАУНТ'}>Получить
                    пользователей
                </button>
            </div>
            <div>
                <button onClick={getAdminBoard}>Админ панель</button>
            </div>

            {users.map(user =>
                <div key={user.email}>{user.email}</div>
            )}
        </div>
    );
}

export default observer(App);
