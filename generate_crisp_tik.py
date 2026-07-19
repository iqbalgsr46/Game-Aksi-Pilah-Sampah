import numpy as np
from scipy.io import wavfile

sample_rate = 44100
duration = 0.04  # Shorter, faster

t = np.linspace(0, duration, int(sample_rate * duration), False)
# Higher frequency for a "tik" instead of a "tuk"
freq = np.linspace(2000, 400, len(t))
phase = np.cumsum(freq) / sample_rate * 2 * np.pi
sine = np.sin(phase)

envelope = np.exp(-t * 300)
audio = sine * envelope

# Noise for the snap
noise = np.random.normal(0, 1, len(t))
# Lighter filter so it's crisp but not totally raw
noise = np.convolve(noise, np.ones(3)/3, mode='same')

noise_env = np.exp(-t * 800)
audio += noise * noise_env * 0.4

audio = audio / np.max(np.abs(audio))
audio_int = np.int16(audio * 32767)

wavfile.write('public/assets/audio/steam_click.wav', sample_rate, audio_int)
