import { useEffect } from "react";
import { useUserStore } from "../stores/user";
import { getCookie } from "./getCookies";
import { IShragaUser } from "../types/survey";
import { jwtDecode } from "jwt-decode";

export function useShragaUser() {
  const setUser = useUserStore((state) => state.setUser);

  useEffect(() => {
    const getShragaUser = getCookie("amanPolls-token");
    if (getShragaUser) {
      const decodedShragaUser: IShragaUser & { exp: number } =
        jwtDecode(getShragaUser);
      const now = Date.now() / 1000;
      if (decodedShragaUser.exp && decodedShragaUser.exp < now) {
        window.location.href = `${
          import.meta.env.VITE_BACKEND_URL
        }/api/auth/login?RelayState=${encodeURIComponent(
          window.location.href
        )}`;
      }
      setUser(decodedShragaUser);
    } else {
      window.location.href = `${
        import.meta.env.VITE_BACKEND_URL
      }/api/auth/login?RelayState=${encodeURIComponent(window.location.href)}`;
    }
  }, []);
}
