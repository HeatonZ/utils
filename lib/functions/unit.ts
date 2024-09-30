import { Decimal } from 'decimal.js'
export interface PresetItem {
    unit: string;
    weight: number;
  }
  
export const PRESETS: Record<
  string,
  Record<string, PresetItem>
> = {
  solid: {
    ton: {
      unit: "ton",
      weight: 100000,
    },
    kg: {
      unit: "kg",
      weight: 1000,
    },
    g: {
      unit: "g",
      weight: 1,
    },
    mg: {
      unit: "mg",
      weight: 0.001,
    },
  },
  liquid: {
    kl: {
      unit: "kl",
      weight: 1000000,
    },
    l: {
      unit: "l",
      weight: 1000,
    },
    ml: {
      unit: "ml",
      weight: 1,
    },
    ul: {
      unit: "ul",
      weight: 0.001,
    },
    μl: {
      unit: "μl",
      weight: 0.001,
    },
  },
  time: {
    ms: {
      unit: "ms",
      weight: 0.001,
    },
    s: {
      unit: "s",
      weight: 1,
    },
    min: {
      unit: "min",
      weight: 60,
    },
    hour: {
      unit: "hour",
      weight: 3600,
    },
    hr: {
      unit: "hr",
      weight: 3600,
    },
    h: {
      unit: "hour",
      weight: 3600,
    },
  },
  rate: {
    rpm: {
      unit: "rpm",
      weight: 1,
    },
  },
  temperate: {
    c: {
      unit: "c",
      weight: 1,
    },
    "℃": {
      unit: "℃",
      weight: 1,
    },
  },
  molecule: {
    kmol: {
      unit: "kmol",
      weight: 1000,
    },
    mol: {
      unit: "mol",
      weight: 1,
    },
    mmol: {
      unit: "mmol",
      weight: 0.001,
    },
    umol: {
      unit: "umol",
      weight: 0.000001,
    },
  },
  pressure: {
    atm: {
      unit: "atm",
      weight: 1,
    },
    mpa: {
      unit: "MPa",
      weight: 9.869232667160128,
    },
    psi: {
      unit: "psi",
      weight: 0.0680457267283615,
    },
    bar: {
      unit: "bar",
      weight: 0.9869232667160128,
    },
  },
  flowRate: {
    lpm: {
      unit: "LPM",
      weight: 1,
    },
    mlpm: {
      unit: "mLPM",
      weight: 0.001,
    },
  },
  ratio: {
    " ": {
      unit: "",
      weight: 1,
    },
    "％": {
      unit: "％",
      weight: 0.01,
    },
    "%": {
      unit: "%",
      weight: 0.01,
    },
  },
}
export const formatValueString = (
  value: string = ""
): [number, string | undefined] => {
  value = value.trim()
  const val = /^-?[0-9]\d*\.?\d*/.exec(value)?.[0]
  const unit = /(?=\S)(\D+)$/.exec(value)?.[0]
  return [Number(val), unit]
}

export const formatNumberValue = (
  value: string,
  output: string,
  presetItem?: Record<string, PresetItem>, 
  _preset?: string,
): number => {
  const [val, unit] = formatValueString(value)
  if (unit === output) {
    return val
  }
  if (!unit) {
    return val
  }
  const presetKey =
    _preset ||
    Object.keys(PRESETS).find((p: string) => PRESETS[p][unit.toLowerCase()])

  const preset = presetItem || PRESETS[presetKey || ""] || {}  
  if (!PRESETS[presetKey || ""]) {
    console.warn(`not support preset ${value}`)
  }
  if (!preset[unit.toLowerCase()] || !preset[output.toLowerCase()]) {
    return val || 0
  }
  const ratio =
    new Decimal(preset[unit.toLowerCase()]?.weight)
      .dividedBy(preset[output.toLowerCase()]?.weight || 1)
      .toNumber() || 1
  return new Decimal(val || 0).times(ratio).toNumber()
}
