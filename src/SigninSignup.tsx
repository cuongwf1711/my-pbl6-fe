import React, { useState, useEffect } from 'react';

import { useNavigate } from 'react-router-dom';

const SigninSignup: React.FC = () => {
    const navigate = useNavigate(); 
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

    useEffect(() => {
        const token = localStorage.getItem('accessToken') || localStorage.getItem('refreshToken');
        if (token) {
            setIsLoggedIn(true);
            navigate('/predict');
        } else {
            setIsLoggedIn(false);
        }
    }, []);

    return (
        <div style={containerStyle}>
            <div style={boxStyle}>
                <h1 style={{ marginBottom: '20px' }}>Welcome to Colon Tissue Classification System</h1>
                <div style={{ marginTop: '20px' }}>
                    <button
                        style={{ ...buttonStyle }}
                        onClick={() => navigate('/signin')}
                    >
                        Signin/ Signup
                    </button>
                </div>
                <div style={{ marginTop: '20px' }}>
                    <button
                        style={{ ...buttonStyle, backgroundColor: 'gray' }}
                        onClick={() => navigate('/predict')} // Ensure navigate is called here
                    >
                        Continue as GUEST
                    </button>
                </div>
            </div>
        </div>
    );
};

const containerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    width: '100vw',
    margin: '0',
    padding: '0',
    backgroundImage: 'url("https://img.freepik.com/premium-vector/medical-equipment-set-vector_1273483-16983.jpg")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
};


const boxStyle = {
    textAlign: 'center',
    padding: '20px',
    backgroundColor: 'white',
    borderRadius: '10px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
    maxWidth: '80%',
    width: '100%',
};


const buttonStyle = {
    padding: '10px 20px',
    margin: '10px',
    fontSize: '16px',
    cursor: 'pointer',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: '#007BFF',
    color: 'white',
};

export default SigninSignup;
