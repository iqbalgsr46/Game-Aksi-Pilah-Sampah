import numpy as np
from scipy.io import wavfile

def soft_boost(filename, gain):
    rate, data = wavfile.read(filename)
    x = data.astype(np.float32) / 32768.0
    y = np.tanh(x * gain)
    data_int = np.int16(y * 32767.0)
    wavfile.write(filename, rate, data_int)

soft_boost('public/assets/audio/gaming_start.wav', 2.5)
soft_boost('public/assets/audio/gaming_end.wav', 2.5)
