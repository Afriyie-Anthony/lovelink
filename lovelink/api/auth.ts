import api from "./api";
import { useAuthStore, useUserStorage } from "@/store/hooks/useAuthStore";

export const Login = async (email: string, password: string) => {
    console.log("logging in")
    const { data } = await api.post("/auth/login", { email, password });
    console.log("loging response ", data)
    useAuthStore.getState().setToken(data.token)
    useAuthStore.getState().setUser(data.user)
    return data;
}
// change values later 
export const signUp = async (payload: { email: string, password: string, }) => {
    console.log(payload)


    const formData = new FormData();

    // formData.append("fullName", payload.fullName);
    formData.append("email", payload.email);
    formData.append("password", payload.password);
    // formData.append("profilePicture", {
    //     uri: payload.profilePicture.uri,
    //     type: payload.profilePicture.type,
    //     name: payload.profilePicture.name
    // } as any);

    const { data } = await api.post("/auth/signup", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    })
    useAuthStore.getState().setUser(data.user)
    useAuthStore.getState().setToken(data.token)
    return data;

}
export const completeProfile = async (userId: string, profileData: any) => {
    const user: any = useAuthStore.getState().user
    userId = userId || user.id

    profileData.height = parseFloat(profileData.height)

    const formData = new FormData()
    formData.append('fullName', profileData.fullName)
    formData.append("email", profileData.email);
    formData.append("password", profileData.password);
    formData.append("profilePicture", {
        uri: profileData.profilePicture.uri,
        type: profileData.profilePicture.type,
        name: profileData.profilePicture.fileName
    } as any);
    formData.append('birthDate', new Date(profileData.birthDate).toISOString())
    formData.append('gender', profileData.gender);
    profileData.interests.forEach((interest: string) => {
        formData.append("interests[]", interest.toUpperCase());
    });
    formData.append('bio', profileData.bio)
    formData.append("profession", profileData.profession)
    formData.append("education", profileData.education)
    formData.append("height", profileData.height)
    formData.append("age", profileData.age)
    formData.append("locate", profileData.location)
    formData.append("phoneNumber", profileData.phoneNumber)
    console.log("Form:", formData)
    console.log(profileData)
    const { data } = await api.patch(`/auth/complete-profile/${user.id}`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        }
    });
    useAuthStore.getState().setUser(data.user)
    useAuthStore.getState().setToken(data.token)
    return data;
}

export const manualSignUp = async (data: any) => {
    data.height = parseFloat(data.height)
    const formData = new FormData()
    formData.append('fullName', data.fullName)
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("profilePicture", {
        uri: data.profilePicture.uri,
        type: data.profilePicture.type,
        name: data.profilePicture.fileName
    } as any);
    
    formData.append('birthDate', new Date(data.birthDate).toISOString())
    formData.append('gender', data.gender);
    data.interests.forEach((interest: string) => {
        formData.append("interests[]", interest.toUpperCase());
    });
    formData.append('bio', data.bio)
    formData.append("profession", data.profession)
    formData.append("education", data.education)
    formData.append("height", data.height)
    formData.append("age", data.age)
    formData.append("locate", data.location)
    formData.append("phoneNumber", data.phoneNumber)
    console.log("Form:", formData)


        const response = await api.post("/auth/manual/signup", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        })
        useAuthStore.getState().setUser(response.data.user)
        useAuthStore.getState().setToken(response.data.token)
        console.log("response", response)
        
        return response.data
        
  
}

export const getUser = async (userId: string) => {
    const response = await api.get(`/auth/user/${userId}`)

    useUserStorage.getState().setUser(response.data)
    return response.data
}