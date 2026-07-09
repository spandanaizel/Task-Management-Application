import { api } from "./api";

export const authService = {
  register: (data: { name: string; email: string; password: string; confirmPassword: string }) =>
    api.post("/auth/register", data).then((res) => res.data),
  login: (data: { email: string; password: string }) =>
    api.post("/auth/login", data).then((res) => res.data),
  logout: () => api.post("/auth/logout").then((res) => res.data),
  getMe: () => api.get("/auth/me").then((res) => res.data),
};
