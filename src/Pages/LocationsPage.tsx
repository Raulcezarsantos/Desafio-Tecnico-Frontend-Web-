import { useQuery } from "@tanstack/react-query";
import { startTransition } from "react";
import { useSearchParams } from "react-router-dom";
import { CharacterCard } from "../components/CharacterCard";
import { PageHero } from "../components/PageHero";
import { ResourceSelector } from "../components/ResourceSelector";
import { StateBlock } from "../components/StateBlock";
import { fetchCharactersByUrls, fetchLocation, fetchLocationOptions } from "../lib/api";

function readLocationId(value: string | null): number {
    const id = Number(value ?? "1");
    return Number.isFinite(id) && id > 0 ? id : 1;
}

export function LocationsPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const locationId = readLocationId(searchParams.get("location"));

    const optionsQuery = useQuery({
        queryKey: ["location-options"],
        queryFn: fetchLocationOptions
    });

    const locationQuery = useQuery({
        queryKey: ["location", locationId],
        queryFn: () => fetchLocation(locationId)
    });

    const residentsQuery = useQuery({
        queryKey: ["location-residents", locationQuery.data?.residents],
        queryFn: () => fetchCharactersByUrls(locationQuery.data?.residents ?? []),
        enabled: Boolean(locationQuery.data)
    });

    function updateLocation(nextId: number) {
        startTransition(() => {
            setSearchParams(new URLSearchParams({ location: String(nextId) }));
        });
    }

    const selectedLocation = locationQuery.data;

    return (
        <div className="page-stack">
            <PageHero
                eyebrow="Locations"
                title={selectedLocation?.name ?? "Explore dimensions and planets"}
                description="Troque de localizacao e veja os residentes associados a cada ambiente do multiverso."
                stats={[
                    { label: "Type", value: selectedLocation?.type || "Unknown" },
                    { label: "Dimension", value: selectedLocation?.dimension || "Unknown" },
                    { label: "Residents", value: String(selectedLocation?.residents.length ?? 0) }
                ]}
            >
                {optionsQuery.data ? (
                    <ResourceSelector
                        label="Pick a location"
                        value={locationId}
                        options={optionsQuery.data}
                        onChange={updateLocation}
                    />
                ) : null}
            </PageHero>

            {locationQuery.isLoading || residentsQuery.isLoading ? (
                <StateBlock title="Loading location" description="Collecting residents for the selected dimension." />
            ) : locationQuery.isError || residentsQuery.isError ? (
                <StateBlock
                    title="Unable to load this location"
                    description="The selected location could not be resolved right now."
                />
            ) : residentsQuery.data && residentsQuery.data.length > 0 ? (
                <section className="card-grid">
                    {residentsQuery.data.map((character) => (
                        <CharacterCard key={character.id} character={character} />
                    ))}
                </section>
            ) : (
                <StateBlock
                    title="No residents found"
                    description="This location currently has no linked residents in the API."
                />
            )}
        </div>
    );
}
