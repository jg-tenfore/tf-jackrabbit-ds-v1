import type { WeatherCondition } from "@/data/weather";

/**
 * A golf course's branding on the kiosk: its marks, its photography and the
 * few lines of copy that name it.
 *
 * Branding is data, not a fork. Every screen reads this through
 * `useCourseBrand()` and falls back to the TenFore assets it already ships with,
 * so a new course is one object here plus its files under
 * `public/screen-assets/courses/<id>/` — never a second copy of a screen.
 *
 * Paths are base-relative (no leading slash) and go through `assetUrl()` at the
 * point of use, the same as every other asset in the project.
 *
 * The colour tokens are deliberately *not* part of this. Both courses brief in
 * a green close to TenFore's own, and the token set is shared with Buck — a
 * per-course ramp is a decision to make with the courses, not a side effect of
 * dropping a logo in.
 */
export interface CourseBrand {
    id: string;
    /** As the course writes it — "Welcome to {name}" on the attract screen. */
    name: string;
    tagline: string;
    marqueeItems: string[];
    /**
     * The mark on light screens: the brand mark that opens most screens and the
     * store rail's logo tile. `className` sizes it, because a wide lettermark
     * and a round seal cannot share TenFore's 48px square.
     */
    mark: { src: string; className: string };
    /** The lockup on photography: the attract header and the standby board. */
    markOnDark: { src: string; className: string };
    /** The attract screen's photo band, cropped for 750x898. */
    heroImage: string;
    /** The standby board's photo band, cropped for 750x420. */
    standbyImage: string;
    /** Course photos for the Get Started cards, keyed by `ChoiceOption.id`. */
    optionImages: Partial<Record<string, string>>;
    /** A plausible day at the course, so the attract screen is not 74° everywhere. */
    weather: { temperature: number; condition: WeatherCondition; wind: string };
}

const MCG = (file: string) => `screen-assets/courses/mcg/${file}`;
const MEMORIAL_PARK = (file: string) => `screen-assets/courses/memorial-park/${file}`;

export const MONTGOMERY_COUNTY_GOLF: CourseBrand = {
    id: "mcg",
    name: "Montgomery County Golf",
    // Not "Everything Golf" — the lettermark already says it, directly above.
    tagline: "Play. Eat. Relax.",
    marqueeItems: ["Tee times, lessons and range time in one place", "Everything golf, right here at the course"],
    // The lettermark is 136x88 with its tagline set small underneath, so it
    // needs height the round marks do not: at 48px tall "Everything Golf" is
    // under 5px and stops being text.
    mark: { src: MCG("logo.svg"), className: "h-16 w-auto" },
    markOnDark: { src: MCG("logo-on-dark.svg"), className: "h-[88px] w-auto" },
    heroImage: MCG("hero.jpg"),
    standbyImage: MCG("standby.jpg"),
    optionImages: {
        "first-time": MCG("card-first-time.jpg"),
        "check-in": MCG("card-check-in.jpg"),
        "tee-time": MCG("card-tee-time.jpg"),
    },
    weather: { temperature: 58, condition: "sun-cloudy", wind: "8mph NW" },
};

export const MEMORIAL_PARK_GOLF: CourseBrand = {
    id: "memorial-park",
    name: "Memorial Park Golf Course",
    tagline: "Houston's course since 1936.",
    marqueeItems: ["Houston's municipal course since 1936", "Book a tee time, grab a bite, enjoy the round"],
    // A round seal, so it keeps a square box — just a larger one, because the
    // ring lettering is the identity and it closes up below about 64px. The
    // source is 192px, which caps every render at 96px for 2x.
    mark: { src: MEMORIAL_PARK("logo.png"), className: "size-16" },
    markOnDark: { src: MEMORIAL_PARK("logo.png"), className: "size-24" },
    heroImage: MEMORIAL_PARK("hero.jpg"),
    standbyImage: MEMORIAL_PARK("standby.jpg"),
    // No first-time or shop photography was supplied, so those cards keep the
    // stock shots rather than reusing a course photo the hero already shows.
    optionImages: {
        "check-in": MEMORIAL_PARK("card-check-in.jpg"),
        "tee-time": MEMORIAL_PARK("card-tee-time.jpg"),
    },
    weather: { temperature: 84, condition: "sunny", wind: "9mph SE" },
};

export const COURSE_BRANDS = [MONTGOMERY_COUNTY_GOLF, MEMORIAL_PARK_GOLF];
