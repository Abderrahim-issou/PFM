import { createContext } from "react";
import type { authContext } from "../types/Global";







const Auth_context = createContext<authContext | undefined>(undefined);

export default Auth_context;