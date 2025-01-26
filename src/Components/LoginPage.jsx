import { useState } from "react";
import { auth } from "../firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { Box, Button, TextField, Typography, Paper } from "@mui/material";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate("/dashboard");
        } catch (error) {
            alert("Login failed. " + error.message);
        }
    };

    return (
        <Box
            sx={{
                height: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <Paper elevation={3} sx={{ padding: 4, width: 300 }}>
                <Typography variant="h5" textAlign="center" marginBottom={2}>
                    Login
                </Typography>
                <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    margin="normal"
                />
                <TextField
                    fullWidth
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    margin="normal"
                />
                <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    onClick={handleLogin}
                    sx={{ marginTop: 2 }}
                >
                    Login
                </Button>
            </Paper>
        </Box>
    );
};

export default LoginPage;