import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const Header: React.FC = () => {
    const { isLoggedIn, email, logout } = useAuth(); 
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/'); 
    };

    const handleHistory = () => {
        navigate('/history');
    };

    return (
        <header
            style={{
                padding: '10px',
                textAlign: 'center',
                backgroundColor: 'white',
                color: 'black',
                position: 'fixed',
                top: '0',
                left: '0',
                right: '0',
                zIndex: 1000,
                boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
            }}
        >
            <nav>
                <Link to="/" style={{ margin: '0 10px' }}>
                    <img
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRwaAebdj-NQwguyZ1hM9VzRs0hC28DZumokJmYSuvnPJlKNbK24i07xyym_9-BlT4TFJ8&usqp=CAU"
                        alt="Home"
                        style={{ height: '60px', width: '60px', objectFit: 'cover' }}
                    />
                </Link>
                {isLoggedIn && email && (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Link to="/account" style={{ margin: '0 10px' }}>
                            <img
                                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_orGCClk1tnfT2sZLqrWiL6QOLyA_g05VxA&s"
                                alt="Account"
                                style={{ height: '60px', width: '60px', objectFit: 'cover' }}
                            />
                        </Link>
                        <span style={{ fontSize: '18px', margin: '0 10px' }}>
                            Welcome, {email}
                        </span>
                        <button
                            onClick={handleLogout}
                            style={{
                                margin: '0 10px',
                                padding: '10px 20px',
                                fontSize: '16px',
                                backgroundColor: 'blue',
                                color: 'white',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer',
                            }}
                        >
                            Logout
                        </button>
                        <button
                            onClick={handleHistory}
                            style={{
                                margin: '0 10px',
                                padding: '10px 20px',
                                fontSize: '16px',
                                backgroundColor: 'blue',
                                color: 'white',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer',
                            }}
                        >
                            History
                        </button>
                    </div>
                )}
            </nav>
        </header>
    );
};

export default Header;
