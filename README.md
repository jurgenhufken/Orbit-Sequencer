# Orbit Sequencer – C‑mode

Browser‑based orbit / Euclidean drum sequencer built with plain p5.js.

This folder is self‑contained: clone it from GitHub, start a tiny static
webserver, open `http://localhost:8000`, en je kunt direct spelen.

## 1. Runnen

Vereisten:

- Moderne browser met Web Audio support (Chrome / Edge / Firefox / Safari).
- Een simpele static server (bijv. Python 3 of een VS Code Live Server).

### Optie A – Python (aanrader, geen extra deps)

```bash
cd orbit_sequencer_C_mode
python3 -m http.server 8000
```

Open daarna in je browser:

- `http://localhost:8000/`

Klik **een keer** op het canvas om audio te unlocken en druk dan op **Start**.

### Optie B – Iedere andere static server

Bijvoorbeeld met `npx` (als je Node hebt):

```bash
cd orbit_sequencer_C_mode
npx serve . -l 8000
```

of gebruik een Live‑Server‑achtige plugin in je IDE en serve `index.html`.

Er is **geen build‑stap**: alles is plain JS in `src/`.

## 2. Features

- **Global BPM / transport** – één klok voor alle cirkels.
- **Meerdere cirkels (tracks)**.
- **Euclid auto (N/K/Rotate)** per cirkel.
- **Snelheids‑modes per cirkel**:
  - `hy` – hybride muzikale klok (subdiv + N) * `speedRatio`.
  - `subdiv` – pure muzikale klok op basis van subdiv.
  - `physics` – benadering met fysieke easing naar `speedRatio`.
- **Step lanes** onderin met per‑step parameters:
  - on/off, velocity, pitch, ratchet, repeat, probability, pan,
    delay send, micro‑timing, swing, random‑vel/pitch/time.
- **Scrollbars** – verticale scroll voor orbits en linker panel,
  horizontale scroll voor de step‑grid.
- **Moon‑machine** per actieve cirkel:
  - visuele maan die in een eigen orbit rond de planeet draait;
  - ratio + richting (with/against) t.o.v. de planeet;
  - pendulum‑radius en size‑LFO (adem / hartslag gevoel);
  - meerdere trigger‑punten op de maan‑orbit (streepjes);
  - optionele "touch trigger" wanneer de maan de hoofd‑orbit raakt;
  - eigen woosh‑/lucht‑achtig geluid met adem‑achtige volume‑LFO.

## 3. Bedienings‑overzicht

### Globale / cirkel‑controls (links)

- **Start** – start/stop transport.
- **BPM** – globale snelheid.
- **Circle select / Add / Remove** – kies of maak cirkels.
- **Steps (N)** – aantal stappen op de orbit.
- **Pulses (K)** – Euclid‑pulses; `Rotate` verschuift het patroon.
- **Speed mode / ratio / Subdivision / Physics** – timing per cirkel.
- **Circle volume / sound / orbit offset** – basismix & klank per cirkel.

### Step‑lanes

- Klik in de grid om een step te selecteren.
- Drag in een lane om de waarde van die parameter te veranderen.
- Linker sliders onder **Selected / Scope** beïnvloeden batches steps
  (selected / picked / range / all).

Shortcuts op de orbit zelf:

- Klik op een dot: toggle on/off.
- `SHIFT`+klik: mute.
- `ALT`+klik: markeer als *picked* voor batch‑edits.

Scroll:

- Muiswiel in links of rechts gebied → verticaal scrollen.
- `SHIFT` + muiswiel in contentgebied → horizontaal scrollen.

### Moon‑blok (links, onder Scope)

Alle moon‑parameters gelden voor de **actieve cirkel**:

- **Moon enabled** – hele maan aan/uit.
- **Moon ratio / dir** – verhouding en richting t.o.v. planeet.
- **Moon radius / pendulum amt / pendulum spd** – afstand en slinger.
- **Moon size / size LFO** – grootte en pulseren van de maan‑dot.
- **Moon pulses** – aantal triggerpunten per maan‑orbit.
- **Moon trig offset** – roteer alle trigger‑streepjes rond de maan.
- **Moon touch trig** – extra trigger wanneer de maan de hoofd‑orbit raakt.
- **Moon level** – level van de woosh‑sound.
- **Moon breath depth / speed** – adem‑achtige volume‑LFO.

## 4. Structuur

- `index.html` – entrypoint, laadt p5.js en de app‑scripts.
- `src/` – alle JS‑modules:
  - `main.js` – p5‑sketch, UI‑opbouw, event‑afhandeling.
  - `engine/` – timing, orbit‑fases, scheduler.
  - `audio/` – Web Audio (drumSynth, moon‑woosh, bus).
  - `state/` – track/step‑structuur, selectie.
  - `view/` – orbit‑tekening, lanes, scrollbars, left‑panel labels.
  - `ui/` – DOM‑sliders/selects layout.
  - `util/` – constants, helpers.

## 5. Bekende beperkingen

- Dit is een experimentele C‑mode prototype; API’s en mappings kunnen
  nog veranderen.
- Audio‑gedrag en moon‑modulaties zijn bewust speels en niet
  sample‑nauwkeurig bedoeld.
