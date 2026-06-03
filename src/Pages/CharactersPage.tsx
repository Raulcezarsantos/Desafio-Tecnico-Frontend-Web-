import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { startTransition, useEffect, useState } from "react";
import { FilterPanel } from "../components/FilterPanel";
import { CharacterCard } from "../components/CharacterCard";
import { PageHero } from "../components/PageHero";
import { PaginationBar } from "../components/PaginationBar";
import { StateBlock } from "../components/StateBlock";
import { fetchCharacters } from "../lib/api";
import { useSearchParams } from "react-router-dom";

function readPage(value: string | null): number {
    const page = Number(value ?? "1");
    return Number.isFinite(page) && page > 0 ? page : 1;
}

export function CharactersPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [searchDraft, setSearchDraft] = useState(searchParams.get("name") ?? "");

    const page = readPage(searchParams.get("page"));
    const status = searchParams.get("status") ?? "";
    const gender = searchParams.get("gender") ?? "";
    const species = searchParams.get("species") ?? "";
    const name = searchParams.get("name") ?? "";

    useEffect(() => {
        setSearchDraft(name);
    }, [name]);

    const charactersQuery = useQuery({
        queryKey: ["characters", page, name, status, gender, species],
        queryFn: () =>
            fetchCharacters({
                page,
                name,
                status,
                gender,
                species
            }),
        placeholderData: keepPreviousData
    });

    function updateParams(updates: Record<string, string | null>) {
        startTransition(() => {
            const nextParams = new URLSearchParams(searchParams);

            Object.entries(updates).forEach(([key, value]) => {
                if (value) {
                    nextParams.set(key, value);
                } else {
                    nextParams.delete(key);
                }
            });

            setSearchParams(nextParams);
        });
    }

    const result = charactersQuery.data;
    const totalCharacters = result?.info.count ?? 0;
    const totalPages = result?.info.pages ?? 0;

    return (
        <div className="page-stack">
            <PageHero
                eyebrow="Character explorer"
                title="Uma interface moderna para explorar personagens, status e universos da serie."
                description="Busca responsiva, filtros por atributos e navegacao fluida com estado sincronizado na URL."
                stats={[
                    { label: "Characters found", value: totalCharacters.toString() },
                    { label: "Current page", value: page.toString() },
                    { label: "Active filters", value: [status, gender, species].filter(Boolean).length.toString() }
                ]}
            >
                <FilterPanel
                    search={searchDraft}
                    status={status}
                    gender={gender}
                    species={species}
                    onSearchChange={(value) => {
                        setSearchDraft(value);
                        updateParams({
                            name: value.trim() || null,
                            page: "1"
                        });
                    }}
                    onFilterChange={(field, value) =>
                        updateParams({
                            [field]: value || null,
                            page: "1"
                        })
                    }
                    onReset={() => {
                        setSearchDraft("");
                        setSearchParams(new URLSearchParams());
                    }}
                />
            </PageHero>

            {charactersQuery.isLoading ? (
                <StateBlock title="Loading characters" description="Fetching data from the Rick and Morty API." />
            ) : charactersQuery.isError ? (
                <StateBlock
                    title="Unable to load characters"
                    description="The API did not respond as expected. Try again in a moment."
                />
            ) : result && result.results.length > 0 ? (
                <>
                    <section className="card-grid">
                        {result.results.map((character) => (
                            <CharacterCard key={character.id} character={character} />
                        ))}
                    </section>

                    <PaginationBar
                        currentPage={page}
                        totalPages={totalPages}
                        onPageChange={(nextPage) => updateParams({ page: String(nextPage) })}
                    />
                </>
            ) : (
                <StateBlock
                    title="No characters found"
                    description="Adjust the filters or search term to discover another part of the multiverse."
                />
            )}
        </div>
    );
}
