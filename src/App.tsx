import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom';
import SigninSignup from './SigninSignup';
import PredictPage from './PredictPage';
import AccountPage from './AccountPage';
import HistoryPage from './HistoryPage'; 
import SignIn from './SignIn';
import SignUp from './SignUp';
import ForgotPassword from './ForgotPassword';
import { AuthProvider, useAuth } from './AuthContext';
import Header from './Header';


const App: React.FC = () => {
    return (
        <AuthProvider>
            <Router>
                <Header />
                <div style={{ marginTop: '80px' }}>
                    <Routes>
                        <Route path="/" element={<SigninSignup />} />
                        <Route path="/predict" element={<PredictPage />} />
                        <Route path="/account" element={<AccountPage />} />
                        <Route path="/history" element={<HistoryPage />} />
                        <Route path="/signin" element={<SignIn />} />
                        <Route path="/signup" element={<SignUp />} />
                        <Route path="/forgot-password" element={<ForgotPassword />} />
                    </Routes>
                </div>
            </Router>
        </AuthProvider>
    );
};

export default App;
