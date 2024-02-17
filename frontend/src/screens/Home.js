import React, { useEffect, useRef, useState } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone, faTimes } from '@fortawesome/free-solid-svg-icons';

function Home() {
    const { transcript, resetTranscript } = useSpeechRecognition()
    const [listening, setListening] = useState(false);
    const prevTranscriptRef = useRef();

    useEffect(() => {
        prevTranscriptRef.current = transcript;
    }, [transcript]);

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

    useEffect(() => {
        const interval = setInterval(() => {
            if (prevTranscriptRef.current !== transcript) {
                console.log('Transcript changed:', transcript);
                prevTranscriptRef.current = transcript;
            }
        },  5000);
        return () => clearInterval(interval);
    }, [transcript]);

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
                        {/* <SpeechToText /> */}

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
                        }} />
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