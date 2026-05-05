import { BrowserRouter, Routes, Route } from 'react-router-dom';
import QuizPage from './pages/QuizPage';
import ResultsPage from './pages/ResultsPage';
import LeadsPage from './pages/admin/LeadsPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<QuizPage />} />
        <Route path="/results" element={<ResultsPage />} />
        <Route path="/admin/leads" element={<LeadsPage />} />
      </Routes>
    </BrowserRouter>
  );
}
