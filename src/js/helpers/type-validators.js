export function oneOf (obj = {}) {
  return v => Object.values(obj).includes(v)
}
