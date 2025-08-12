import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthState } from '../types/Auth';



export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            token: null,
            user: null,
            setToken: (token) => set({ token }),
            setUser: (user) => set({ user }),
            logout: () => set({ token: null, user: null }),
        }), {

        name: "auth-storage", // key in AsyncStorage
        storage: AsyncStorage,

    }
    )
)