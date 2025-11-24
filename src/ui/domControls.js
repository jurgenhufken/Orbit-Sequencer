import { SUBDIVS } from "../util/constants.js";

export function createDom(p, api){
  const ui = {};
  ui.startBtn = p.createButton("Start").mousePressed(api.toggleRun);
  ui.bpmSlider = p.createSlider(30,200,92,1).input(()=>api.setBpm(ui.bpmSlider.value()));

  ui.trackSelect = p.createSelect().changed(()=>api.setActiveTrack(parseInt(ui.trackSelect.value(),10)));
  ui.addBtn = p.createButton("Add Circle").mousePressed(api.addTrack);
  ui.removeBtn = p.createButton("Remove Circle").mousePressed(api.removeTrack);

  ui.nSlider = p.createSlider(1,64,8,1).input(()=>api.setSteps(ui.nSlider.value()));
  ui.kSlider = p.createSlider(0,64,4,1).input(()=>api.setPulses(ui.kSlider.value()));
  ui.rotSlider = p.createSlider(0,63,0,1).input(()=>api.setRotate(ui.rotSlider.value()));

  ui.speedMode = p.createSelect();
  ["hy","subdiv","physics"].forEach(m=>ui.speedMode.option(m));
  ui.speedMode.changed(()=>api.setSpeedMode(ui.speedMode.value()));

  ui.speedRatio = p.createSlider(0.1,16.0,1.0,0.01).input(()=>api.setSpeedRatio(ui.speedRatio.value()));
  ui.subdiv = p.createSelect();
  SUBDIVS.forEach((s,i)=>ui.subdiv.option(s.name,i));
  ui.subdiv.changed(()=>api.setSubdiv(parseInt(ui.subdiv.value(),10)));

  ui.volSlider = p.createSlider(0,1,0.8,0.01).input(()=>api.setVolume(ui.volSlider.value()));
  ui.soundSelect = p.createSelect();
  ["kick","snare","hat","perc"].forEach(o=>ui.soundSelect.option(o));
  ui.soundSelect.changed(()=>api.setSound(ui.soundSelect.value()));
  ui.offsetSlider = p.createSlider(-180,180,0,1).input(()=>api.setOffset(ui.offsetSlider.value()));

  ui.showLanes = p.createCheckbox("Show step lanes", true).changed(()=>api.setShowLanes(ui.showLanes.checked()));

  ui.scopeSelect = p.createSelect();
  ["Selected","Picked","Range","All"].forEach(o=>ui.scopeSelect.option(o));
  ui.scopeSelect.selected("Selected").changed(()=>api.setScope(ui.scopeSelect.value()));
  ui.rangeStart = p.createSlider(1,8,1,1).input(()=>api.setRange(ui.rangeStart.value(), ui.rangeEnd.value()));
  ui.rangeEnd = p.createSlider(1,8,8,1).input(()=>api.setRange(ui.rangeStart.value(), ui.rangeEnd.value()));

  ui.moonEnabled = p.createCheckbox("Moon enabled", true).changed(()=>api.setMoonEnabled(ui.moonEnabled.checked()));
  ui.moonRatio = p.createSlider(0.25,4.0,2.0,0.05).input(()=>api.setMoonRatio(ui.moonRatio.value()));
  ui.moonDir = p.createSelect();
  ui.moonDir.option("with", 1);
  ui.moonDir.option("against", -1);
  ui.moonDir.changed(()=>api.setMoonDirection(parseFloat(ui.moonDir.value())));
  ui.moonRadius = p.createSlider(10,60,26,1).input(()=>api.setMoonRadius(ui.moonRadius.value()));
  ui.moonPendAmt = p.createSlider(0,40,10,1).input(()=>api.setMoonPendAmt(ui.moonPendAmt.value()));
  ui.moonPendSpeed = p.createSlider(0,1,0.25,0.01).input(()=>api.setMoonPendSpeed(ui.moonPendSpeed.value()));
  ui.moonSize = p.createSlider(4,20,9,1).input(()=>api.setMoonSize(ui.moonSize.value()));
  ui.moonSizeLfo = p.createSlider(0,10,3,0.1).input(()=>api.setMoonSizeLfo(ui.moonSizeLfo.value()));
  ui.moonPulses = p.createSlider(0,8,1,1).input(()=>api.setMoonPulses(ui.moonPulses.value()));
  ui.moonTrigOffset = p.createSlider(0,360,0,1).input(()=>api.setMoonTrigOffset(ui.moonTrigOffset.value()));
  ui.moonTouchTrig = p.createCheckbox("Moon touch trig", false).changed(()=>api.setMoonTouchTrig(ui.moonTouchTrig.checked()));
  ui.moonLevel = p.createSlider(0,1,0.7,0.01).input(()=>api.setMoonLevel(ui.moonLevel.value()));
  ui.moonBreathDepth = p.createSlider(0,1,0.4,0.01).input(()=>api.setMoonBreathDepth(ui.moonBreathDepth.value()));
  ui.moonBreathSpeed = p.createSlider(0,1,0.15,0.01).input(()=>api.setMoonBreathSpeed(ui.moonBreathSpeed.value()));

  ui.selVel = p.createSlider(0.05,1.0,0.7,0.01).input(()=>api.applyParam("vel", ui.selVel.value()));
  ui.selPitch = p.createSlider(-24,24,0,1).input(()=>api.applyParam("pitch", ui.selPitch.value()));
  ui.selRatchet = p.createSlider(1,4,1,1).input(()=>api.applyParam("ratchet", ui.selRatchet.value()));
  ui.selRepeat = p.createSlider(1,4,1,1).input(()=>api.applyParam("repeat", ui.selRepeat.value()));
  ui.selProb = p.createSlider(0,100,100,1).input(()=>api.applyParam("prob", ui.selProb.value()));
  ui.selPan = p.createSlider(-1,1,0,0.01).input(()=>api.applyParam("pan", ui.selPan.value()));
  ui.selDelay = p.createSlider(0,1,0,0.01).input(()=>api.applyParam("delaySend", ui.selDelay.value()));
  ui.selMicro = p.createSlider(-40,40,0,1).input(()=>api.applyParam("microMs", ui.selMicro.value()));
  ui.selSwing = p.createSlider(0,100,0,1).input(()=>api.applyParam("swingPct", ui.selSwing.value()));

  ui.selRandVel = p.createSlider(0,0.5,0,0.01).input(()=>api.applyParam("randVel", ui.selRandVel.value()));
  ui.selRandPitch = p.createSlider(0,6,0,1).input(()=>api.applyParam("randPitch", ui.selRandPitch.value()));
  ui.selRandTime = p.createSlider(0,30,0,1).input(()=>api.applyParam("randTimeMs", ui.selRandTime.value()));
  ui.selMute = p.createCheckbox("Step mute", false).changed(()=>api.applyParam("mute", ui.selMute.checked()));

  return ui;
}

export function refreshTrackSelect(ui, tracks, activeIdx){
  ui.trackSelect.elt.innerHTML="";
  tracks.forEach((t,i)=>ui.trackSelect.option("Circle "+(i+1),i));
  ui.trackSelect.value(activeIdx);
}
