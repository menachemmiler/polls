
export const environment = {
  api: {
    login: "/auth/login",
    users: "/users",
    systems: "/systems",
    kartoffel: "/kartoffel",
  },
  env: {
    backend_url: import.meta.env.VITE_BACKEND_URL,
    relay_state: import.meta.env.VITE_RELAY_STATE,
    cookie_name: import.meta.env.VITE_TOKEN_NAME,
  },
  accessTokenName: 'amanPolls-token',


};
