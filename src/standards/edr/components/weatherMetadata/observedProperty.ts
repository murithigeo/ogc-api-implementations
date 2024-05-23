import * as types from "../../types";

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

export const dewPointTemp:types.ObservedProperty={
    label: "Dew Point Temperature",
    description: "Dew point temperature in Kelvin",
    id: "http://codes.wmo.int/grib2/codeflag/4.2/0-0-6",
}


export const pressure: types.ObservedProperty={
    label: "Atmospheric Pressure ",
    description: "Atmos pressure (Corrected to M.S.L. if station's elevation !==0)",
    id: "http://codes.wmo.int/grib2/codeflag/4.2/0-3-1",
}

