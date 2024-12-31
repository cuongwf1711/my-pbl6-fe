import React, { useState, useEffect } from 'react';

const HistoryPage: React.FC = () => {
    const [history, setHistory] = useState<any[]>([]);
    const [error, setError] = useState<string>('');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const accessToken = localStorage.getItem('accessToken');

    useEffect(() => {
        const fetchHistory = async () => {
            if (!accessToken) {
                setError('No access token found');
                return;
            }

            try {
                const response = await fetch(`http://127.0.0.1:8000/predicts/pathology?page=${currentPage}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch history');
                }

                const data = await response.json();
                setHistory(data.results);
                setTotalPages(Math.ceil(data.count / 10)); // Assuming 10 results per page
            } catch (error) {
                setError('An error occurred while fetching the history.');
            }
        };

        fetchHistory();
    }, [accessToken, currentPage]);

    const handlePageChange = (newPage: number) => {
        if (newPage > 0 && newPage <= totalPages) {
            setCurrentPage(newPage);
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
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f9f9f9', padding: '20px' }}>
                <div style={{ width: '100%' }}>
                    <h2 style={{ textAlign: 'center' }}>Prediction History</h2>

                    {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

                    <div>
                        {history.length === 0 ? (
                            <p style={{ textAlign: 'center' }}>No history available.</p>
                        ) : (
                            history.map((item, index) => (
                                <div key={item.id} style={{ marginBottom: '20px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#fff' }}>
                                    <h3>
                                        {currentPage * 10 - 10 + index + 1}. {item.predict_name} / {item.vietnamese_predict_name} ({item.confidence_percentage})
                                    </h3>
                                    <p><strong>Label:</strong> {item.label_name} / {item.vietnamese_label_name}</p>
                                    <p><strong>Model:</strong> {item.model_name}</p>
                                    <p><strong>Comment:</strong> {item.comment}</p>
                                    <p><strong>Created At:</strong> {new Date(item.created_at).toLocaleString()}</p>
                                    <div style={{ textAlign: 'center', marginTop: '20px' }}>
                                        <div
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'center', 
                                                alignItems: 'center',
                                                gap: '20px',
                                                marginTop: '10px',
                                            }}
                                        >
                                            {/* Original Image */}
                                            <div style={{ textAlign: 'center' }}>
                                                <p><strong>Original Image:</strong></p>
                                                <img
                                                    src={item.origin_image_url}
                                                    alt="Original"
                                                    style={{
                                                        width: '448px',
                                                        height: '448px',
                                                        objectFit: 'contain',
                                                        border: '1px solid #ccc',
                                                        borderRadius: '8px',
                                                    }}
                                                />
                                            </div>

                                            {/* Grad-CAM Image */}
                                            <div style={{ textAlign: 'center' }}>
                                                <p><strong>Grad-CAM Image:</strong></p>
                                                <img
                                                    src={item.gradcam_image_url}
                                                    alt="Grad-CAM"
                                                    style={{
                                                        width: '448px',
                                                        height: '448px',
                                                        objectFit: 'contain',
                                                        border: '1px solid #ccc',
                                                        borderRadius: '8px',
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            ))
                        )}
                    </div>

                    <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            Previous
                        </button>
                        <span>Page {currentPage} of {totalPages}</span>
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default HistoryPage;
