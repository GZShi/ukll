
export function parse(raw) {
  let metaRaw = parseBlock(raw, 'meta')
  let infos = metaRaw.split(/\r?\n/)
  let title = infos.shift()
  let meta = {title, infos}


  let score = parseBlock(raw, 'score')
  let parts = score.split(/#\n?/).map(p => p.trim()).filter(p => p)
  parts = parts.map((part, i) => {
    let beats = parseBeats(part, i)
    return {index: i, beats }
  })

  return {meta, parts}
}

function parseBlock(raw, name) {
  let pattern = new RegExp(`==${name}\\.start==\\r?\\n([^]*)\\r?\\n==${name}\\.end==`, 'g')
  let match = pattern.exec(raw)
  if (!match) return null
  return match[1]
}

function parseBeats(raw) {
  let pattern = /(.*);\n?/g

  let beats = []
  do {
    let match = pattern.exec(raw)
    if (!match) return beats

    let beatStr = match[1]
    let notes = beatStr.split(',').map(parseNote)

    beats.push({index: beats.length, notes})
  } while(true)
}

function parseNote(raw, index) {
  // [1000] 品格 fret
  // <0000> 琶音 arpeggio
  // (0---) 指弹 thrum
  let pattern = /\[([0-9a-z\-]+)\](<([0-9\-]+)>|\(([0-9\-]+)\))/
  let match = pattern.exec(raw)
  if (!match) return {index}
  
  let leftHand = match[1].split('').map(parseInt36)

  let type, rightHand
  if (match[3]) {
    type = 'arpeggio'
    rightHand = match[3].split('').map(parseInt36)
  }
  if (match[4]) {
    type = 'thrum'
    rightHand = match[4].split('').map(parseInt36)
  }

  // 根据右手演奏的琴弦，决定左手是否需要按弦
  leftHand = leftHand.map((fret, index) => {
    if (rightHand[index] === null || isNaN(rightHand[index])) return null
    return fret
  })

  return {
    index,
    press: {
      strings: leftHand
    },
    play: {
      type, // 弹奏类型：指弹、琶音
      strings: rightHand, // 右手演奏琴弦
    }
  }

  function parseInt36(str) {
    if (str === '-') return NaN
    return parseInt(str, 36)
  }
}