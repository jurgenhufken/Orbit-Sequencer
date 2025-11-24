import { euclidPattern, rotatePattern } from "../engine/euclid.js";

export function makeStep(){
  return {
    on:true, vel:0.7, pitch:0, mute:false,
    ratchet:1, repeat:1, prob:100,
    pan:0, delaySend:0, microMs:0, swingPct:0,
    randVel:0, randPitch:0, randTimeMs:0,
    flash:0, picked:false
  };
}

export function makeTrack(idx){
  return {
    id: idx,
    radius: 210 - idx*55,
    steps: [],
    N: 8,
    K: 4,
    euclidRot: 0,
    sound: "kick",
    volume: 0.8,
    orbitOffsetDeg: 0,
    speedMode: "hy",      // 'hy' | 'subdiv' | 'physics'
    speedRatio: 1.0,
    subdivIndex: 2,
    physicsVel: 1.0,
    _dt: 0.016,
    moon: {
      enabled: true,
      ratio: 2.0,
      direction: 1,
      radius: 26,
      radiusLfoAmt: 10,
      radiusLfoSpeed: 0.25,
      size: 9,
      sizeLfoAmt: 3,
      sizeLfoSpeed: 0.4,
      pulses: 1,
      level: 0.7,
      breathDepth: 0.4,
      breathSpeed: 0.15,
      trigOffsetDeg: 0,
      touchTrig: false,
      _wasTouch: false,
    },
  };
}

export function rebuildSteps(track, N){
  track.N = N;
  track.K = Math.min(track.K, N);
  track.steps = [];
  for(let i=0;i<N;i++) track.steps.push(makeStep());
  applyEuclid(track);
}

export function applyEuclid(track){
  const base = euclidPattern(track.N, Math.min(track.K, track.N));
  const rot = rotatePattern(base, track.euclidRot);
  for(let i=0;i<track.N;i++) track.steps[i].on = rot[i]===1;
}
