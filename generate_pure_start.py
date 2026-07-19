import numpy as np
from scipy.io import wavfile

sample_rate = 44100

def create_smooth_start():
    t = np.linspace(0, 2.5, int(sample_rate * 2.5), False)
    
    f1 = np.sin(2 * np.pi * 65.41 * t)
    f2 = np.sin(2 * np.pi * 130.81 * t)
    f3 = np.sin(2 * np.pi * 196.00 * t)
    f4 = np.sin(2 * np.pi * 261.63 * t)

    f1_detune = np.sin(2 * np.pi * 64.8 * t)
    f2_detune = np.sin(2 * np.pi * 131.2 * t)
    
    audio = (f1 * 1.0 + f1_detune * 0.8 + 
             f2 * 0.6 + f2_detune * 0.4 + 
             f3 * 0.3 + 
             f4 * 0.1)

    env = np.ones_like(t)
    fade_in = int(sample_rate * 1.5)
    env[:fade_in] = (1 - np.cos(np.pi * t[:fade_in] / 1.5)) / 2
    
    fade_out = int(sample_rate * 1.0)
    t_out = np.linspace(0, 1, fade_out)
    env[-fade_out:] = (1 + np.cos(np.pi * t_out)) / 2
    
    audio = audio * env
    
    # Soft clip/Amplify to make it loud (Gain of 5.0)
    audio = audio / np.max(np.abs(audio))
    audio = np.tanh(audio * 5.0)
    
    audio = np.int16(audio / np.max(np.abs(audio)) * 32767)
    return audio

audio_start = create_smooth_start()
wavfile.write('public/assets/audio/gaming_start.wav', sample_rate, audio_start)
