import React, {FC, useContext, useState} from 'react';
import {Context} from "../index";
import {observer} from "mobx-react-lite";


const LoginForm: FC = () => {
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [phone, setPhone] = useState<string>('')

    const {store} = useContext(Context);

    return (
        <div className="col-md-12">
            <div className="card card-container">
                <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input
                        className="form-control"
                        name="username"
                        onChange={e => setEmail(e.target.value)}
                        value={email}
                        type="text"
                        placeholder="Email"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        name="password"
                        className="form-control"
                        onChange={e => setPassword(e.target.value)}
                        value={password}
                        type="password"
                        placeholder="Password"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="text">Phone</label>
                    <input
                        name="phone"
                        className="form-control"
                        onChange={e => setPhone(e.target.value)}
                        value={phone}
                        type="text"
                        placeholder="Phone"
                    />
                </div>
                <div className="form-group">
                    <button onClick={() => store.login(email, password)} className="btn btn-primary btn-block">
                        <span>Логин</span>
                    </button>
                    <button onClick={() => store.registration(email, password, phone)}
                            className="btn btn-primary btn-block">
                        <span>Регистрация</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default observer(LoginForm);