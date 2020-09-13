export function sleep(tick) {
  return new Promise(resolve => setTimeout(resolve, tick))
}