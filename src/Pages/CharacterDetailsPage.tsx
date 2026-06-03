import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, MapPin, Orbit, Sparkles } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { StateBlock } from "../components/StateBlock";
import { StatusBadge } from "../components/StatusBadge";
import { fetchCharacter } from "../lib/api";

export function CharacterDetailsPage() {
    const params = useParams();
    const characterId = Number(params.characterId);

    const characterQuery = useQuery({
        queryKey: ["character", characterId],
        queryFn: () => fetchCharacter(characterId),
        enabled: Number.isFinite(characterId)
    });

    if (!Number.isFinite(characterId)) {
        return (
            <StateBlock
                title="Invalid character"
                description="The requested character ID is not valid."
                action={
                    <Link className="primary-button" to="/">
                        Back to explorer
                    </Link>
                }
            />
        );
    }

    if (characterQuery.isLoading) {
        return <StateBlock title="Loading character" description="Opening the character dossier." />;
    }

    if (characterQuery.isError || !characterQuery.data) {
        return (
            <StateBlock
                title="Character unavailable"
                description="This character could not be loaded from the API."
                action={
                    <Link className="primary-button" to="/">
                        Back to explorer
                    </Link>
                }
            />
        );
    }

    const character = characterQuery.data;

    return (
        <section className="details-page">
            <Link className="back-link" to="/">
                <ArrowLeft size={18} />
                Back to characters
            </Link>

            <article className="details-card">
                <div className="details-image-wrap">
                    <img src={character.image} alt={character.name} />
                </div>

                <div className="details-copy">
                    <div className="details-heading">
                        <p className="eyebrow">Character dossier</p>
                        <h1>{character.name}</h1>
                        <StatusBadge status={character.status} />
                    </div>

                    <p className="details-description">
                        {character.type || `${character.name} does not have a custom type description in the API.`}
                    </p>

                    <div className="details-grid">
                        <article>
                            <span>Species</span>
                            <strong>{character.species}</strong>
                        </article>
                        <article>
                            <span>Gender</span>
                            <strong>{character.gender}</strong>
                        </article>
                        <article>
                            <span>
                                <Orbit size={16} />
                                Origin
                            </span>
                            <strong>{character.origin.name}</strong>
                        </article>
                        <article>
                            <span>
                                <MapPin size={16} />
                                Last location
                            </span>
                            <strong>{character.location.name}</strong>
                        </article>
                        <article>
                            <span>
                                <Sparkles size={16} />
                                Episodes
                            </span>
                            <strong>{character.episode.length}</strong>
                        </article>
                    </div>
                </div>
            </article>
        </section>
    );
}
