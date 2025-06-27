import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { account } from '../lib/appwrite/appwrite';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        account.get().then(
            (user) => {
                if (isMounted) setUser(user);
            },
            () => {
                if (isMounted) setUser(null);
            }
        ).finally(() => {
            if (isMounted) setLoading(false);
        });
        return () => { isMounted = false; };
    }, []);

    const logout = useCallback(async () => {
        setLoading(true);
        try {
            await account.deleteSession('current');
        } catch {}
        setUser(null);
        setLoading(false);
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser, loading, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
