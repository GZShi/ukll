import {parse} from './parser'

import chongerfei from 'raw-loader!./scores/chongerfei.score'
import tiankongzhicheng from 'raw-loader!./scores/tiankongzhicheng.score'

let raws = [
  { name: '虫儿飞', data: chongerfei },
  { name: '天空之城', data: tiankongzhicheng},
]

export function getList() {
  return raws
}

export function getScoreByName(name) {
  let raw = raws.find(r =>r.name === name)

  return parse(raw.data)
}