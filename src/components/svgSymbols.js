export function arpeggio(size) {
  let m = (x, y) => `M${x*size},${y*size}`
  let l = (x, y) => `L${x*size},${y*size}`
  let q = (x1,y1, x2,y2) => `Q${x1*size},${y1*size} ${x2*size},${y2*size}`

  return [
    m(1/2, 0),
    q(2/3,1/6, 1/2,1/3),
    l(1/3,1/2),
    q(1/6,2/3, 1/3,5/6),
    l(1/2,1),
    q(1/3,5/6, 1/2,2/3),
    l(2/3,1/2),
    q(5/6,1/3, 2/3,1/6),
    l(1/2,0),
  ].join(' ')
}