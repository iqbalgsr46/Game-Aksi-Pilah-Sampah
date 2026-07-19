import numpy as np
from scipy.io import wavfile

def amplify(filename, gain):
    rate, data = wavfile.read(filename)
    data_float = data.astype(np.float32) / 32768.0
    data_float = np.tanh(data_float * gain)
    data_int = np.int16(data_float * 32767.0)
    wavfile.write(filename, rate, data_int)

amplify('public/assets/audio/gaming_start.wav', 6.0)
amplify('public/assets/audio/gaming_end.wav', 4.0)
