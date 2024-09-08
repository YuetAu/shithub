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

export const useAuthDispatch = () => {
    const dispatch = useContext(AuthDispatchContext);
    if (!dispatch) {
        throw new Error('useAuthDispatch must be used within an AuthProvider');
    }
    return dispatch;
}