import numpy as np
from scipy.io import wavfile
import math
from scipy.signal import lfilter

sample_rate = 44100

# 1. Start Sound (Deep Atmospheric Drone + Whoosh)
t_start = np.linspace(0, 2.5, int(sample_rate * 2.5), False)
# Drone: 60Hz and 61.5Hz for a slow beating effect (1.5 Hz beat)
drone1 = np.sin(2 * np.pi * 60 * t_start)
drone2 = np.sin(2 * np.pi * 61.5 * t_start)
drone = (drone1 + drone2) * 0.5
env_drone = np.sin(np.pi * (t_start / 2.5)) ** 1.5
drone = drone * env_drone

# Whoosh: Pink noise approximation (1/f)
noise = np.random.normal(0, 1, len(t_start))
b = [0.049922035, -0.095993537, 0.050612699, -0.004408786]
a = [1, -2.494956002, 2.017265875, -0.522189400]
pink_noise = lfilter(b, a, noise)
pink_noise = pink_noise / np.max(np.abs(pink_noise))

# Modulate the noise so it sweeps in and out
env_noise = np.exp(-5 * ((t_start - 1.2)**2)) # Peaks at 1.2s
whoosh = pink_noise * env_noise * 0.4

start_audio = drone * 0.8 + whoosh
start_audio = np.int16(start_audio / np.max(np.abs(start_audio)) * 32767)
wavfile.write('public/assets/audio/gaming_start.wav', sample_rate, start_audio)

# 2. End Sound (Deep boom / Impact)
t_end = np.linspace(0, 1.5, int(sample_rate * 1.5), False)
# Pitch envelope: very fast drop from 150Hz to 40Hz
freq_drop = 40 + 110 * np.exp(-15 * t_end)
boom = np.sin(2 * np.pi * freq_drop * t_end)

# Envelope: sharp attack, long decay
env_boom = np.exp(-3 * t_end)
boom = boom * env_boom

end_audio = boom
end_audio = np.int16(end_audio / np.max(np.abs(end_audio)) * 32767)
wavfile.write('public/assets/audio/gaming_end.wav', sample_rate, end_audio)
