import React, { createContext, useState, useEffect } from 'react';
import { setItem, getItem, removeItem } from '../services/storageHelper';
import { STORAGE_KEYS } from '../utils/constants';
import { getMe, login as apiLogin, register as apiRegister } from '../api/auth';
import { setAuthToken } from '../api/api';

export const AuthContext = createContext();

export const useAuth = () => React.useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setTokenState] = useState(null);
    const [loadingBoot, setLoadingBoot] = useState(true);

    useEffect(() => {
        const boot = async () => {
            try {
                const storedToken = await getItem(STORAGE_KEYS.TOKEN);
                if (storedToken) {
                    setAuthToken(storedToken);
                    setTokenState(storedToken);
                    try {
                        const res = await getMe();
                        setUser(res.data);
                    } catch (e) {
                        console.error('Failed to fetch user on boot', e);
                    }
                }
            } catch (e) {
                console.error('Auth boot error', e);
            } finally {
                setLoadingBoot(false);
            }
        };
        boot();
    }, []);

    const login = async (email, password) => {
        try {
            const res = await apiLogin({ email, password });
            const { token: newToken, user: newUser } = res.data;

            await setItem(STORAGE_KEYS.TOKEN, newToken);
            if (newUser) {
                await setItem(STORAGE_KEYS.USER, JSON.stringify(newUser));
            }

            setAuthToken(newToken);
            setTokenState(newToken);
            setUser(newUser);
            return true;
        } catch (e) {
            console.error('Login error', e);
            throw e;
        }
    };

    const register = async (data) => {
        try {
            const res = await apiRegister(data);
            const { token: newToken, user: newUser } = res.data;

            if (newToken) {
                await setItem(STORAGE_KEYS.TOKEN, newToken);
                setAuthToken(newToken);
                setTokenState(newToken);
                setUser(newUser);
            }
            return true;
        } catch (e) {
            console.error('Register error', e);
            throw e;
        }
    };

    const logout = async () => {
        try {
            await removeItem(STORAGE_KEYS.TOKEN);
            await removeItem(STORAGE_KEYS.USER);
            setAuthToken(null);
            setTokenState(null);
            setUser(null);
        } catch (e) {
            console.error('Logout error', e);
        }
    };

    const isAuthenticated = !!token;

    return (
        <AuthContext.Provider value={{
            user,
            token,
            isAuthenticated,
            splashLoading: loadingBoot,
            isLoading: false,
            login,
            register,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    );
};
