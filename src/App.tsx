import { Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "./components/AppShell";
import { CharacterDetailsPage } from "./Pages/CharacterDetailsPage";
import { CharactersPage } from "./Pages/CharactersPage";
import { EpisodesPage } from "./Pages/EpisodesPage";
import { LocationsPage } from "./Pages/LocationsPage";

function App() {
    return (
        <AppShell>
            <Routes>
                <Route path="/" element={<CharactersPage />} />
                <Route path="/episodes" element={<EpisodesPage />} />
                <Route path="/locations" element={<LocationsPage />} />
                <Route path="/characters/:characterId" element={<CharacterDetailsPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </AppShell>
    );
}

export default App;
