import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./Components/LoginPage";
import StudentsPage from "./Components/StudentsPage";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <Router>
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/students" element={<StudentsPage />} />
                <Route path="/dashboard" element={<App />} />
            </Routes>
        </Router>
    </React.StrictMode>
);
