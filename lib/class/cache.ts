interface Options {
  waitTime?: number
}

export class PromiseCache<T> {
  cache:Record<string | number, {
    time: number
    data: T | Promise<T>
  }> = {}
  formatter?: (val: unknown) => T
  options: Options = {}
  constructor (formatter?: (val:unknown) => T, options: Options = {}) {
    this.formatter = formatter
    this.options = options
  }

  private deleteTime (key: string | number): void {
    // 如果存储的数据已超时，则删除数据
    if (this.options.waitTime && this.cache[key]?.time && Date.now() - this.options.waitTime > this.cache[key].time) {
      delete this.cache[key]
    }
  }
  has (key: string | number):boolean {
    this.deleteTime(key)
    if (this.cache[key] !== undefined) {
      return true
    }
    return false
  }
  set (key:string | number, val: T | Promise<T>):void {
    this.cache[key] = {
      data: val,
      time: 0
    }
    if (this.options.waitTime) {
      this.cache[key].time = Date.now()
    }
  }
  async get (key: string | number = ''): Promise<T> {
    this.deleteTime(key)
    const val = this.cache[key]?.data
    if (val instanceof Promise) {
      try {
        const awaitVal = await val
        if (this.formatter) {
          this.cache[key].data = this.formatter?.(awaitVal)
        } else {
          this.cache[key].data = awaitVal
        }
        return this.cache[key]?.data
      } catch (error) {
        delete this.cache[key]
        throw error
      }
    }
    return val
  }
}

export class Cache<T> {
  cache:Record<string, T> = {}
  has (key: string):boolean {
    if (this.cache[key] !== undefined) {
      return true
    }
    return false
  }
  set (key:string, val: T):void {
    this.cache[key] = val
  }
  get (key: string): T {
    const val = this.cache[key]
    return val
  }
}
