import numpy as np
from scipy.io import wavfile

def extreme_boost(filename, gain):
    rate, data = wavfile.read(filename)
    x = data.astype(np.float32) / 32768.0
    y = np.clip(x * gain, -1.0, 1.0)
    data_int = np.int16(y * 32767.0)
    wavfile.write(filename, rate, data_int)

extreme_boost('public/assets/audio/steam_click.wav', 15.0)
