import './Home.css';
import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone, faCirclePlay, faCircleStop } from '@fortawesome/free-solid-svg-icons';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'

function Home() {
    const { transcript, resetTranscript } = useSpeechRecognition()
    const [listening, setListening] = useState(false);
    const [imageUrl, setImageUrl] = useState(null);
    const [showTitle, setShowTitle] = useState(false);
    const [storyTitle, setStoryTitle] = useState('');
    const [loading, setLoading] = useState(false);
    const [isFadingOut, setIsFadingOut] = useState(false);


    useEffect(() => {
        const words = transcript.split(' ');
        if (words.length >= 20 && transcript.length > 0) {
            console.log("chunk:", transcript);

            const sendData = async () => {
                try {
                    const response = await fetch('https://fastapi-production-cd88.up.railway.app/transcript', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ transcript: transcript }),
                        mode: 'cors',
                    });

                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }

                    const data = await response.json();
                    console.log(data.message);
                    setImageUrl(data.message);
                } catch (error) {
                    console.error('Network error:', error);
                }
            };

            sendData();
            resetTranscript();
        }
    }, [transcript, resetTranscript]);

    useEffect(() => {
        if (listening) {
            SpeechRecognition.startListening({
                continuous: true,
                onResult: (event) => {
                    const transcript = event.results[event.resultIndex][0].transcript;
                },
                onEnd: () => {
                    SpeechRecognition.stopListening();
                },
                onError: (event) => {
                    console.error('Speech recognition error:', event.error);
                },
                onStart: () => {
                    console.log('Speech recognition started');
                }
            });
        } else {
            SpeechRecognition.stopListening();
        }
    }, [listening]);

    const handleMic = () => {
        if (!listening) {
            setIsFadingOut(true);
            setTimeout(() => {
                setShowTitle(true);
                resetTranscript();
                setIsFadingOut(false);
            }, 500);
        }
        if (listening) {
            setIsFadingOut(true);
            setTimeout(() => {
                setListening(false);
                setShowTitle(false);
                setStoryTitle('');
                setIsFadingOut(false);
            }, 500);
        }
    };

    const handleTitleChange = (event) => {
        setStoryTitle(event.target.value);
    };

    const handleStart = async () => {
        if (!listening) {
            resetTranscript();
        }
        if (storyTitle && storyTitle.length > 0) {
            setIsFadingOut(true);
            setTimeout(() => {
                setLoading(true);
                setIsFadingOut(false);
            }, 500);
            try {
                const response = await fetch('https://fastapi-production-cd88.up.railway.app/titleScreen', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ transcript: storyTitle }),
                    mode: 'cors',
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                console.log(data.message);
                setImageUrl(data.message);
            } catch (error) {
                console.error('Network error:', error);
            } finally {
                setLoading(false);
                setListening(!listening);
                console.log('listening', listening);
            }
        }
    };


    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#003B53' }}>
            <div style={{
                padding: '16px', boxShadow: '0   1px   2px rgba(0,   0,   0,   0.05)', borderRadius: '4px', textAlign: 'center',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                {!listening && (
                    <div style={{ marginTop: '100px', height: '400px' }}>
                        <p style={{ textAlign: 'center', fontSize: '30px', margin: 0, color: 'white' }}>Welcome to</p>
                        <p style={{ textAlign: 'center', fontWeight: 'lighter', fontSize: '120px', margin: 0, color: 'white', textShadow: '0  0  20px rgba(255,  255,  255,  1.0)' }}>luna</p>
                        <div style={{ height: '15vh' }} />

                        {(showTitle && !loading) && (
                            <div style={{ height: '100px' }}>
                                <div>
                                    <input
                                        name="storyTitle"
                                        placeholder="Title your story"
                                        value={storyTitle}
                                        onChange={handleTitleChange}
                                        onKeyPress={(event) => {
                                            if (event.key === 'Enter') {
                                                handleStart();
                                            }
                                        }}
                                        className={`fade-in-input ${isFadingOut ? 'fade-out-button' : ''}`}
                                        style={{
                                            width: '250px',
                                            height: '50px',
                                            paddingBottom: '10px',
                                            paddingLeft: '15px',
                                            paddingTop: '10px',
                                            borderRadius: '15px',
                                            border: '1px solid white',
                                            backgroundColor: 'rgba(0,   91,   129,   0.25)',
                                            color: 'white',
                                            fontSize: '19px',
                                            marginBottom: '80px',
                                            boxShadow: '0  0  10px rgba(255,  255,  255,  0.5)',
                                            '::placeholder': {
                                                color: 'white',
                                                opacity: 1,
                                            },
                                        }}
                                    />
                                </div>
                                <div>
                                    {storyTitle.length > 0 && (
                                        <button
                                            onClick={handleStart}
                                            className={`fade-in-input ${isFadingOut ? 'fade-out-button' : ''}`}
                                            style={{ padding: 2, borderRadius: '100%', border: 'none', backgroundColor: '#005B81' }}
                                        >
                                            <FontAwesomeIcon icon={faCirclePlay} color={'#FFFFFF'} size="4x" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}

                        {(showTitle && loading) && (
                            <div className='fade-in-input'>
                                <p style={{ textAlign: 'center', fontSize: '20px', margin: 0, color: 'white', marginBottom: 20 }}> Once upon a time...</p>
                                <div className="spinner">
                                    <div className="rect1"></div>
                                    <div className="rect2"></div>
                                    <div className="rect3"></div>
                                    <div className="rect4"></div>
                                    <div className="rect5"></div>
                                </div>
                            </div>
                        )}

                        {!showTitle && (
                            <div className={isFadingOut ? 'fade-out' : ''}>
                                <p style={{ textAlign: 'center', fontSize: '20px', margin: 0, color: 'white', marginBottom: 40 }}>Click to start</p>

                                <button id="mic-button" onClick={handleMic} style={{ padding: 0, borderRadius: '50%', border: 'none', backgroundColor: '#005B81' }}>
                                    <FontAwesomeIcon icon={faCirclePlay} color={'#FFFFFF'} size="5x" />
                                </button>
                            </div>
                        )}
                    </div>
                )}
                {listening && (
                    <div className='fade-in-input' style={{}}>
                        <div style={{
                            position: 'absolute',
                            top: '0',
                            left: '0',
                            width: '1024px',
                            height: '100%',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                            {imageUrl && <img src={imageUrl} alt="AI Generated" loading={"lazy"} style={{ width: '90%', height: '90%', borderRadius: '25px', boxShadow: '0  0  8px  3px rgba(255,  255,  255,  0.5)' }} />}
                        </div>

                        <div style={{
                            position: 'absolute',
                            top: '0',
                            left: '1010px',
                            right: '30px',
                            height: '100%',
                            padding: '16px',
                        }}>
                            <div style={{
                                marginTop: '30px',
                                border: '0.5px solid black',
                                height: '70%',
                                backgroundColor: '#003145',
                                borderRadius: '15px',
                                boxShadow: '0  0  8px  3px rgba(255,  255,  255,  0.5)',
                                padding: '20px',
                            }}>
                                <p style={{ color: 'white', fontSize: '25px' }}>
                                    {transcript}
                                </p>
                            </div>

                            <button className={`pulse-button ${isFadingOut ? 'fade-out' : ''}`} onClick={handleMic} style={{ animation: 'pulse   2s infinite', marginTop: 30, height : "80px", padding:0, width : "80px",  borderRadius: '100%', border: 0 , backgroundColor: '#003B53' }}>
                                <FontAwesomeIcon icon={faCircleStop} color={'white'} size="4x" />
                            </button>

                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Home;