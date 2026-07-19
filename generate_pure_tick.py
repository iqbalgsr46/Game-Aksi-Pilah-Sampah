import numpy as np
from scipy.io import wavfile

sample_rate = 44100
duration = 0.08

t = np.linspace(0, duration, int(sample_rate * duration), False)
# Very rapid pitch drop from 1200Hz to 100Hz (creates a clean 'tick' without noise)
freq = np.linspace(1200, 100, len(t))
phase = np.cumsum(freq) / sample_rate * 2 * np.pi
audio = np.sin(phase)

# Very rapid decay so it's punchy but clean
envelope = np.exp(-t * 120)
audio = audio * envelope

# Normalize to max clean volume
audio = audio / np.max(np.abs(audio))
audio_int = np.int16(audio * 32767)

wavfile.write('public/assets/audio/steam_click.wav', sample_rate, audio_int)
