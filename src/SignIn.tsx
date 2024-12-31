import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from './AuthContext';

const SignIn: React.FC = () => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const navigate = useNavigate();
    const { login } = useAuth(); 

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(""); 

        try {
            const response = await axios.post("http://127.0.0.1:8000/auth/signin", {
                username: email,
                password: password,
            });

            if (response.status === 200) {
                localStorage.setItem("refreshToken", response.data.refresh);
                localStorage.setItem("accessToken", response.data.access);
                localStorage.setItem("email", email);

                login(email);

                navigate("/predict");
            } else {
                setError("Login failed. Please try again.");
            }
        } catch (error: any) {
            if (error.response) {
                console.error("Error response:", error.response.data);
                setError(JSON.stringify(error.response.data, null, 2)); // Display full error
            } else if (error.request) {
                setError("Server did not respond. Please check your internet connection.");
                console.log("Error request:", error.request);
            } else {
                setError("An unexpected error occurred.");
                console.log("Error message:", error.message);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleSignUp = () => {
        navigate("/signup"); 
    };

    const handleForgotPassword = () => {
        navigate("/forgot-password"); 
    };

    return (
        <>
            <style>
                {`
            html, body, #root {
                margin: 0;
                padding: 0;
                width: 100%;
                height: 100%;
                box-sizing: border-box;
            }
        `}
            </style>
            <div style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100vh",
                backgroundColor: "#f7f7f7",
                padding: "0 20px",
                fontFamily: "Arial, sans-serif"
            }}>
                <h2 style={{
                    fontSize: "2rem",
                    color: "#333",
                    marginBottom: "20px"
                }}>Sign In</h2>
                <form
                    onSubmit={handleSignIn}
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        width: "100%",
                        maxWidth: "400px",
                        padding: "30px",
                        backgroundColor: "#fff",
                        borderRadius: "8px",
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                        gap: "15px"
                    }}
                >
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{
                            padding: "10px",
                            borderRadius: "5px",
                            border: "1px solid #ccc",
                            fontSize: "1rem",
                            marginBottom: "10px"
                        }}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{
                            padding: "10px",
                            borderRadius: "5px",
                            border: "1px solid #ccc",
                            fontSize: "1rem",
                            marginBottom: "10px"
                        }}
                    />
                    {error && (
                        <pre style={{
                            color: "red",
                            fontSize: "0.9rem",
                            whiteSpace: "pre-wrap",
                            wordWrap: "break-word",
                            marginBottom: "10px"
                        }}>
                            {error}
                        </pre>
                    )}
                    <button
                        type="submit"
                        disabled={isLoading}
                        style={{
                            padding: "12px 0",
                            backgroundColor: "#4CAF50",
                            color: "#fff",
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer",
                            fontSize: "1rem",
                            transition: "background-color 0.3s"
                        }}
                    >
                        {isLoading ? "Logging in..." : "Sign In"}
                    </button>
                </form>
                <div style={{
                    marginTop: "20px",
                    display: "flex",
                    justifyContent: "center",
                    gap: "15px"
                }}>
                    <button
                        onClick={handleSignUp}
                        disabled={isLoading}
                        style={{
                            backgroundColor: "transparent",
                            color: "#4CAF50",
                            border: "1px solid #4CAF50",
                            padding: "8px 15px",
                            borderRadius: "5px",
                            cursor: "pointer",
                            fontSize: "1rem",
                            transition: "background-color 0.3s"
                        }}
                    >
                        Sign Up
                    </button>
                    <button
                        onClick={handleForgotPassword}
                        disabled={isLoading}
                        style={{
                            backgroundColor: "transparent",
                            color: "#4CAF50",
                            border: "1px solid #4CAF50",
                            padding: "8px 15px",
                            borderRadius: "5px",
                            cursor: "pointer",
                            fontSize: "1rem",
                            transition: "background-color 0.3s"
                        }}
                    >
                        Forgot Password
                    </button>
                </div>
            </div>
        </>
    );
};

export default SignIn;
