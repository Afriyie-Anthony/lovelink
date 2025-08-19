export type User = {
    id?: string
    fullName?: string
    email?: string
    password?: string
    profilePicture?: string | null
    bio?: string
    birthDate?: Date
    age?: number
    locate?: string
    phoneNumber?: string,
    profession?: string
    education?: string
    height?: number
    interests: string[]
    gender:string
}
export type ProfileData = {
    fullName: string
    birthDate: Date | null
    email?: string
    password?: string
    gender: string
    genderPreference: string[]
    interests: string[]
    profilePicture: string
    bio: string
    profession: string
    education: string
    height: number
    age?: number
    locate?: string
    phoneNumber?: string,

}

export interface DiscoverFilters {
  minAge: number;
  maxAge: number;
  profession?: string;
  limit: number;
  page: number;
}

export interface DiscoverState {
  profiles: User[];
  currentProfileIndex: number;
  swipeDirection: 'left' | 'right' | null;
  filters: DiscoverFilters;
  matches: string[]; // Store matched profile IDs
  likes: string[];   // Store liked profile IDs
  dislikes: string[]; // Store disliked profile IDs
}

export type AuthState = {
    user: User | null
    token: string | null
    setToken: (token: string) => void
    setUser: (user: User | null) => void;
    logout: () => void
    profile: ProfileData | {}
    setProfileData: (data: Partial<ProfileData>) => void;
    
    clearProfileData: () => void;
    clearToken: () => void

    // loading: boolean
    // error: string | null
}
export type UserState = {
    user: User | null
    setUser: (user: User | null) => void
    clearUser: () => void
}