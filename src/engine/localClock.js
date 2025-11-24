import { SUBDIVS } from "../util/constants.js";

export function beatsPerStepFromIndex(i){
  return (SUBDIVS[i]||SUBDIVS[2]).beats;
}

export function circleDurationSec(track, bpm){
  const beatsPerStep = beatsPerStepFromIndex(track.subdivIndex);
  const stepDur = (60/bpm) * beatsPerStep;
  return stepDur * track.N; // HY: N controls length/bars
}
