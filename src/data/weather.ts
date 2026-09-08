/**
 * The supplied weather icon set, keyed by condition rather than by file number.
 *
 * The exports are named `NN_condition_color_w32.svg` — a numbering that means
 * something in the icon library and nothing here. Screens ask for `"sunny"` or
 * `"partly-cloudy-day"`; the numbers stay in this file where a re-export can
 * renumber them without touching a component.
 *
 * All forty are 64x64, so they render at 32 CSS px at 2x, or larger with no
 * penalty — they are vector.
 */
export type WeatherCondition =
    | "sunny"
    | "moon-stars"
    | "cloud"
    | "sun-cloudy"
    | "moon-cloudy"
    | "cloudy"
    | "lightning"
    | "wet"
    | "light-rain"
    | "moderate-rain"
    | "heavy-rain"
    | "rainstorm"
    | "heavy-rainstorm"
    | "thunderstorm"
    | "fog"
    | "hail"
    | "light-snow"
    | "moderate-snow"
    | "heavy-snow"
    | "snowstorm"
    | "heavy-snowstorm"
    | "snow"
    | "windy"
    | "blizzard"
    | "mist"
    | "haze"
    | "typhoon"
    | "unavailable"
    | "sunrise"
    | "sunset"
    | "low-temperature"
    | "high-temperature"
    | "sparkles"
    | "full-moon"
    | "partly-cloudy-day"
    | "partly-cloudy-night"
    | "dry"
    | "blowing-sand"
    | "sandstorm"
    | "rainbow";

export const WEATHER_ICONS: Record<WeatherCondition, string> = {
    sunny: "01_sunny_color_w32.svg",
    "moon-stars": "02_moon_stars_color_w32.svg",
    cloud: "03_cloud_color_w32.svg",
    "sun-cloudy": "04_sun_cloudy_color_w32.svg",
    "moon-cloudy": "05_moon_cloudy_color_w32.svg",
    cloudy: "06_cloudy_color_w32.svg",
    lightning: "07_lightning_color_w32.svg",
    wet: "08_wet_color_w32.svg",
    "light-rain": "09_light_rain_color_w32.svg",
    "moderate-rain": "10_moderate_rain_color_w32.svg",
    "heavy-rain": "11_heavy_rain_color_w32.svg",
    rainstorm: "12_rainstorm_color_w32.svg",
    "heavy-rainstorm": "13_heavy_rainstorm_color_w32.svg",
    thunderstorm: "14_thunderstorm_color_w32.svg",
    fog: "15_fog_color_w32.svg",
    hail: "16_hail_color_w32.svg",
    // The export is misspelled "sonw"; corrected here rather than renamed on
    // disk, so re-running the asset pipeline never silently breaks the lookup.
    "light-snow": "17_light_sonw_color_w32.svg",
    "moderate-snow": "18_moderate_snow_color_w32.svg",
    "heavy-snow": "19_heavy_snow_color_w32.svg",
    snowstorm: "20_snowstorm_color_w32.svg",
    "heavy-snowstorm": "21_heavy_snowstorm_color_w32.svg",
    snow: "22_snow_color_w32.svg",
    windy: "23_windy_color_w32.svg",
    blizzard: "24_blizzard_color_w32.svg",
    mist: "25_mist_color_w32.svg",
    haze: "26_haze_color_w32.svg",
    typhoon: "27_typhoon_color_w32.svg",
    unavailable: "28_NA_color_w32.svg",
    sunrise: "29_sunrise_color_w32.svg",
    sunset: "30_sunset_color_w32.svg",
    "low-temperature": "31_low_temperature_color_w32.svg",
    "high-temperature": "32_high_temperature_color_w32.svg",
    sparkles: "33_sparkles_color_w32.svg",
    "full-moon": "34_full_moon_color_w32.svg",
    "partly-cloudy-day": "35_partly_cloudy_daytime_color_w32.svg",
    "partly-cloudy-night": "36_partly_cloudy_night_color_w32.svg",
    dry: "37_dry_color_w32.svg",
    "blowing-sand": "38_blowing_sand_color_w32.svg",
    sandstorm: "39_sandstorm_color_w32.svg",
    rainbow: "40_rainbow_color_w32.svg",
};

/** Human-readable condition, for the icon's accessible name. */
export const weatherLabel = (condition: WeatherCondition) => condition.replace(/-/g, " ");
