import type {
    ApiListResponse,
    Character,
    CharacterFilters,
    Episode,
    Location,
    ResourceOption
} from "./types";

const API_BASE = "https://rickandmortyapi.com/api";

class ApiError extends Error {
    status: number;

    constructor(message: string, status: number) {
        super(message);
        this.status = status;
    }
}

async function fetchJson<T>(url: string): Promise<T> {
    const response = await fetch(url);

    if (!response.ok) {
        let message = "Request failed";

        try {
            const body = (await response.json()) as { error?: string };
            if (body.error) {
                message = body.error;
            }
        } catch {
            message = response.statusText || message;
        }

        throw new ApiError(message, response.status);
    }

    return response.json() as Promise<T>;
}

function createEmptyCharacters(page: number): ApiListResponse<Character> {
    return {
        info: {
            count: 0,
            pages: 0,
            next: null,
            prev: page > 1 ? String(page - 1) : null
        },
        results: []
    };
}

export async function fetchCharacters(filters: CharacterFilters): Promise<ApiListResponse<Character>> {
    const params = new URLSearchParams({
        page: String(filters.page)
    });

    if (filters.name) {
        params.set("name", filters.name);
    }

    if (filters.status) {
        params.set("status", filters.status);
    }

    if (filters.species) {
        params.set("species", filters.species);
    }

    if (filters.gender) {
        params.set("gender", filters.gender);
    }

    try {
        return await fetchJson<ApiListResponse<Character>>(`${API_BASE}/character?${params.toString()}`);
    } catch (error) {
        if (error instanceof ApiError && error.status === 404) {
            return createEmptyCharacters(filters.page);
        }

        throw error;
    }
}

export function fetchCharacter(characterId: number): Promise<Character> {
    return fetchJson<Character>(`${API_BASE}/character/${characterId}`);
}

export function fetchEpisode(episodeId: number): Promise<Episode> {
    return fetchJson<Episode>(`${API_BASE}/episode/${episodeId}`);
}

export function fetchLocation(locationId: number): Promise<Location> {
    return fetchJson<Location>(`${API_BASE}/location/${locationId}`);
}

export async function fetchCharactersByUrls(urls: string[]): Promise<Character[]> {
    if (urls.length === 0) {
        return [];
    }

    return Promise.all(urls.map((url) => fetchJson<Character>(url)));
}

async function fetchAllPages<T>(resource: "episode" | "location"): Promise<T[]> {
    const firstPage = await fetchJson<ApiListResponse<T>>(`${API_BASE}/${resource}`);
    const pages = firstPage.info.pages;

    if (pages <= 1) {
        return firstPage.results;
    }

    const remainingPages = await Promise.all(
        Array.from({ length: pages - 1 }, (_, index) =>
            fetchJson<ApiListResponse<T>>(`${API_BASE}/${resource}?page=${index + 2}`)
        )
    );

    return [firstPage, ...remainingPages].flatMap((page) => page.results);
}

export async function fetchEpisodeOptions(): Promise<ResourceOption[]> {
    const episodes = await fetchAllPages<Episode>("episode");
    return episodes.map((episode) => ({
        id: episode.id,
        label: episode.name,
        caption: `${episode.episode} • ${episode.air_date}`
    }));
}

export async function fetchLocationOptions(): Promise<ResourceOption[]> {
    const locations = await fetchAllPages<Location>("location");
    return locations.map((location) => ({
        id: location.id,
        label: location.name,
        caption: `${location.type || "Unknown type"} • ${location.dimension || "Unknown dimension"}`
    }));
}
