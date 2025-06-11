import { isObject, mergeWith } from "lodash"

export interface useConfigReturn {
  initConfig: any,
  config: any
}

const filter = (config: any, { $view, station }: any): any => {
  if (config?.ViewConfig?.[$view]) {
    config = {
      ...config,
      ...config.ViewConfig[$view]
    }
  }
  delete config?.ViewConfig
  const stationName = station?.name
  if (config?.StationConfig?.[station?.type]) {
    config = {
      ...config,
      ...config.StationConfig[station?.type]
    }
  }
  if (config?.StationConfig?.[station?.name]) {
    config = {
      ...config,
      ...config.StationConfig[station?.name]
    }
  }
  delete config?.StationConfig
  const views:any[] = []
  let includes: any[] = []
  if (!includes.length && !config?.AfterInclude && !config?.AfterExclude && !config?.RangeInclude && !config?.RangeExclude) {
    includes = views
  }
  if (config?.AfterInclude) {
    includes = includes.concat(views.slice(views.indexOf(config?.AfterInclude)))
    delete config?.AfterInclude
  }
  if (config?.AfterExclude) {
    const v = views.slice(views.indexOf(config?.AfterExclude))
    if (!includes.length) {
      includes = views
    }
    includes = includes.filter((v1: any) => !v.includes(v1))
    delete config?.AfterExclude
  }
  if (config.RangeInclude) {
    includes = includes.concat(config.RangeInclude)
    delete config?.RangeInclude
  }

  if (config.RangeExclude) {
    if (!includes.length) {
      includes = views
    }
    includes = includes.filter((v1: any) => !config.RangeExclude.includes(v1))
    delete config?.RangeExclude
  }
  if (!includes.includes($view)) {
    return undefined
  }
  if ((config.StationExclude && config.StationExclude.some((s: string | RegExp) => (s instanceof RegExp ? s.test(stationName) : s === stationName))) || (config.StationInclude && !config.StationInclude.some((s: string | RegExp) => (s instanceof RegExp ? s.test(stationName) : s === stationName)))) {
    return undefined
  }
  delete config?.StationInclude
  delete config?.StationExclude
  Object.keys(config).forEach((k: string) => {
    if (!config[k]) {
      return
    }
    if (isObject(config[k])) {
      config[k] = filter(config[k], { $view, station })
    }
  })
  return config
}


export let innerConfig = {}
export default function useConfig (): useConfigReturn {
  const init = async (config: any, mergeConfig?: any):Promise<any> => {
    config = mergeConfig ? mergeWith(config, mergeConfig, (o:any, s:any):any => {
      if (Array.isArray(o) && Array.isArray(s)) {
        return s
      }
    }) : config
    config = filter(config, {  })
    innerConfig = config
    return config
  }

  return {
    initConfig: init,
    config: innerConfig
  }
}
