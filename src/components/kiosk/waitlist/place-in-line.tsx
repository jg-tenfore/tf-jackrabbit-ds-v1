import { Users01 } from "@untitledui/icons";

/** Place in line and party size — the two numbers the board will show them. */
export const PlaceInLine = ({ place, partySize }: { place: number; partySize: number }) => (
    <div className="flex items-stretch rounded-2xl bg-secondary px-2 py-5">
        <div className="flex w-[200px] flex-col items-center gap-1">
            <span className="text-[44px] leading-none font-bold text-primary tabular-nums">#{place}</span>
            <span className="text-[18px] text-tertiary">Place in line</span>
        </div>
        <div aria-hidden="true" className="w-[3px] bg-border-primary" />
        <div className="flex w-[200px] flex-col items-center gap-1">
            <span className="flex items-center gap-2 text-[44px] leading-none font-bold text-primary tabular-nums">
                <Users01 className="size-9 text-fg-quaternary" aria-hidden="true" />
                {partySize >= 8 ? "8+" : partySize}
            </span>
            <span className="text-[18px] text-tertiary">{partySize === 1 ? "Player" : "Players"}</span>
        </div>
    </div>
);
