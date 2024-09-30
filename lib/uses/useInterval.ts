
export interface useVisibleRunReturn {
  interval: string | number | NodeJS.Timeout | undefined,
  run: () => void,
  stop: () => void,
  reset: (cb: any, timeout?: number) => void
}

export default function useInterval (cb: any = ():void => {}, timeout?: number): useVisibleRunReturn {
  let interval: string | number | NodeJS.Timeout | undefined
  let loading = false
  let callback: () => Promise<void>

  const reset = (cb: any, timeoutReset?: number):void => {
    if (interval) {
      stop()
    }
    timeout = timeoutReset || timeout
    callback = async ():Promise<void> => {
      try {
        if (loading) {
          return
        }
        loading = true
        await cb()
        loading = false
      } catch (error) {
        loading = false
        console.log(error)
      }
    }
  }

  reset(cb, timeout)
  const run = (to?: number):void => {
    if (interval) {
      stop()
    }
    interval = setInterval(() => {
      callback()
    }, to || timeout)
    callback()
  }
  const stop = ():void => {
    if (!interval) {
      return
    }

    clearInterval(interval)
    interval = undefined
  }

  return {
    interval,
    run,
    stop,
    reset
  }
}
