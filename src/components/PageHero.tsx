import type { ReactNode } from "react";

interface PageHeroProps {
    eyebrow: string;
    title: string;
    description: string;
    stats?: Array<{ label: string; value: string }>;
    children?: ReactNode;
}

export function PageHero({ eyebrow, title, description, stats = [], children }: PageHeroProps) {
    return (
        <section className="page-hero">
            <div className="page-hero-copy">
                <p className="eyebrow">{eyebrow}</p>
                <h1>{title}</h1>
                <p className="page-hero-description">{description}</p>

                {stats.length > 0 ? (
                    <div className="hero-stats">
                        {stats.map((stat) => (
                            <article key={stat.label}>
                                <strong>{stat.value}</strong>
                                <span>{stat.label}</span>
                            </article>
                        ))}
                    </div>
                ) : null}
            </div>

            {children ? <div className="page-hero-panel">{children}</div> : null}
        </section>
    );
}
