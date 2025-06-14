import React, { createContext, useState } from "react";

export const AdminContext = createContext();

const initialState = {
    currency: "vnd",
    search: "",
    showSearch: false,
    accessToken: localStorage.getItem('accessToken') || null, 
    user: JSON.parse(localStorage.getItem('shop-app-user')) || null,
};

const AdminContextProvider = ({ children }) => {
    const [search, setSearch] = useState(initialState.search);
    const [showSearch, setShowSearch] = useState(initialState.showSearch);
    const [accessToken, setAccessToken] = useState(initialState.accessToken);
    const [user, setUser] = useState(initialState.user);

    const resetContext = () => {
        setSearch("");
        setShowSearch(false);
        setAccessToken(null);
        setUser(null);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("shop-app-user");
    };

    const value = {
        currency: initialState.currency,
        search, setSearch,
        showSearch, setShowSearch,
        accessToken, setAccessToken,
        user, setUser,
        resetContext,
    };

    return (
        <AdminContext.Provider value={value}>
            {children}
        </AdminContext.Provider>
    );
};

export default AdminContextProvider;
