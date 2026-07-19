import numpy as np
from scipy.io import wavfile

sample_rate = 44100
duration = 0.06

t = np.linspace(0, duration, int(sample_rate * duration), False)
# Lower starting frequency for a softer snap (400 -> 70)
freq = np.linspace(400, 70, len(t))
phase = np.cumsum(freq) / sample_rate * 2 * np.pi
sine = np.sin(phase)

# Very fast fade-in (attack) to soften the initial punch
attack = 1.0 - np.exp(-t * 1500)
decay = np.exp(-t * 150)
envelope = attack * decay
audio = sine * envelope

# Very soft, dull noise
noise = np.random.normal(0, 1, len(t))
# Heavy low-pass filter for dullness
noise = np.convolve(noise, np.ones(15)/15, mode='same')

noise_env = (1.0 - np.exp(-t * 3000)) * np.exp(-t * 1000)
audio += noise * noise_env * 0.3

audio = audio / np.max(np.abs(audio))
audio_int = np.int16(audio * 32767)

wavfile.write('public/assets/audio/steam_click.wav', sample_rate, audio_int)
