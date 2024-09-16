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

export const initialAuth = {
    auth: false,
    user: null,
};

export const authReducer = (state: any, action: { type: string; payload?: any }) => {
    switch (action.type) {
        case 'LOGIN':
            return { auth: true, user: action.payload };
        case 'LOGOUT':
            localStorage.removeItem('AToken');
            localStorage.removeItem('RToken');
            localStorage.removeItem("auth");
            localStorage.removeItem("userID");
            localStorage.removeItem("lastTime");
            return { auth: false, user: null };
        case 'SHIT':
            return { ...state, user: { ...state.user, shitCount: action.payload } }
        default:
            return state;
    }
};