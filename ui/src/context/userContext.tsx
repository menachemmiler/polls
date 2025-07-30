import cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import {
  createContext,
  ReactNode,
  useEffect,
  useState,
} from "react";
import { environment } from "../globals";
import { IUser } from "../types/userType";


interface AuthContextType {
  user: IUser | null;
}

const userContext = createContext<AuthContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<IUser | null>(null);

  useEffect(() => {
    const accessToken = cookies.get(environment.accessTokenName);
    if (!accessToken) return;

    try {
      setUser(jwtDecode<IUser>(accessToken));
    } catch {}
  }, []);

  return (
    <userContext.Provider value={{ user }}>
    {children}</userContext.Provider>
  );

};
