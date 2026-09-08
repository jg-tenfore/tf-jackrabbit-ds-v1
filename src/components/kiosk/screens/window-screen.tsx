"use client";

import { ChoiceCard, type ChoiceOption } from "@/components/kiosk/choice-card";
import { Marquee } from "@/components/kiosk/marquee";
import { GET_STARTED_OPTIONS } from "@/components/kiosk/screens/get-started-screen";
import { WEATHER_ICONS, type WeatherCondition, weatherLabel } from "@/data/weather";
import { assetUrl } from "@/utils/asset-url";
import { cx } from "@/utils/cx";

const ASSET = (file: string) => assetUrl(`screen-assets/window/${file}`);

/** Height of the photo band. The remaining 400 belongs to `WelcomeNav`. */
export const WINDOW_HERO_HEIGHT = 898;

export const DEFAULT_MARQUEE = ["Trusted by over thousands of golfers nationwide", "Powering leagues, events, and daily play"];

/**
 * The attract screen — what the kiosk shows with nobody standing at it.
 *
 * Everything here is read from across a room, so the hierarchy inverts the rest
 * of the kiosk: the photograph carries the screen, the course name is the
 * largest type in the product, and the four ways in are shown as a row that
 * runs off the right edge rather than a tidy grid. The overflow is deliberate —
 * a row that visibly continues past the bezel says "there is more here" to
 * someone walking past, which a complete 2x2 does not. It **scrolls**, so that
 * promise is real: a half-visible card that cannot be reached is worse than no
 * card at all.
 *
 * The marquee is the only moving thing on the screen. Motion is what makes a
 * dark panel read as live rather than switched off, and one slow line does that
 * without competing with the photograph.
 *
 * The photo is dimmed top and bottom by a gradient rather than a flat scrim:
 * the logo, weather and marquee all need contrast, and the middle of the frame
 * is where the course actually shows.
 */
export const WindowScreen = ({
    courseName = "The Course",
    tagline = "Play. Eat. Relax.",
    temperature = 74,
    condition = "partly-cloudy-day",
    wind = "12mph NE",
    options = GET_STARTED_OPTIONS,
    marqueeItems = DEFAULT_MARQUEE,
    onSelect,
    className,
}: {
    courseName?: string;
    tagline?: string;
    temperature?: number;
    condition?: WeatherCondition;
    wind?: string;
    options?: ChoiceOption[];
    marqueeItems?: string[];
    onSelect?: (id: string) => void;
    className?: string;
}) => (
    <div className={cx("relative w-full overflow-hidden", className)} style={{ height: WINDOW_HERO_HEIGHT }}>
        <img src={ASSET("background.png")} alt="" aria-hidden="true" className="absolute inset-0 size-full object-cover" />
        {/* Darkest where text sits, clearest through the middle of the frame. */}
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/25 to-black/70" />

        <div className="relative z-10 flex h-full flex-col pt-[75px]">
            <header className="flex items-start justify-between px-16">
                <img src={ASSET("tf-logo-dark-bg.svg")} alt={`${courseName} — TenFore Golf`} className="h-[72px] w-[264px] object-contain object-left" />

                <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-2">
                        <span className="text-[50px] leading-none font-bold text-white tabular-nums">{temperature}&deg;</span>
                        <img
                            src={assetUrl(`screen-assets/weather/${WEATHER_ICONS[condition]}`)}
                            alt={weatherLabel(condition)}
                            className="size-16 shrink-0"
                        />
                    </div>
                    <p className="text-[24px] leading-none text-white/90">Wind: {wind}</p>
                </div>
            </header>

            <div className="mt-[110px] px-16">
                <h1 className="text-[48px] leading-tight font-bold text-white">Welcome to {courseName}</h1>
                <p className="mt-2 text-[32px] leading-tight text-white/90">{tagline}</p>
            </div>

            {/* Runs past the right edge on purpose and scrolls to reach the rest.
                overflow-y is explicitly hidden rather than left to default: with
                one axis scrollable CSS promotes the other to auto, which would
                let a stray pixel of card shadow make the row scroll vertically
                too. `pr-16` gives the last card the same inset as the first once
                the row is scrolled to its end. */}
            <div className="mt-[74px] flex gap-3 overflow-x-auto overflow-y-hidden overscroll-x-contain px-16 scrollbar-hide">
                {options.map((option) => (
                    <ChoiceCard key={option.id} option={option} size="sm" onPress={() => onSelect?.(option.id)} />
                ))}
            </div>

            <Marquee items={marqueeItems} className="mt-[97px] text-[30px] text-white/70" />
        </div>
    </div>
);
