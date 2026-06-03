import { useQuery } from "@tanstack/react-query";
import { startTransition } from "react";
import { useSearchParams } from "react-router-dom";
import { CharacterCard } from "../components/CharacterCard";
import { PageHero } from "../components/PageHero";
import { ResourceSelector } from "../components/ResourceSelector";
import { StateBlock } from "../components/StateBlock";
import { fetchCharactersByUrls, fetchEpisode, fetchEpisodeOptions } from "../lib/api";

function readEpisodeId(value: string | null): number {
    const id = Number(value ?? "1");
    return Number.isFinite(id) && id > 0 ? id : 1;
}

export function EpisodesPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const episodeId = readEpisodeId(searchParams.get("episode"));

    const optionsQuery = useQuery({
        queryKey: ["episode-options"],
        queryFn: fetchEpisodeOptions
    });

    const episodeQuery = useQuery({
        queryKey: ["episode", episodeId],
        queryFn: () => fetchEpisode(episodeId)
    });

    const castQuery = useQuery({
        queryKey: ["episode-characters", episodeQuery.data?.characters],
        queryFn: () => fetchCharactersByUrls(episodeQuery.data?.characters ?? []),
        enabled: Boolean(episodeQuery.data)
    });

    function updateEpisode(nextId: number) {
        startTransition(() => {
            setSearchParams(new URLSearchParams({ episode: String(nextId) }));
        });
    }

    const selectedEpisode = episodeQuery.data;

    return (
        <div className="page-stack">
            <PageHero
                eyebrow="Episodes"
                title={selectedEpisode?.name ?? "Explore episode casts"}
                description="Selecione um episodio e veja rapidamente quem faz parte daquele arco da serie."
                stats={[
                    { label: "Episode code", value: selectedEpisode?.episode ?? "..." },
                    { label: "Air date", value: selectedEpisode?.air_date ?? "..." },
                    { label: "Characters", value: String(selectedEpisode?.characters.length ?? 0) }
                ]}
            >
                {optionsQuery.data ? (
                    <ResourceSelector
                        label="Pick an episode"
                        value={episodeId}
                        options={optionsQuery.data}
                        onChange={updateEpisode}
                    />
                ) : null}
            </PageHero>

            {episodeQuery.isLoading || castQuery.isLoading ? (
                <StateBlock title="Loading episode" description="Collecting episode data and related characters." />
            ) : episodeQuery.isError || castQuery.isError ? (
                <StateBlock
                    title="Unable to load this episode"
                    description="Something went wrong while fetching the selected episode."
                />
            ) : castQuery.data && castQuery.data.length > 0 ? (
                <section className="card-grid">
                    {castQuery.data.map((character) => (
                        <CharacterCard key={character.id} character={character} />
                    ))}
                </section>
            ) : (
                <StateBlock
                    title="No cast available"
                    description="This episode does not expose characters in the current API response."
                />
            )}
        </div>
    );
}
