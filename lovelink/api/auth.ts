import api from "./api";
import { useAuthStore } from "@/store/hooks/useAuthStore";

export const Login = async (email: string, password: string) => {
    console.log("logging in")
    const { data } = await api.post("/auth/login", { email, password });
    console.log(data)
    useAuthStore.getState().setToken(data.token)
    useAuthStore.getState().setUser(data.user)
    return data;
}
// change values later 
export const signUp = async (payload: { fullName: string, email: string, password: string , profilePicture: any}) => {
    console.log(payload)
    try {
        
        const formData = new FormData();

        formData.append("fullName", payload.fullName);
        formData.append("email", payload.email);
        formData.append("password", payload.password);
        formData.append("profilePicture", {
            uri: payload.profilePicture.uri,
            type: payload.profilePicture.type,
            name: payload.profilePicture.name
        } as any);
        
        const { data } = await api.post("/auth/signup", formData,{
            headers: {
                "Content-Type": "multipart/form-data",
            },
        })
        useAuthStore.getState().setUser(data.user)
        useAuthStore.getState().setToken(data.token)
        return data;
    } catch (error) {
        console.log(error)
        throw new Error("Signup failed"); // Rethrow  error
    }
}