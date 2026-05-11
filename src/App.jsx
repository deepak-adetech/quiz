import { BrowserRouter, Routes, Route } from 'react-router-dom';
import QuizPage from './pages/QuizPage';
import ResultsPage from './pages/ResultsPage';
import StartPage from './pages/StartPage';
import LeadsPage from './pages/admin/LeadsPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<QuizPage />} />
        <Route path="/results" element={<ResultsPage />} />
        <Route path="/start" element={<StartPage />} />
        <Route path="/admin/leads" element={<LeadsPage />} />
      </Routes>
    </BrowserRouter>
  );
}
