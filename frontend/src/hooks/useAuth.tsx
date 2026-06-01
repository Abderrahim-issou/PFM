import { useContext } from "react"
import Auth_context from "../context/contexts"


 
const useAuth = () => {
    const context = useContext(Auth_context);

    if(!context){
        throw new Error("useAuth must be used inside the authprovider");
    }

    return context;
}

export default useAuth;