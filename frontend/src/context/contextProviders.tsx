import React, { useEffect, useState } from "react";
import type { User } from "../types/Global";
import Auth_context from "./contexts";
import { getAuthFromStorage } from "../utils/authStorage";







const AuthProvider = ({children}: { children: React.ReactNode}) => {
    const [access_token, setToken] = useState<string |  null>(null);
    const [user, setUser] = useState<User |  null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        try {
            const { accessToken, user } = getAuthFromStorage();
            if (!accessToken || !user) {
                setAuth(null);
                setLoading(false);
                return;
            }

            setAuth({
                access_token: accessToken,
                user,
                loading
            });
            setLoading(false);
            } catch (error) {
                console.error("Failed to restore auth from storage:", error);
                setLoading(false);
                setAuth(null);
            }
        }, []);

    const setAuth = (data: {access_token: string, user: User, loading: boolean} | null ) => {
        if(!data){
            setToken(null)
            setUser(null)
            return
        }
        setToken(data.access_token);
        setUser((prev) => ({prev,...data.user}))
    };


    return(
        <Auth_context.Provider value={{access_token, user, setAuth, loading}}>
            {children}
        </Auth_context.Provider>
    )
}


// import { useState } from "react";
// import Auth_context from "../context/contexts";
// import type { User } from "../types/Global";

// const AuthProvider = ({ children }: { children: React.ReactNode }) => {
//   const storedToken = localStorage.getItem("access_token");
//   const storedUser = localStorage.getItem("user");

//   const [access_token, setToken] = useState<string | null>(storedToken);

//   const [user, setUser] = useState<User | null>(
//     storedUser ? JSON.parse(storedUser) : null
//   );

//   const setAuth = (data: { access_token: string; user: User } | null) => {
//     if (!data) {
//       localStorage.removeItem("access_token");
//       localStorage.removeItem("user");

//       setToken(null);
//       setUser(null);
//       return;
//     }

//     localStorage.setItem("access_token", data.access_token);
//     localStorage.setItem("user", JSON.stringify(data.user));

//     setToken(data.access_token);
//     setUser(data.user);
//   };

//   return (
//     <Auth_context.Provider value={{ access_token, user, setAuth }}>
//       {children}
//     </Auth_context.Provider>
//   );
// };

// export default AuthProvider;
export default AuthProvider;