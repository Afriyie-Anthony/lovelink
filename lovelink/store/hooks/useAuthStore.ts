import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthState, UserState } from '../types/Auth';



export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            token: null,
            user: null,
            setToken: (token) => set({ token }),
            setUser: (user) => set({ user }),
            logout: () => set({ token: null, user: null,profile:{} }),
            profile: {},
            setProfileData: (data) => set((state) => ({
                profile: { ...state.profile, ...data }
            })),
            clearProfileData: () => set({ profile: {} }),
        }), {

        name: "auth-storage", // key in AsyncStorage
        storage: createJSONStorage(() => AsyncStorage)

    }
    )
)

export const useUserStorage = create<UserState>()(
    persist(
        (set) => {
            return {
                user: null,
                setUser: (user) => set({ user }),
                clearUser: () => set({ user: null }),
            }
        },
        {
            name: "user-storage",
            storage: createJSONStorage(() => AsyncStorage)
        }
    )
)