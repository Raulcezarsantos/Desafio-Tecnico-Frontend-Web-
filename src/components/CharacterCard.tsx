import { MapPin, Orbit } from "lucide-react";
import { Link } from "react-router-dom";
import type { Character } from "../lib/types";
import { StatusBadge } from "./StatusBadge";

interface CharacterCardProps {
    character: Character;
}

export function CharacterCard({ character }: CharacterCardProps) {
    return (
        <Link className="character-card" to={`/characters/${character.id}`}>
            <div className="character-card-image-wrap">
                <img src={character.image} alt={character.name} loading="lazy" />
                <StatusBadge status={character.status} />
            </div>

            <div className="character-card-copy">
                <div className="character-card-topline">
                    <span>{character.species}</span>
                    <span>{character.gender}</span>
                </div>
                <h3>{character.name}</h3>
                <p>{character.type || "No special type registered for this character."}</p>

                <dl className="character-meta">
                    <div>
                        <dt>
                            <Orbit size={16} />
                            Origin
                        </dt>
                        <dd>{character.origin.name}</dd>
                    </div>
                    <div>
                        <dt>
                            <MapPin size={16} />
                            Last location
                        </dt>
                        <dd>{character.location.name}</dd>
                    </div>
                </dl>
            </div>
        </Link>
    );
}
