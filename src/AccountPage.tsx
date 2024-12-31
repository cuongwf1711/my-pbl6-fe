import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const AccountPage: React.FC = () => {
    const [oldPassword, setOldPassword] = useState<string>('');
    const [newPassword, setNewPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleChangePassword = async () => {
        if (newPassword !== confirmPassword) {
            setError('Mật khẩu mới và mật khẩu xác nhận không khớp');
            return;
        }

        try {
            const accessToken = localStorage.getItem('accessToken');

            if (!accessToken) {
                setError('Không tìm thấy token, vui lòng đăng nhập lại');
                return;
            }

            const response = await fetch('http://127.0.0.1:8000/auth/change-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
                body: JSON.stringify({
                    old_password: oldPassword,
                    new_password: newPassword,
                }),
            });

            if (response.ok) {
                logout();
                navigate('/');
            } else {
                setError('Đổi mật khẩu thất bại. Vui lòng thử lại');
            }
        } catch (error) {
            setError('Có lỗi xảy ra. Vui lòng thử lại sau.');
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
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    minHeight: '100vh',
                    padding: '5%',
                    boxSizing: 'border-box',
                    textAlign: 'center',
                }}
            >
                <h2>Profile Page</h2>

                <h3>Change Password</h3>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '10px',
                        width: '100%',
                        maxWidth: '400px',
                    }}
                >
                    <input
                        type="password"
                        placeholder="Old Password"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        style={{
                            padding: '10px',
                            width: '100%',
                            borderRadius: '5px',
                            border: '1px solid #ccc',
                        }}
                    />
                    <input
                        type="password"
                        placeholder="New Password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        style={{
                            padding: '10px',
                            width: '100%',
                            borderRadius: '5px',
                            border: '1px solid #ccc',
                        }}
                    />
                    <input
                        type="password"
                        placeholder="Confirm New Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        style={{
                            padding: '10px',
                            width: '100%',
                            borderRadius: '5px',
                            border: '1px solid #ccc',
                        }}
                    />
                    <button
                        onClick={handleChangePassword}
                        style={{
                            padding: '10px 5%',
                            width: '100%',
                            maxWidth: '400px',
                            borderRadius: '5px',
                            backgroundColor: '#4CAF50',
                            color: 'white',
                            border: 'none',
                            cursor: 'pointer',
                        }}
                    >
                        Change Password
                    </button>
                </div>

                {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
            </div>
        </>
    );
};

export default AccountPage;
