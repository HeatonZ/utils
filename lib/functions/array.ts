import {get} from 'lodash'

export const arrayToDict = <T, K extends keyof T>(
    arr: Array<T>,
    { key, value }:{key: K, value?: K}
  ):{[key: string | number | symbol]: T | T[K]} => {
    if (!Array.isArray(arr)) {
      return {}
    }
    return arr.reduce((pre:{[key: string | number | symbol]: T | T[K]}, cur:T) => {
      return { ...pre, [get(cur, key) as unknown as string]: value ? cur[value] : cur }
    }, {})
  }