import numpy as np
from scipy.io import wavfile

def lower_volume(filename, factor):
    rate, data = wavfile.read(filename)
    data_float = data.astype(np.float32)
    data_float = data_float * factor
    data_int = np.int16(data_float)
    wavfile.write(filename, rate, data_int)

lower_volume('public/assets/audio/gaming_end.wav', 0.5)
