"use client";

import { assetUrl } from "@/utils/asset-url";
import { cx } from "@/utils/cx";

const ASSET = (file: string) => assetUrl(`screen-assets/standby/${file}`);

export interface StandbyColumn {
    id: string;
    label: string;
    /** Filename under `screen-assets/standby/`. */
    icon: string;
    /** First name plus last initial — see the note on privacy below. */
    names: string[];
}

export const DEFAULT_STANDBY_COLUMNS: StandbyColumn[] = [
    { id: "received", label: "Received", icon: "status-received.svg", names: ["Liam S.", "Noah T.", "Ethan R.", "Oliver J.", "Lucas M."] },
    { id: "ready", label: "Ready", icon: "status-ready.svg", names: ["Weston F.", "Lisa G.", "Jarrette S."] },
];

/**
 * The standby board — who is waiting, and who is up.
 *
 * This is the one screen in the kiosk nobody is standing at. It is read from
 * across the pro shop by people waiting for their name, so it inverts the usual
 * hierarchy: no controls in the body, names at 30px, and only two columns
 * because a third would halve the type.
 *
 * Names are **first name plus last initial**, which is the whole reason this can
 * be a public board at all. A full name on a screen anyone can photograph is a
 * different thing entirely, so the shape is enforced here in the fixture rather
 * than left to whatever the booking system happens to return.
 *
 * The two statuses are distinguished by **icon as well as colour** — a ball on a
 * tee for received, a golfer mid-swing for ready — because the board is read at
 * distance and at an angle, and both headings are the same green.
 */
export const StandbyBoardScreen = ({
    heading = "Players currently in Standby...",
    columns = DEFAULT_STANDBY_COLUMNS,
    className,
}: {
    heading?: string;
    columns?: StandbyColumn[];
    className?: string;
}) => (
    <div className={cx("relative flex h-full w-full flex-col", className)}>
        {/* The photo band sits behind the top of the card rather than filling
            the screen: the card has to start high enough to hold five names, and
            a full-bleed photo behind white text would leave the names on grass. */}
        <div className="absolute inset-x-0 top-0 h-[420px] overflow-hidden">
            <img src={assetUrl("screen-assets/window/background.png")} alt="" aria-hidden="true" className="size-full object-cover" />
            <div aria-hidden="true" className="absolute inset-0 bg-black/55" />
        </div>

        <div className="relative z-10 flex flex-col items-center pt-[60px]">
            <img src={ASSET("wordmark-dark-bg.svg")} alt="TenFore Golf" className="h-[52px] w-[264px] object-contain" />
            <h1 className="mt-8 px-16 text-center text-[38px] leading-tight font-bold text-white">{heading}</h1>
        </div>

        <div className="relative z-10 mt-8 min-h-0 flex-1 px-11">
            <div className="flex h-full flex-col rounded-t-3xl bg-primary px-9 pt-9 shadow-[0_-8px_32px_rgba(0,0,0,0.18)]">
                <div className="grid grid-cols-2 gap-8">
                    {columns.map((column) => (
                        <div key={column.id} className="flex flex-col">
                            <div className="flex items-center gap-4">
                                <img src={ASSET(column.icon)} alt="" aria-hidden="true" className="size-14 shrink-0" />
                                <h2 className="text-[27px] font-bold text-brand-secondary">{column.label}</h2>
                            </div>

                            <ul className="mt-7 flex flex-col gap-6">
                                {column.names.map((name) => (
                                    <li key={name} className="text-[27px] font-bold text-primary">
                                        {name}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
);
