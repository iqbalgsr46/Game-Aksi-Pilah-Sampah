import numpy as np
from scipy.io import wavfile

sample_rate = 44100
duration = 0.2  # 200ms - longer to sound louder

t = np.linspace(0, duration, int(sample_rate * duration), False)
# Pitch drop
freq = np.linspace(1000, 40, len(t))
phase = np.cumsum(freq) / sample_rate * 2 * np.pi
sine = np.sin(phase)

# Slower decay so it stays loud
envelope = np.exp(-t * 40)
audio = sine * envelope

# Add loud noise burst at the start
noise = np.random.normal(0, 1, len(t))
noise_env = np.exp(-t * 100)
audio += noise * noise_env * 1.5

# Maximize to absolute peak
audio = audio / np.max(np.abs(audio))

# Apply aggressive clipping (distortion/fuzz) to make it violently loud
audio = np.clip(audio * 10.0, -1.0, 1.0)

audio_int = np.int16(audio * 32767)

wavfile.write('public/assets/audio/steam_click.wav', sample_rate, audio_int)
