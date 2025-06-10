import React, { createContext, useState } from "react";

export const ShopContext = createContext();

const initialState = {
    currency: "vnd",
    search: "",
    showSearch: false,
    accessToken: localStorage.getItem('accessToken') || null, 
    user: {},
    totalCartItems: localStorage.getItem('totalCartItems') ? parseInt(localStorage.getItem('totalCartItems')) : 0,
};

const ShopContextProvider = ({ children }) => {
    const [search, setSearch] = useState(initialState.search);
    const [showSearch, setShowSearch] = useState(initialState.showSearch);
    const [accessToken, setAccessToken] = useState(initialState.accessToken);
    const [user, setUser] = useState(initialState.user);
    const [totalCartItems, setTotalCartItems] = useState(initialState.totalCartItems);

    const resetContext = () => {
        setSearch("");
        setShowSearch(false);
        setAccessToken(null);
        setUser(null);
        setTotalCartItems(null);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        localStorage.removeItem("totalCartItems");
    };

    const value = {
        currency: initialState.currency,
        search, setSearch,
        showSearch, setShowSearch,
        accessToken, setAccessToken,
        user, setUser,
        totalCartItems, setTotalCartItems,
        resetContext,
    };

    return (
        <ShopContext.Provider value={value}>
            {children}
        </ShopContext.Provider>
    );
};

export default ShopContextProvider;
