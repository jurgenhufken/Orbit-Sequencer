export class Transport {
  constructor(){
    this.running = false;
    this.bpm = 92;
    this.startTime = 0;
    this.beatsPerBar = 4;
    this.ctx = null;
  }
  attachAudioContext(ctx){ this.ctx = ctx; }
  setBpm(bpm){ this.bpm = bpm; }
  start(){
    if(!this.ctx) throw new Error("No audio context");
    this.startTime = this.ctx.currentTime;
    this.running = true;
  }
  stop(){ this.running = false; }
  getT(){
    if(!this.running || !this.ctx) return 0;
    return Math.max(0, this.ctx.currentTime - this.startTime);
  }
  getBeatTime(){
    return this.getT() * (this.bpm/60);
  }
  nextBarBeat(){
    const bt = this.getBeatTime();
    const bar = Math.ceil(bt/this.beatsPerBar);
    return bar*this.beatsPerBar;
  }
}
