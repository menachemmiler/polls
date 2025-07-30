import axios from "axios";
import { environment } from "./globals";

export const axiosInstance = axios.create({
  timeout: 10000,
  baseURL: `${environment.env.backend_url}/api`,
  withCredentials: true,
});
