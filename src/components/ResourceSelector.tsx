import type { ResourceOption } from "../lib/types";

interface ResourceSelectorProps {
    label: string;
    value: number;
    options: ResourceOption[];
    onChange: (value: number) => void;
}

export function ResourceSelector({ label, value, options, onChange }: ResourceSelectorProps) {
    return (
        <label className="field resource-selector">
            <span>{label}</span>
            <select value={value} onChange={(event) => onChange(Number(event.target.value))}>
                {options.map((option) => (
                    <option key={option.id} value={option.id}>
                        {option.id}. {option.label}
                    </option>
                ))}
            </select>
        </label>
    );
}
