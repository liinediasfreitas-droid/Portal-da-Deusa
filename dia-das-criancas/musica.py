"""Sintetiza a trilha: caixinha de música + pad suave (composição original, sem samples).
Uso: python3 -I musica.py audio/musica.wav
"""
import sys, wave
import numpy as np

SR = 44100
DUR = 50.0
BPM = 84
BEAT = 60 / BPM
rs = np.random.default_rng(7)

def midi(n): return 440.0 * 2 ** ((n - 69) / 12)
N = {'C':0,'D':2,'E':4,'F':5,'G':7,'A':9,'B':11}
def note(name, octave): return 12 * (octave + 1) + N[name]

def box_tone(freq, length, vel=1.0):
    """timbre de caixinha de música: parciais levemente inarmônicos + decaimento rápido"""
    t = np.arange(int(SR * length)) / SR
    y = np.zeros_like(t)
    for k, (m, a, d) in enumerate([(1, 1.0, 2.6), (2.0, .35, 4.0), (3.01, .22, 6.0), (4.2, .10, 9.0), (5.4, .05, 12.0)]):
        y += a * np.sin(2 * np.pi * freq * m * t) * np.exp(-d * t)
    atk = np.minimum(1, t / 0.002)
    return y * atk * vel

def pad_tone(freq, length, vel=1.0):
    t = np.arange(int(SR * length)) / SR
    y = (np.sin(2 * np.pi * freq * t) + .5 * np.sin(2 * np.pi * freq * 2 * t + .3) + .25 * np.sin(2 * np.pi * freq * 3 * t)) / 1.75
    env = np.minimum(1, t / 0.9) * np.minimum(1, (length - t) / 1.2)
    return y * env * vel

out = np.zeros(int(SR * (DUR + 4)))
def add(sig, at, gain=1.0, pan=None):
    i = int(at * SR)
    if i >= len(out): return
    j = min(len(out), i + len(sig))
    out[i:j] += sig[:j - i] * gain

# progressão C - G - Am - F  (2 compassos cada)
chords = [
    (['C', 'E', 'G'], 'C', 3),
    (['B', 'D', 'G'], 'G', 2),
    (['A', 'C', 'E'], 'A', 2),
    (['F', 'A', 'C'], 'F', 2),
]
# melodia (nome, oitava, duração em tempos) – 8 tempos por frase
M = [
    [('E',5,1),('G',5,1),('A',5,1.5),('G',5,.5),('E',5,1),('D',5,1),('C',5,2)],
    [('D',5,1),('E',5,1),('G',5,1.5),('E',5,.5),('D',5,1),('B',4,1),('G',4,2)],
    [('E',5,1),('A',5,1),('C',6,1.5),('A',5,.5),('G',5,1),('E',5,1),('E',5,2)],
    [('C',6,1),('A',5,1),('G',5,1.5),('F',5,.5),('E',5,1),('D',5,1),('C',5,2)],
]

beat = 0.0
for rep in range(2):
    for ci, (tri, root, oct_) in enumerate(chords):
        base = beat * BEAT
        # baixo + pad
        add(pad_tone(midi(note(root, 2)), 8 * BEAT * 1.05, .22), base)
        for n in tri:
            add(pad_tone(midi(note(n, 3)), 8 * BEAT * 1.1, .07), base)
        # arpejo (colcheias) em duas oitavas
        notes = [note(n, 4) for n in tri]
        pat = [0, 1, 2, 1, 0, 1, 2, 1, 2, 1, 0, 1, 2, 1, 0, 1]
        for k, p in enumerate(pat):
            at = base + k * BEAT / 2
            vel = (.34 if k % 4 == 0 else .2) * (1.0 if rep == 0 else .85)
            add(box_tone(midi(notes[p] + (12 if rep == 1 and k % 2 else 0)), 1.4, 1.0), at, vel)
        # melodia
        t = base
        for (n, o, d) in M[ci]:
            f = midi(note(n, o) + (12 if (rep == 1 and ci in (0, 2)) else 0))
            add(box_tone(f, 2.2, 1.0), t, .55)
            if rep == 1: add(box_tone(f * 2, 1.2, 1.0), t + .01, .1)
            t += d * BEAT
        beat += 8

# final: acorde longo + brilho
fin = beat * BEAT
for n in [note('C', 3), note('G', 3), note('C', 4), note('E', 4), note('G', 4)]:
    add(pad_tone(midi(n), 6.0, .09), fin - .2)
for k, n in enumerate(['C', 'E', 'G', 'C', 'E', 'G']):
    add(box_tone(midi(note(n, 5 + k // 3)), 3.0), fin + k * .18, .4)

# brilhos nas transições entre cenas
for tt in [4.3, 14.6, 25.0, 33.4, 41.6]:
    for k, n in enumerate(['C', 'D', 'E', 'G', 'A', 'C', 'E']):
        add(box_tone(midi(note(n, 6 if k < 5 else 7)), 1.6), tt - .15 + k * .06, .17)
    # swoosh suave (ruído filtrado)
    L = int(SR * 1.0)
    nz = rs.standard_normal(L)
    k = np.ones(220) / 220
    nz = np.convolve(nz, k, 'same')
    env = np.sin(np.pi * np.linspace(0, 1, L)) ** 2
    add(nz * env, tt - .25, .5)

# reverb (impulso exponencial de ruído)
L = int(SR * 2.4)
ir = rs.standard_normal(L) * np.exp(-np.linspace(0, 6, L))
ir[0] = 0
n = len(out) + len(ir)
wet = np.fft.irfft(np.fft.rfft(out, n) * np.fft.rfft(ir, n), n)[:len(out)]
mix = out + wet * 0.12

mix = mix[:int(SR * DUR)]
fade_in = np.minimum(1, np.arange(len(mix)) / (SR * 1.2))
fade_out = np.minimum(1, (len(mix) - np.arange(len(mix))) / (SR * 3.0))
mix = mix * fade_in * fade_out
mix = mix / np.max(np.abs(mix)) * 0.8
pcm = (mix * 32767).astype('<i2')
with wave.open(sys.argv[1], 'wb') as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
print('ok', len(pcm) / SR, 's')
