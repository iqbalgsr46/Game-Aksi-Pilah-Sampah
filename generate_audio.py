import numpy as np
from scipy.io.wavfile import write

sample_rate = 44100
t_start = np.linspace(0, 2.5, int(sample_rate * 2.5), False)

# 1. Deep Bass Swell
bass_freq = np.linspace(50, 60, len(t_start))
bass = np.sin(2 * np.pi * bass_freq * t_start)
bass_env = np.exp(-3 * ((t_start - 1.5)**2))  # Swells at 1.5s
bass = bass * bass_env

# 2. Shimmering chord (like a bootup sequence)
f1, f2, f3 = 110.0, 164.81, 220.0 # A2, E3, A3
chord = (np.sin(2 * np.pi * f1 * t_start) + 
         np.sin(2 * np.pi * f2 * t_start) * 0.5 + 
         np.sin(2 * np.pi * f3 * t_start) * 0.25)
chord_env = np.linspace(0, 1, len(t_start)) ** 2
chord = chord * chord_env * 0.3

# 3. White noise sweep (filtered)
noise = np.random.normal(0, 1, len(t_start))
whoosh_freq = np.linspace(100, 1500, len(t_start))
whoosh = noise * np.sin(2 * np.pi * whoosh_freq * t_start)
whoosh_env = np.sin(np.pi * (t_start / 2.5)) # fades in and out
whoosh = whoosh * whoosh_env * 0.1

# Combine and apply master envelope
audio_start = bass * 1.5 + chord * 1.0 + whoosh * 0.8
master_env = np.ones_like(t_start)
master_env[:int(sample_rate*0.1)] = np.linspace(0, 1, int(sample_rate*0.1)) # 100ms fade in
master_env[-int(sample_rate*0.5):] = np.linspace(1, 0, int(sample_rate*0.5)) # 500ms fade out
audio_start = audio_start * master_env

# Maximize volume (Normalize to exactly maximum 16-bit)
audio_start = np.int16(audio_start / np.max(np.abs(audio_start)) * 32767)
write('public/assets/audio/gaming_start.wav', sample_rate, audio_start)


# END SOUND (The Thud/Snap)
t_end = np.linspace(0, 1.0, int(sample_rate * 1.0), False)
# Pitch drop for the thud
thud_freq = np.exp(np.linspace(np.log(150), np.log(30), len(t_end)))
thud = np.sin(2 * np.pi * thud_freq * t_end)
thud_env = np.exp(-10 * t_end) # fast decay
thud = thud * thud_env

# High ping for the confirmation
ping_freq = 880.0 # A5
ping = np.sin(2 * np.pi * ping_freq * t_end) * np.exp(-5 * t_end)

audio_end = thud * 1.0 + ping * 0.3
audio_end = np.int16(audio_end / np.max(np.abs(audio_end)) * 32767)
write('public/assets/audio/gaming_end.wav', sample_rate, audio_end)
