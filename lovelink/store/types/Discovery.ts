export type User = {
    id?: string
    fullName?: string
    email?: string
    password?: string
    profilePicture?: string |null
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
  matches: string[];
  likes: string[];
  dislikes: string[];
  setProfiles: (profiles: User[]) => void;
  setCurrentProfileIndex: (index: number | ((prev: number) => number)) => void; // 👈 allow updater
  setSwipeDirection: (direction: 'left' | 'right' | null) => void;
  updateFilters: (newFilters: Partial<DiscoverFilters>) => void;
  addMatch: (profileId: string) => void;
  addLike: (profileId: string) => void;
  addDislike: (profileId: string) => void;
}
