import numpy as np
from scipy.io import wavfile

sample_rate = 44100
duration = 0.05

t = np.linspace(0, duration, int(sample_rate * duration), False)
freq = np.linspace(600, 80, len(t))
phase = np.cumsum(freq) / sample_rate * 2 * np.pi
sine = np.sin(phase)

envelope = np.exp(-t * 200)
audio = sine * envelope

noise = np.random.normal(0, 1, len(t))
noise = np.convolve(noise, np.ones(8)/8, mode='same')

noise_env = np.exp(-t * 1200)
audio += noise * noise_env * 0.8

audio = audio / np.max(np.abs(audio))
audio_int = np.int16(audio * 32767)

wavfile.write('public/assets/audio/steam_click.wav', sample_rate, audio_int)
