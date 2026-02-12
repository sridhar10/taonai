import "@/App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import JobsListPage from "./pages/JobsListPage";
import JobDetailsPage from "./pages/JobDetailsPage";

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" richColors closeButton />
      <Routes>
        <Route path="/" element={<Navigate to="/jobs" replace />} />
        <Route path="/jobs" element={<JobsListPage />} />
        <Route path="/jobs/:id" element={<JobDetailsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
