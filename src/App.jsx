import { useState } from "react";
import { Drawer, List, ListItem, ListItemText, Button, Box } from "@mui/material";
import { Routes, Route } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { auth } from "./firebaseConfig";  
import { signOut } from "firebase/auth";
import StudentsPage from "./Components/StudentsPage";  // Corrected import
import LoginPage from "./Components/LoginPage";  // Corrected import

const Dashboard = () => {
    const [open, setOpen] = useState(false);  // Sidebar open/close state
    const navigate = useNavigate();  // React Router navigate hook

    const handleLogout = async () => {
        try {
            await signOut(auth);  // Firebase logout
            navigate("/");  // Navigate to login page after logout
        } catch (error) {
            console.error("Error logging out: ", error);
        }
    };

    return (
        <Box sx={{ display: "flex" }}>
            {/* Sidebar */}
            <Drawer open={open} onClose={() => setOpen(false)}>
                <List sx={{ width: 250 }}>
                    <ListItem button onClick={() => navigate("/students")}>
                        <ListItemText primary="Students Page" />
                    </ListItem>
                    <ListItem button onClick={handleLogout}>
                        <ListItemText primary="Logout" />
                    </ListItem>
                </List>
            </Drawer>

            {/* Main Content */}
            <Box sx={{ flexGrow: 1, padding: 3 }}>
                <Button onClick={() => setOpen(true)} variant="contained">Open Sidebar</Button>
                <Routes>
                    <Route path="/students" element={<StudentsPage />} />
                    {/* Add more routes as needed */}
                </Routes>
            </Box>
        </Box>
    );
};

const App = () => {
    return (
        <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/login" element={<LoginPage />} />
        </Routes>
    );
};

export default App;