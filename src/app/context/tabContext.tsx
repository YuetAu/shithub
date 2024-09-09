import { createContext, useContext } from "react";

export const TabContext = createContext<any>(null);
export const TabSetContext = createContext<any>(null);

export const useTabSet = () => {
    const tabSet = useContext(TabSetContext);
    if (!tabSet) {
        throw new Error('useTabSet must be used within an TabProvider');
    }
    return tabSet;
}