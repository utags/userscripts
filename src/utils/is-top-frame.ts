import { win } from '../globals/win'

export function isTopFrame(): boolean {
  return win.self === win.top
}
