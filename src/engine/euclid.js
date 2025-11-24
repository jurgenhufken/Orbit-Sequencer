export function euclidPattern(steps, pulses){
  if(pulses<=0) return Array(steps).fill(0);
  if(pulses>=steps) return Array(steps).fill(1);
  let pattern=[], counts=[], remainders=[];
  remainders.push(pulses);
  let divisor=steps-pulses, level=0;
  while(true){
    counts.push(Math.floor(divisor/remainders[level]));
    remainders.push(divisor%remainders[level]);
    divisor=remainders[level];
    level++;
    if(remainders[level]<=1) break;
  }
  counts.push(divisor);

  function build(l){
    if(l===-1) pattern.push(0);
    else if(l===-2) pattern.push(1);
    else {
      for(let i=0;i<counts[l];i++) build(l-1);
      if(remainders[l]!==0) build(l-2);
    }
  }
  build(level);
  return pattern.reverse();
}

export function rotatePattern(pattern, rot){
  const n = pattern.length;
  if(n===0) return pattern;
  const r = ((rot%n)+n)%n;
  return pattern.slice(r).concat(pattern.slice(0,r));
}
