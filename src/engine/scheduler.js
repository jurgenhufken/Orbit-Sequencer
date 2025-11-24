import { synthDrum } from "../audio/drumSynth.js";
import { beatsPerStepFromIndex } from "./localClock.js";

export function fireStep(ctx, bus, track, step, i, bpm){
  step.flash = 10;
  if(!ctx || !step.on || step.mute) return;
  if(Math.random()*100 > step.prob) return;

  let stepDurSec = track._stepDurSec;
  if(!stepDurSec || !Number.isFinite(stepDurSec) || stepDurSec<=0){
    const beatsPerStep = beatsPerStepFromIndex(track.subdivIndex ?? 2);
    stepDurSec = (60/bpm)*beatsPerStep;
  }

  const vel = clamp(step.vel + rand(-step.randVel, step.randVel), 0.05, 1.0);
  const pitch = step.pitch + rand(-step.randPitch, step.randPitch);
  const pan = clamp(step.pan, -1, 1);
  const delaySend = clamp(step.delaySend, 0, 1);

  const rat = step.ratchet, rep = step.repeat;
  const now = ctx.currentTime;

  const microSec = step.microMs/1000;
  const swingSec = (i%2===1)? (step.swingPct/100)*(stepDurSec*0.5) : 0;
  const timeRandMs = rand(-step.randTimeMs, step.randTimeMs);
  const baseT = now + microSec + swingSec + timeRandMs/1000;

  const burstGap = stepDurSec*0.25;

  for(let b=0;b<rep;b++){
    const burstT = baseT + b*burstGap;
    for(let r=0;r<rat;r++){
      const t0 = burstT + r*(stepDurSec/rat);
      synthDrum(ctx, bus, track.sound, t0, vel, pitch, pan, delaySend, stepDurSec/rat);
    }
  }
}

export function fireMoon(ctx, bus, track, bpm){
  if(!ctx || !track.moon || !track.moon.enabled) return;
  const m = track.moon;
  const baseDur = track._circleDurSec;
  const gate = baseDur && Number.isFinite(baseDur)
    ? Math.min(0.6, baseDur*0.25)
    : 0.35;

  const level = (m.level ?? 0.7);
  const depth = (m.breathDepth ?? 0.4);
  const speed = (m.breathSpeed ?? 0.15);
  const phase = ctx.currentTime * 2*Math.PI*speed;
  const breath = 1 + depth * Math.sin(phase);

  const vel = 0.6*(track.volume ?? 1.0) * level * breath;
  const pan = 0;
  const delaySend = 0.4;
  const t0 = ctx.currentTime;
  synthDrum(ctx, bus, "moon", t0, vel, 0, pan, delaySend, gate);
}

function rand(a,b){ return a + Math.random()*(b-a); }
function clamp(v,a,b){ return Math.max(a, Math.min(b, v)); }
