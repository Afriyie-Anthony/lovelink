import api from "./api";
import { useAuthStore } from "@/store/hooks/useAuthStore";

export const Login = async (email: string, password: string) => {
    const { data } = await api.post("", { email, password });
    useAuthStore.getState().setToken(data.token)
    useAuthStore.getState().setUser(data.user)
    return data;
}
// change values later 
export const signUp = async (payload: { fullname: string, email: string, password: string }) => {
    const { data } = await api.post("", payload)
    useAuthStore.getState().setUser(data.user)
    useAuthStore.getState().setToken(data.token)
    return data;
}