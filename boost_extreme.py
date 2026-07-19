import numpy as np
from scipy.io import wavfile

def amplify(filename, gain):
    rate, data = wavfile.read(filename)
    data_float = data.astype(np.float32) / 32768.0
    
    # Extreme gain and hard clip for maximum loudness
    data_float = np.clip(data_float * gain, -1.0, 1.0)
    
    data_int = np.int16(data_float * 32767.0)
    wavfile.write(filename, rate, data_int)

amplify('public/assets/audio/gaming_start.wav', 10.0)
amplify('public/assets/audio/gaming_end.wav', 10.0)
