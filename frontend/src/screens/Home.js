import React, { useEffect, useRef, useState } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'
import './Home.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone, faTimes, faArrowRight, faPlay } from '@fortawesome/free-solid-svg-icons';
import { ClipLoader } from 'react-spinners';

function Home() {
    const { transcript, resetTranscript } = useSpeechRecognition()
    const [listening, setListening] = useState(false);
    const [imageUrl, setImageUrl] = useState(null); // New state variable for the image URL
    const [showTitle, setShowTitle] = useState(false);
    const [storyTitle, setStoryTitle] = useState('');
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        const words = transcript.split(' ');
        if (words.length >= 20 && transcript.length > 0) {
            console.log("chunk:", transcript); // Log the transcript

            // Function to send data to the Flask app
            const sendData = async () => {
                try {
                    const response = await fetch('http://localhost:8000/transcript', {
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
                    setImageUrl(data.message); // Set the image URL state
                } catch (error) {
                    console.error('Network error:', error);
                }
            };

            // Call the function to send the transcript
            sendData();

            // Reset the transcript
            resetTranscript();
        }
    }, [transcript, resetTranscript]);

    useEffect(() => {
        if (listening) {
            SpeechRecognition.startListening({
                continuous: true,
                onResult: (event) => {
                    const transcript = event.results[event.resultIndex][0].transcript;
                    // console.log('Transcript:', transcript);
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
            setShowTitle(true);
            resetTranscript();
        }
        if (listening) {
            setListening(false);
            setShowTitle(false);
            setStoryTitle('');
        }
        //setListening(!listening);
        // setShowTitle(true);
        // console.log('listening', listening);
    };

    const handleTitleChange = (event) => {
        setStoryTitle(event.target.value);
        // console.log(storyTitle);
    };

    const handleStart = async () => {
        if (!listening) {
            resetTranscript();
        }
        if (storyTitle && storyTitle.length > 0) {
            setLoading(true); // Start loading

            try {
                const response = await fetch('http://localhost:8000/titleScreen', {
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
                setImageUrl(data.message); // Set the image URL state
            } catch (error) {
                console.error('Network error:', error);
            } finally {
                setLoading(false); // End loading
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
                justifyContent: 'center'
            }}>

                {!listening && (
                    <div>
                        <p style={{ textAlign: 'center', fontSize: '30px', margin: 0, color: 'white' }}>Welcome to</p>
                        <p style={{ textAlign: 'center', fontWeight: 'lighter', fontSize: '120px', margin: 0, color: 'white', textShadow: '0  0  20px rgba(255,  255,  255,  1.0)' }}>luna</p>
                        <div style={{ height: '40vh' }} />


                        {(showTitle && !loading) && (
                            <div>
                                <div>
                                    <input
                                        name="storyTitle"
                                        placeholder="Title your story?"
                                        value={storyTitle} // Set the input value to the state
                                        onChange={handleTitleChange} // Update the state when the input value changes
                                        style={{
                                            width: '250px', // Increase the width
                                            height: '50px', // Increase the height
                                            padding: '10px', // Add some padding for better appearance
                                            borderRadius: '15px', // Increase the border-radius for curvature
                                            border: '1px solid white', // Remove the default border
                                            backgroundColor: 'rgba(0,   91,   129,   0.25)', // Match the background color
                                            color: 'white', // Text color
                                            fontSize: '16px', // Increase the font size
                                            marginBottom: '80px', // Add some margin at the bottom
                                            boxShadow: '0  0  10px rgba(255,  255,  255,  0.5)'
                                        }}
                                    />
                                </div>
                                <div>
                                    <button onClick={handleStart} style={{ padding: 20, borderRadius: '50%', border: 'none', backgroundColor: '#005B81' }}>
                                        <FontAwesomeIcon icon={faPlay} color={'#003B53'} size="3x" />
                                    </button>
                                </div>
                            </div>
                        )}

                        {(showTitle && loading) && (
                            <>
                            <p style={{ textAlign: 'center', fontSize: '20px', margin: 0, color: 'white', marginBottom: 20 }}>Getting all set up...</p>
                            <div className="spinner">
                                <div className="rect1"></div>
                                <div className="rect2"></div>
                                <div className="rect3"></div>
                                <div className="rect4"></div>
                                <div className="rect5"></div>
                            </div>
                            </>
                        )}

                        {!showTitle && (
                            <>
                                <p style={{ textAlign: 'center', fontSize: '20px', margin: 0, color: 'white', marginBottom: 20 }}>Click to start</p>

                                <button onClick={handleMic} style={{ padding: 20, borderRadius: '50%', border: 'none' }}>
                                    <FontAwesomeIcon icon={faPlay} color={'white'} size="3x" />
                                </button>
                            </>
                        )}


                    </div>
                )}
                {listening && (
                    <div style={{}}>
                        <div style={{
                            position: 'absolute',
                            top: '0',
                            left: '0',
                            width: '1024px',
                            height: '100%',
                            // border: '2px solid green',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                            {imageUrl && <img src={imageUrl} alt="Generated Image" style={{ width: '90%', height: '90%', borderRadius: '25px', boxShadow: '0  0  8px  3px rgba(255,  255,  255,  0.5)' }} />}
                        </div>

                        <div style={{
                            position: 'absolute',
                            top: '0',
                            left: '1040px',
                            right: '0',
                            height: '100%',
                            // border: '2px solid red',
                            padding: '16px',
                        }}>
                            <div style={{
                                marginTop: '30px',
                                border: '0.5px solid black', // Correctly set the border,
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

                            <button className="pulse-button" onClick={handleMic} style={{ animation: 'pulse  2s infinite', marginTop: 30, padding: 20, borderRadius: '50%', border: 'none', backgroundColor: 'white' }}>
                                <FontAwesomeIcon icon={faMicrophone} color={'#005B81'} size="3x" />
                            </button>

                        </div>

                    </div>
                )}
            </div>
        </div>
    );
}

export default Home;