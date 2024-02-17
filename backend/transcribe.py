# You need to install pyaudio to run this example
# pip install pyaudio

# When using a microphone, the AudioSource `input` parameter would be
# initialised as a queue. The pyaudio stream would be continuosly adding
# recordings to the queue, and the websocket client would be sending the
# recordings to the speech to text service
import threading
import time
import sys
import pyaudio
from ibm_watson import SpeechToTextV1
from ibm_watson.websocket import RecognizeCallback, AudioSource
from threading import Thread
from ibm_cloud_sdk_core.authenticators import IAMAuthenticator

try:
    from Queue import Queue, Full
except ImportError:
    from queue import Queue, Full

###############################################
#### Initalize queue to store the recordings ##
###############################################
CHUNK = 1024
# Note: It will discard if the websocket client can't consumme fast enough
# So, increase the max size as per your choice
BUF_MAX_SIZE = CHUNK * 10
# Buffer to store audio
q = Queue(maxsize=int(round(BUF_MAX_SIZE / CHUNK)))

# Create an instance of AudioSource
audio_source = AudioSource(q, True, True)

###############################################
#### Prepare Speech to Text Service ########
###############################################

# initialize speech to text service
authenticator = IAMAuthenticator('a72AgqHXRd1wp72TozPLoDqO4a7Yx8qdKjwH99Yl-kqA')
speech_to_text = SpeechToTextV1(authenticator=authenticator)

# define callback for the speech to text service
class MyRecognizeCallback(RecognizeCallback):
    def __init__(self):
        RecognizeCallback.__init__(self)
        self.transcript = []
        self.stop_recognition = False

    def on_transcription(self, transcript):
        # print('cont', transcript)
        self.transcript += transcript
        if self.stop_recognition:
            print("sending message:", self.transcript)
            self.stop_recognition = False

    def on_connected(self):
        print('Connection was successful')

    def on_error(self, error):
        print('Error received: {}'.format(error))

    def on_inactivity_timeout(self, error):
        print('Inactivity timeout: {}'.format(error))

    def on_listening(self):
        print('Service is listening')

    def on_hypothesis(self, hypothesis):
        pass
        # print("hypothesis", hypothesis)

    def on_data(self, data):
        pass
        # print(data)

    def on_close(self):
        print("Connection closed")

# this function will initiate the recognize service and pass in the AudioSource
def recognize_using_weboscket():
    # # Create a timer that will stop the recognition after the timeout
    # time.sleep(12)
    # print("Timeout reached. Stopping recognition...")
    # stream.stop_stream()
    # stream.close()
    # audio.terminate()
    # audio_source.completed_recording()
    # sys.exit(0)

    #     # Here you would need to stop the recognition process
    #     # This might involve calling a method on the speech_to_text object
    #     # or setting a flag that the callback checks to stop processing

    def stop_recognition_after_timeout():
        time.sleep(3)
        mycallback.stop_recognition = True

    # Start the recognition process
    mycallback = MyRecognizeCallback()

    def print_transcript_periodically():
        while not mycallback.stop_recognition:
            time.sleep(5)
            print("sending message:", mycallback.transcript)

    print_thread = threading.Thread(target=print_transcript_periodically)
    print_thread.start()

    speech_to_text.recognize_using_websocket(audio=audio_source,
                                             content_type='audio/l16; rate=44100',
                                             recognize_callback=mycallback,
                                             interim_results=True)

    # Process the transcript
    # chunk = ""
    # for segment in mycallback.transcript:
    #     print(segment["transcript"])
    #     chunk += segment["transcript"]

    # print('finalized', chunk)
    # return chunk


###############################################
#### Prepare the for recording using Pyaudio ##
###############################################

# Variables for recording the speech
FORMAT = pyaudio.paInt16
CHANNELS = 1
RATE = 44100

# define callback for pyaudio to store the recording in queue
def pyaudio_callback(in_data, frame_count, time_info, status):
    try:
        q.put(in_data)
    except Full:
        pass # discard
    return (None, pyaudio.paContinue)

# instantiate pyaudio
audio = pyaudio.PyAudio()

# open stream using callback
stream = audio.open(
    format=FORMAT,
    channels=CHANNELS,
    rate=RATE,
    input=True,
    frames_per_buffer=CHUNK,
    stream_callback=pyaudio_callback,
    start=False
)

#########################################################################
#### Start the recording and start service to recognize the stream ######
#########################################################################

print("Enter CTRL+C to end recording...")
stream.start_stream()

try:
    # recognize_thread = Thread(target=recognize_using_weboscket, args=())
    # recognize_thread.start()
    recognize_using_weboscket()

    # while True:
    #     pass
    # time.sleep(5)

    # # stop recording
    # stream.stop_stream()
    # stream.close()
    # audio.terminate()
    # audio_source.completed_recording()
except KeyboardInterrupt:
    # stop recording
    stream.stop_stream()
    stream.close()
    audio.terminate()
    audio_source.completed_recording()