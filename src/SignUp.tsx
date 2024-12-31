import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SignUp: React.FC = () => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [otp, setOtp] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isOtpSent, setIsOtpSent] = useState<boolean>(false);
    const [token, setToken] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(""); // Reset error

        try {
            const response = await axios.post("http://127.0.0.1:8000/auth/signup", {
                email: email,
            });

            if (response.data.success) {
                setToken(response.data.token);
                setIsOtpSent(true);
                alert(response.data.message); 
            } else {
                setError("Sign up failed. Please try again.");
            }
        } catch (error: any) {
            // Handle error from server
            if (error.response) {
                setError(JSON.stringify(error.response.data, null, 2));
            } else {
                setError("An unexpected error occurred.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendOtp = async () => {
        setIsLoading(true);
        setError(""); // Reset error

        try {
            const response = await axios.post("http://127.0.0.1:8000/auth/resend-email", {
                email: email,
            });

            if (response.data.success) {
                setIsOtpSent(true);
                setToken(response.data.token);
                alert(response.data.message);
            } else {
                setError("Failed to resend OTP. Please try again.");
            }
        } catch (error: any) {
            if (error.response) {
                setError(JSON.stringify(error.response.data, null, 2));
            } else {
                setError("An unexpected error occurred.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleActivateAccount = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(""); // Reset error

        if (!token) {
            setError("No token available.");
            return;
        }

        try {
            const response = await axios.post("http://127.0.0.1:8000/auth/activate-account", {
                email: email,
                token: token,
                otp: otp,
                password: password,
            });

            if (response.data.success) {
                alert(response.data.message); 
                navigate("/signin"); // Redirect to sign-in page
            } else {
                setError("Account activation failed. Please try again.");
            }
        } catch (error: any) {
            if (error.response) {
                setError(JSON.stringify(error.response.data, null, 2));
            } else {
                setError("An unexpected error occurred.");
            }
        } finally {
            setIsLoading(false);
        }
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
            <div style={styles.container}>
                <h2>Sign Up</h2>
                <form onSubmit={handleSignUp} style={styles.form}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={styles.input}
                    />
                    {!isOtpSent && (
                        <button type="submit" disabled={isLoading} style={styles.button}>
                            {isLoading ? "Signing Up..." : "Sign Up"}
                        </button>
                    )}
                </form>

                {isOtpSent && (
                    <form onSubmit={handleActivateAccount} style={styles.form}>
                        <input
                            type="text"
                            placeholder="OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            required
                            style={styles.input}
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={styles.input}
                        />
                        <button type="submit" disabled={isLoading} style={styles.button}>
                            {isLoading ? "Activating Account..." : "Activate Account"}
                        </button>
                    </form>
                )}

                <button onClick={handleResendOtp} disabled={isLoading} style={styles.button}>
                    Resend OTP
                </button>

                {error && <pre style={styles.error}>{error}</pre>}
            </div>
        </>
    );
};

const styles = {
    container: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        padding: "5%",
        boxSizing: "border-box",
        textAlign: "center",
    },
    form: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "10px",
        width: "100%",
        maxWidth: "400px",
    },
    input: {
        padding: "10px",
        width: "100%",
        borderRadius: "5px",
        border: "1px solid #ccc",
    },
    button: {
        padding: "10px 5%",
        width: "100%",
        maxWidth: "400px",
        borderRadius: "5px",
        backgroundColor: "#4CAF50",
        color: "white",
        border: "none",
        cursor: "pointer",
        margin: "10px",
    },
    error: {
        color: "red",
        whiteSpace: "pre-wrap",
        marginTop: "10px",
    },
};

export default SignUp;
