export class AudioBus {
  constructor(ctx){
    this.ctx = ctx;
    this.masterGain = ctx.createGain();
    this.masterGain.gain.value = 0.8;
    this.masterGain.connect(ctx.destination);

    this.delayNode = ctx.createDelay(1.0);
    this.delayNode.delayTime.value = 0.25;

    this.delayGain = ctx.createGain();
    this.delayGain.gain.value = 0.25;

    this.delayNode.connect(this.delayGain);
    this.delayGain.connect(ctx.destination);
  }
}
