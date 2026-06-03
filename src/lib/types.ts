export interface ApiListInfo {
    count: number;
    pages: number;
    next: string | null;
    prev: string | null;
}

export interface ApiListResponse<T> {
    info: ApiListInfo;
    results: T[];
}

export interface NamedReference {
    name: string;
    url: string;
}

export interface Character {
    id: number;
    name: string;
    status: "Alive" | "Dead" | "unknown";
    species: string;
    type: string;
    gender: string;
    origin: NamedReference;
    location: NamedReference;
    image: string;
    episode: string[];
}

export interface Episode {
    id: number;
    name: string;
    air_date: string;
    episode: string;
    characters: string[];
}

export interface Location {
    id: number;
    name: string;
    type: string;
    dimension: string;
    residents: string[];
}

export interface CharacterFilters {
    page: number;
    name?: string;
    status?: string;
    species?: string;
    gender?: string;
}

export interface ResourceOption {
    id: number;
    label: string;
    caption?: string;
}
