import type { ReactNode } from "react";

interface StateBlockProps {
    title: string;
    description: string;
    action?: ReactNode;
}

export function StateBlock({ title, description, action }: StateBlockProps) {
    return (
        <div className="state-block">
            <h2>{title}</h2>
            <p>{description}</p>
            {action ? <div className="state-block-action">{action}</div> : null}
        </div>
    );
}
