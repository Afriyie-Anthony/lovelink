export type User = {
    id?: string
    fullName?: string
    email?: string
    password?: string
    profilePicture?: string
    bio?: string
    birthDate?: Date
    age?: number
    locate?: string
    phoneNumber?: string,
    profession?: string
    education?: string
    height?: number
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


export type AuthState = {
    user: User | null
    token: string | null
    setToken: (token: string) => void
    setUser: (user: User | null) => void;
    logout: () => void
    profile: ProfileData | {}
    setProfileData: (data: Partial<ProfileData>) => void;
    clearProfileData: () => void;
    
    // loading: boolean
    // error: string | null
}
export type UserState = {
    user: User | null
    setUser: (user: User | null) => void
    clearUser: () => void
}