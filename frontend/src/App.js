import "@/App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import JobsListPage from "./pages/JobsListPage";
import JobDetailsPage from "./pages/JobDetailsPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/jobs" replace />} />
        <Route path="/jobs" element={<JobsListPage />} />
        <Route path="/jobs/:id" element={<JobDetailsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
