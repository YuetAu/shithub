import { createContext, useContext } from 'react';

export const AuthContext = createContext<any>(null);
export const AuthDispatchContext = createContext<any>(null);

export const useAuth = () => {
    const auth = useContext(AuthContext);
    if (!auth) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return auth;
}