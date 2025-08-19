import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthState, DiscoverFilters, User, } from '../types/Auth';
import { DiscoverState } from '../types/Discovery';
const isValidImageUrl = (url?: string | null) => {
  return typeof url === "string" && url.startsWith("http");
};


export const useDiscoverStore = create<DiscoverState>()(
  persist(
    (set) => ({
      profiles: [],
      currentProfileIndex: 0,
      swipeDirection: null,
      filters: { minAge: 25, maxAge: 35, profession: undefined, limit: 20, page: 1 },
      matches: [],
      likes: [],
      dislikes: [],
      setProfiles: (profiles?: User[]) =>
        set((state) => ({
          profiles: Array.isArray(profiles)
            ? profiles.map((p) => ({
              ...p,
              profilePicture: isValidImageUrl(p.profilePicture)
                ? p.profilePicture
                : "https://via.placeholder.com/300",
            }))
            : state.profiles, // keep old state instead of empty []
        })),


      setCurrentProfileIndex: (index) =>
        set((state) => ({
          currentProfileIndex: typeof index === "function" ? index(state.currentProfileIndex) : index,
        })),

      setSwipeDirection: (direction: 'left' | 'right' | null) => set({ swipeDirection: direction }),
      updateFilters: (newFilters: Partial<DiscoverFilters>) =>
        set((state) => ({ filters: { ...state.filters, ...newFilters } })),
      addMatch: (profileId: string) => set((state) => ({
        matches: [...state.matches, profileId],
        likes: [...state.likes, profileId],
      })),
      addLike: (profileId: string) => set((state) => ({ likes: [...state.likes, profileId] })),
      addDislike: (profileId: string) => set((state) => ({ dislikes: [...state.dislikes, profileId] })),
    }),
    {
      name: "discover-state",
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        console.log("Discover store hydrated:", state);
      },
    }
  )
);
