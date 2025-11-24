export const LEFT_W = 320;
export const CONTENT_X = LEFT_W + 10;

export const SUBDIVS = [
  { name: "1/4",  beats: 1.0 },
  { name: "1/8",  beats: 0.5 },
  { name: "1/16", beats: 0.25 },
  { name: "1/32", beats: 0.125 },
  { name: "1/8T", beats: 1/3 },
  { name: "1/16T", beats: 1/6 },
  { name: "1/8.", beats: 0.75 },
  { name: "1/16.", beats: 0.375 },
];

export const DEFAULT_CANVAS_W = 1100;

// Lanes
export const lanesY0 = 600;
export const lanesCellW = 70;
export const lanesPadLeft = 40;
export const lanesPadRight = 80;
export const rowH = 18;

export const laneRows = [
  { key:"on",        label:"ON",      type:"toggle" },
  { key:"vel",       label:"VEL",     type:"bar",   min:0.05, max:1.0 },
  { key:"pitch",     label:"PIT",     type:"dot",   min:-24,  max:24 },
  { key:"ratchet",   label:"RAT",     type:"int",   min:1,    max:4 },
  { key:"repeat",    label:"REP",     type:"int",   min:1,    max:4 },
  { key:"prob",      label:"PROB",    type:"bar",   min:0,    max:100 },
  { key:"pan",       label:"PAN",     type:"dot",   min:-1,   max:1 },
  { key:"delaySend", label:"DLY",     type:"dot",   min:0,    max:1 },
  { key:"mute",      label:"MUTE",    type:"toggle" },
  { key:"microMs",   label:"MIC(ms)", type:"dot",   min:-40,  max:40 },
  { key:"swingPct",  label:"SWG(%)",  type:"bar",   min:0,    max:100 },
  { key:"randVel",   label:"rVEL",    type:"bar",   min:0,    max:0.5 },
  { key:"randPitch", label:"rPIT",    type:"int",   min:0,    max:6 },
  { key:"randTimeMs",label:"rT(ms)",  type:"bar",   min:0,    max:30 },
];
