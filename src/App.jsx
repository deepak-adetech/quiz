import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import QuizPage from './pages/QuizPage';
import ResultsPage from './pages/ResultsPage';
import LibraryPage from './pages/LibraryPage';
import LeadsPage from './pages/admin/LeadsPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/quiz" element={<QuizPage />} />
        <Route path="/results" element={<ResultsPage />} />
        <Route path="/library" element={<LibraryPage />} />
        <Route path="/admin/leads" element={<LeadsPage />} />
      </Routes>
    </BrowserRouter>
  );
}
