export const anchors = {
  bpm:      { y: 56 },
  steps:    { y: 132 },
  pulses:   { y: 166 },
  rotate:   { y: 200 },
  speedMode:{ y: 242 },
  speed:    { y: 268 },
  subdiv:   { y: 298 },
  vol:      { y: 340 },
  sound:    { y: 372 },
  offset:   { y: 404 },

  showLanes:{ y: 452 },
  scope:    { y: 488 },
  moonEnabled:   { y: 528 },
  moonRatio:     { y: 556 },
  moonDir:       { y: 584 },
  moonRadius:    { y: 612 },
  moonPendAmt:   { y: 640 },
  moonPendSpeed: { y: 668 },
  moonSize:      { y: 696 },
  moonSizeLfo:   { y: 724 },
  moonPulses:    { y: 752 },
  moonTrigOffset:{ y: 780 },
  moonTouchTrig: { y: 808 },
  moonLevel:     { y: 836 },
  moonBreathDepth:{ y: 864 },
  moonBreathSpeed:{ y: 892 },

  selVel:   { y: 900 },
  selPitch: { y: 928 },
  selRatchet:{y:956 },
  selRepeat:{ y:984 },
  selProb:  { y:1012 },
  selPan:   { y:1040 },
  selDelay: { y:1068 },
  selMicro: { y:1096 },
  selSwing: { y:1124 },

  selRandVel:{y:1156},
  selRandPitch:{y:1184},
  selRandTime:{y:1212},
  selMute:{y:1244},
};

export function placeDom(ui, leftScrollY){
  const y0 = (k)=>anchors[k].y - leftScrollY;

  ui.startBtn.position(20, 16-leftScrollY);
  ui.bpmSlider.position(20, y0("bpm")+14).style("width","220px");

  ui.trackSelect.position(20, y0("steps")-54);
  ui.addBtn.position(140, y0("steps")-54);
  ui.removeBtn.position(230, y0("steps")-54);

  ui.nSlider.position(20, y0("steps")+14).style("width","220px");
  ui.kSlider.position(20, y0("pulses")+14).style("width","220px");
  ui.rotSlider.position(20, y0("rotate")+14).style("width","220px");

  ui.speedMode.position(20, y0("speedMode")+14);
  ui.speedRatio.position(120, y0("speed")+14).style("width","120px");
  ui.subdiv.position(250, y0("subdiv")+12);

  ui.volSlider.position(20, y0("vol")+14).style("width","220px");
  ui.soundSelect.position(20, y0("sound")+14);
  ui.offsetSlider.position(20, y0("offset")+14).style("width","220px");

  ui.showLanes.position(20, y0("showLanes"));
  ui.scopeSelect.position(20, y0("scope")+14);
  ui.rangeStart.position(120, y0("scope")+14).style("width","70px");
  ui.rangeEnd.position(200, y0("scope")+14).style("width","70px");

  ui.moonEnabled.position(20, y0("moonEnabled"));
  ui.moonRatio.position(20, y0("moonRatio")+14).style("width","220px");
  ui.moonDir.position(20, y0("moonDir")+14);
  ui.moonRadius.position(20, y0("moonRadius")+14).style("width","220px");
  ui.moonPendAmt.position(20, y0("moonPendAmt")+14).style("width","220px");
  ui.moonPendSpeed.position(20, y0("moonPendSpeed")+14).style("width","220px");
  ui.moonSize.position(20, y0("moonSize")+14).style("width","220px");
  ui.moonSizeLfo.position(20, y0("moonSizeLfo")+14).style("width","220px");
  ui.moonPulses.position(20, y0("moonPulses")+14).style("width","220px");
  ui.moonTrigOffset.position(20, y0("moonTrigOffset")+14).style("width","220px");
  ui.moonTouchTrig.position(20, y0("moonTouchTrig"));
  ui.moonLevel.position(20, y0("moonLevel")+14).style("width","220px");
  ui.moonBreathDepth.position(20, y0("moonBreathDepth")+14).style("width","220px");
  ui.moonBreathSpeed.position(20, y0("moonBreathSpeed")+14).style("width","220px");

  ui.selVel.position(20, y0("selVel")+14).style("width","220px");
  ui.selPitch.position(20, y0("selPitch")+14).style("width","220px");
  ui.selRatchet.position(20, y0("selRatchet")+14).style("width","220px");
  ui.selRepeat.position(20, y0("selRepeat")+14).style("width","220px");
  ui.selProb.position(20, y0("selProb")+14).style("width","220px");
  ui.selPan.position(20, y0("selPan")+14).style("width","220px");
  ui.selDelay.position(20, y0("selDelay")+14).style("width","220px");
  ui.selMicro.position(20, y0("selMicro")+14).style("width","220px");
  ui.selSwing.position(20, y0("selSwing")+14).style("width","220px");

  ui.selRandVel.position(20, y0("selRandVel")+14).style("width","220px");
  ui.selRandPitch.position(20, y0("selRandPitch")+14).style("width","220px");
  ui.selRandTime.position(20, y0("selRandTime")+14).style("width","220px");
  ui.selMute.position(20, y0("selMute"));
}
