


export type MatchStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED';

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
    gender: string
}
export interface Match {
    id: string;
    user1Id: string;
    user2Id: string;
    user1?: User; // optional because sometimes backend won't populate relations
    user2?: User;
    status: MatchStatus;
    compatibilityScore?: number;
    lastMessage?: string | Date; // can come from API as ISO string
    createdAt: string | Date;
    updatedAt: string | Date;
    matchDate: string | Date;
    isSuperLike: boolean;
    section?: string;
    locationId?: string;
    location?: Location;
    
}


export interface MatchState {
  matches: Match[];
  selectedMatch: Match | null;
  setMatches: (matches: Match[]) => void;
  addMatch: (match: Match) => void;
  updateMatch: (id: string, updates: Partial<Match>) => void;
  removeMatch: (id: string) => void;
  selectMatch: (match: Match | null) => void;
}
