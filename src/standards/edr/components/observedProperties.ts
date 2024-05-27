import * as types from "../types";

export const windSpeed: types.ObservedProperty = {
  description: "Wind speed rate in m/s",
  label: "Wind speed",
  id: "https://codes.wmo.int/grib2/codeflag/4.2/_3-1-19",
};

export const windDirection: types.ObservedProperty = {
  description: "Wind direction in angular degrees",
  label: "Wind Direction",
  id: "http://codes.wmo.int/grib2/codeflag/4.2/10-0-4",
};

/**
 * @constant temperature Just the baseline temperature
 */
export const temperature: types.ObservedProperty = {
  id: "https://codes.wmo.int/grib2/codeflag/4.2/_0-0-0",
  label: "Air Temperature",
  description: "temperature in Kelvin",
};

/**
 * @constant dewPointTemp
 */

export const dewPointTemp: types.ObservedProperty = {
  label: "Dew Point Temperature",
  description: "Dew point temperature in Kelvin",
  id: "http://codes.wmo.int/grib2/codeflag/4.2/0-0-6",
};

export const pressure: types.ObservedProperty = {
  label: "Atmospheric Pressure ",
  description:
    "Atmos pressure (Corrected to M.S.L. if station's elevation !==0)",
  id: "http://codes.wmo.int/grib2/codeflag/4.2/0-3-1",
};

export const windType: types.ObservedProperty = {
  label: "Wind Type",
  description:
    "The type of wind observation. Possible values:\n  A = Abridged Beaufort\n  B = Beaufort\n  C = Calm\n  H = 5-Minute Average Speed\n  N = Normal\n  R = 60-Minute Average Speed\n  Q = Squall\n  T = 180 Minute Average Speed\n  V = Variable\n ",
  id: "",
};
