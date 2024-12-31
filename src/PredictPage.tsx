import React, { useEffect, useState } from 'react';

interface ModelOption {
    key: number;
    name: string;
}

interface PredictionResponse {
    id: string;
    predict: string;
    vietnamese_predict: string;
    confidence: string;
    origin_image: string;
    gradcam_image: string;
}

const PredictPage: React.FC = () => {
    const [models, setModels] = useState<ModelOption[]>([]);
    const [selectedModel, setSelectedModel] = useState<number>(0);
    const [file, setFile] = useState<File | null>(null);
    const [prediction, setPrediction] = useState<PredictionResponse | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [comment, setComment] = useState<string>(''); 
    const [commentResponse, setCommentResponse] = useState<string | null>(null);

    useEffect(() => {
        fetch('http://127.0.0.1:8000/predicts?value=model_type', {
            method: 'GET',
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                console.log('Fetched data:', data);

                setModels(data);
                setSelectedModel(data.length > 0 ? data[0]?.key : 0);
            })
            .catch((err) => {
                console.error('Error fetching models:', err);
                setError(`Error fetching models: ${err.message}`);
            });
    }, []);

    const handleModelChange = (key: number) => {
        setSelectedModel(key); 
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setFile(event.target.files[0]);
        }
    };

    const handleSubmit = () => {
        if (!file) {
            setError('Please upload a file.');
            return;
        }

        const formData = new FormData();
        formData.append('model_type', String(selectedModel));
        formData.append('image', file);

        const accessToken = localStorage.getItem('accessToken');

        fetch('http://127.0.0.1:8000/predicts/pathology', {
            method: 'POST',
            headers: {
                ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
            },
            body: formData,
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to fetch prediction.');
                }
                return response.json();
            })
            .then((data) => {
                setPrediction(data);
                setError(null);
            })
            .catch((err) => setError('Error fetching prediction: ' + err.message));
    };


    const handleRefresh = () => {
        if (prediction) {
            const updatedPrediction = {
                ...prediction,
                origin_image: `${prediction.origin_image}?t=${new Date().getTime()}`,
                gradcam_image: `${prediction.gradcam_image}?t=${new Date().getTime()}`,
            };
            setPrediction(updatedPrediction);
        }
    };

    const handleCommentSubmit = () => {
        if (!prediction) {
            setError('No prediction available to comment on.');
            return;
        }

        const accessToken = localStorage.getItem('accessToken');

        fetch(`http://127.0.0.1:8000/predicts/pathology/${prediction.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
            },
            body: JSON.stringify({ comment }),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                if (data && data.success !== undefined) {
                    if (data.success) {
                        setCommentResponse(data.message);
                        setError(null);
                        setComment('');
                    } else {
                        setError(`Error: ${data.message || 'Unknown error occurred'}`);
                        setCommentResponse(null);
                    }
                } else {
                    setError('Unexpected response structure.');
                    setCommentResponse(null);
                }
            })
            .catch((err) => {
                setError(`Error submitting comment: ${err.message}`);
                setCommentResponse(null);
            });
    };

    return (
        <div style={containerStyle}>
            <div style={boxStyle}>
                <h1>Welcome</h1>
                <div>
                    <h3>Select a Model</h3>
                    {models.map((model) => (
                        <div key={model.key} style={{ marginBottom: '10px', textAlign: 'left', paddingLeft: '35%' }}>
                            <label>
                                <input
                                    type="radio"
                                    name="model"
                                    value={model.key}
                                    checked={selectedModel === model.key}
                                    onChange={() => handleModelChange(model.key)}
                                />
                                {model.name}
                            </label>
                        </div>
                    ))}
                </div>
                <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <h3 style={{ marginRight: '10px' }}>Upload a File</h3>
                    <input type="file" onChange={handleFileChange} />
                </div>

                <button onClick={handleSubmit} style={submitButtonStyle}>
                    Submit
                </button>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {prediction && (
                    <div style={{ marginTop: '20px', textAlign: 'left' }}>
                        <h3>Prediction Result</h3>
                        <p><strong>Predict:</strong> {prediction.predict}</p>
                        <p><strong>Vietnamese Label:</strong> {prediction.vietnamese_predict}</p>
                        <p><strong>Confidence:</strong> {prediction.confidence}</p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                            <img
                                src={prediction.origin_image}
                                alt="Origin"
                                style={{ width: '45%', border: '1px solid #ccc', borderRadius: '5px' }}
                            />
                            <img
                                src={prediction.gradcam_image}
                                alt="Grad-CAM"
                                style={{ width: '45%', border: '1px solid #ccc', borderRadius: '5px' }}
                            />
                        </div>
                        <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                            {/* Refresh Button */}
                            <button onClick={handleRefresh} style={submitButtonStyle}>
                                Refresh
                            </button>
                            {/* Comment Button */}
                            <button onClick={handleCommentSubmit} style={submitButtonStyle}>
                                Comment
                            </button>
                        </div>
                        {/* Comment Textbox */}
                        <input
                            type="text"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Enter your comment"
                            style={{
                                width: '100%',
                                padding: '10px',
                                fontSize: '14px',
                                marginTop: '10px',
                                border: '1px solid #ccc',
                                borderRadius: '5px',
                            }}
                        />
                        {commentResponse && <p style={{ color: 'green', marginTop: '10px' }}>{commentResponse}</p>}
                    </div>
                )}
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
    padding: '20px', // Thêm padding để tránh nội dung sát viền
    backgroundImage:
        'url("https://www.shutterstock.com/image-vector/health-care-medical-icon-set-260nw-2507491861.jpg")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    boxSizing: 'border-box',
};

const boxStyle = {
    textAlign: 'center',
    padding: '40px',
    marginTop: '50px',
    backgroundColor: 'white',
    borderRadius: '10px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
    maxWidth: '50%',
    width: '100%',
    boxSizing: 'border-box',
};


const submitButtonStyle = {
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#007BFF',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
};

export default PredictPage;
