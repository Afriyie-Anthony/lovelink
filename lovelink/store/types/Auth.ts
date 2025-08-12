export type User = {
    id: string
    fullName: string
    email: string
    password: string
    profilePicture: string
    bio: string
    birthDate: Date
    age: number
}


export type AuthState = {
    user: User | null
    token: string | null
    setToken: (token: string) => void
    setUser: (user: User | null) => void;
    logout: () => void
    // loading: boolean
    // error: string | null
}