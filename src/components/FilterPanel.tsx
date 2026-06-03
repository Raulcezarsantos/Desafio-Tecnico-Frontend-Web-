const statuses = ["Alive", "Dead", "unknown"];
const genders = ["Female", "Male", "Genderless", "unknown"];
const species = ["Human", "Alien", "Humanoid", "Poopybutthole", "Robot", "Animal", "Mythological Creature"];

interface FilterPanelProps {
    search: string;
    status: string;
    gender: string;
    species: string;
    onSearchChange: (value: string) => void;
    onFilterChange: (field: "status" | "gender" | "species", value: string) => void;
    onReset: () => void;
}

function SelectField({
    id,
    label,
    value,
    options,
    onChange
}: {
    id: string;
    label: string;
    value: string;
    options: string[];
    onChange: (value: string) => void;
}) {
    return (
        <label className="field">
            <span>{label}</span>
            <select id={id} value={value} onChange={(event) => onChange(event.target.value)}>
                <option value="">All</option>
                {options.map((option) => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </select>
        </label>
    );
}

export function FilterPanel({
    search,
    status,
    gender,
    species: selectedSpecies,
    onSearchChange,
    onFilterChange,
    onReset
}: FilterPanelProps) {
    return (
        <aside className="filter-panel">
            <div className="filter-panel-head">
                <div>
                    <p className="eyebrow">Filtros</p>
                    <h2>Monte sua busca</h2>
                </div>
                <button className="ghost-button" type="button" onClick={onReset}>
                    Limpar
                </button>
            </div>

            <label className="field">
                <span>Search by name</span>
                <input
                    type="search"
                    value={search}
                    onChange={(event) => onSearchChange(event.target.value)}
                    placeholder="Ex.: Morty, Summer, Beth"
                />
            </label>

            <div className="field-grid">
                <SelectField
                    id="status"
                    label="Status"
                    value={status}
                    options={statuses}
                    onChange={(value) => onFilterChange("status", value)}
                />
                <SelectField
                    id="gender"
                    label="Gender"
                    value={gender}
                    options={genders}
                    onChange={(value) => onFilterChange("gender", value)}
                />
                <SelectField
                    id="species"
                    label="Species"
                    value={selectedSpecies}
                    options={species}
                    onChange={(value) => onFilterChange("species", value)}
                />
            </div>
        </aside>
    );
}
