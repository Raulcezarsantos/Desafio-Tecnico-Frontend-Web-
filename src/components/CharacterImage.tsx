import { useEffect, useState } from "react";

interface CharacterImageProps {
    src: string;
    alt: string;
    className?: string;
    fallbackLabel?: string;
}

function getInitials(label: string): string {
    return label
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() ?? "")
        .join("");
}

export function CharacterImage({
    src,
    alt,
    className = "",
    fallbackLabel
}: CharacterImageProps) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        setIsLoaded(false);
        setHasError(false);
    }, [src]);

    return (
        <div
            className={`character-image ${isLoaded ? "is-loaded" : ""} ${hasError ? "has-error" : ""} ${className}`.trim()}
            aria-label={alt}
        >
            {!hasError ? (
                <img
                    src={src}
                    alt={alt}
                    loading="lazy"
                    decoding="async"
                    onLoad={() => setIsLoaded(true)}
                    onError={() => setHasError(true)}
                />
            ) : null}

            {!isLoaded ? <div className="character-image-skeleton" aria-hidden="true" /> : null}

            {hasError ? (
                <div className="character-image-fallback" aria-hidden="true">
                    <strong>{getInitials(fallbackLabel ?? alt)}</strong>
                    <span>Image unavailable</span>
                </div>
            ) : null}
        </div>
    );
}
