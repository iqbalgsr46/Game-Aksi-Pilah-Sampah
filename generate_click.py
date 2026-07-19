import numpy as np
from scipy.io import wavfile

sample_rate = 44100
duration = 0.08

t = np.linspace(0, duration, int(sample_rate * duration), False)
freq = np.linspace(500, 50, len(t))
phase = np.cumsum(freq) / sample_rate * 2 * np.pi
sine = np.sin(phase)

envelope = np.exp(-t * 150)
audio = sine * envelope

noise = np.random.normal(0, 1, len(t))
noise_env = np.exp(-t * 800)
audio += noise * noise_env * 0.5

audio = audio / np.max(np.abs(audio))
audio = audio * 0.7
audio_int = np.int16(audio * 32767)

wavfile.write('public/assets/audio/steam_click.wav', sample_rate, audio_int)
