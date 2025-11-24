export function getTargetSteps(track, scope, selectedStep, rangeA, rangeB){
  if(scope==="Selected") return [selectedStep];
  if(scope==="All") return [...Array(track.N).keys()];
  if(scope==="Picked"){
    const arr=[]; for(let i=0;i<track.N;i++) if(track.steps[i].picked) arr.push(i);
    return arr.length?arr:[selectedStep];
  }
  const a=Math.min(rangeA, rangeB), b=Math.max(rangeA, rangeB);
  const out=[]; for(let i=a;i<=b;i++) out.push(i);
  return out;
}
