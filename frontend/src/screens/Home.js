import React, { useEffect, useRef, useState } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone, faTimes } from '@fortawesome/free-solid-svg-icons';

function Home() {
    const { transcript, resetTranscript } = useSpeechRecognition()
    const [listening, setListening] = useState(false);
    const [imageUrl, setImageUrl] = useState(null); // New state variable for the image URL

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
            resetTranscript();
        }
        setListening(!listening);
        console.log('listening', listening);
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
                        <p style={{ textAlign: 'center', fontWeight: 'lighter', fontSize: '110px', margin: 0, color: 'white', textShadow: '2px   2px   4px rgba(255,  255,  255,  0.5)' }}>luna</p>
                        <div style={{ height: '40vh' }} />

                        <p style={{ textAlign: 'center', fontSize: '20px', margin: 0, color: 'white', marginBottom: 20 }}>Click to start</p>

                        <button onClick={handleMic} style={{}}>
                            <FontAwesomeIcon icon={faMicrophone} size="3x" />
                        </button>
                    </div>
                )}
                {listening && (
                    <div>
                        <div style={{
                            position: 'absolute',
                            top: '0',
                            left: '0',
                            width: '1024px',
                            height: '100%',
                            border: '2px solid white'
                        }}>
                            {imageUrl && <img src={imageUrl} alt="Generated Image" style={{ width: '100%', height: '100%' }} />}
                        </div>
                        <div style={{
                            position: 'absolute',
                            top: '0',
                            left: '1040px',
                            right: '0',
                            height: '100%',
                            border: '2px solid red',
                            padding: '16px',
                        }}>
                            {transcript}
                        </div>
                        <button onClick={handleMic} style={{ position: 'absolute', bottom: 10, right: 10 }}>
                            <FontAwesomeIcon icon={faTimes} size="3x" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Home;