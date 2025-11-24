import { circleDurationSec } from "./localClock.js";

export function omegaForTrack(track, bpm){
  const baseDur = circleDurationSec(track, bpm);
  let dur = baseDur;

  if(track.speedMode==="hy"){
    dur = baseDur / Math.max(0.0001, track.speedRatio);
  } else if(track.speedMode==="subdiv"){
    dur = baseDur;
  } else if(track.speedMode==="physics"){
    const k = 0.8;
    track.physicsVel = track.physicsVel ?? 1.0;
    const dt = track._dt ?? 0.016;
    track.physicsVel += (track.speedRatio - track.physicsVel) * (1-Math.exp(-k*dt));
    dur = baseDur / Math.max(0.0001, track.physicsVel);
  }
  track._circleDurSec = dur;
  const n = Math.max(1, track.N||1);
  track._stepDurSec = dur / n;
  return (Math.PI*2)/dur;
}

export function phaseAt(track, bpm, T){
  const omega = omegaForTrack(track, bpm);
  const off = (track.orbitOffsetDeg||0) * Math.PI/180;
  return (omega*T + off)%(Math.PI*2);
}
