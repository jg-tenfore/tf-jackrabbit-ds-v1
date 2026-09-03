/**
 * Mock member fixtures backing the simulated wallet scan.
 *
 * Each fixture is addressable by the payload a TenFore Golf Wallet pass would
 * carry, so a story can drive any auth outcome — recognised member, unknown
 * pass, expired pass — without touching component internals.
 */
export type MemberTier = "member" | "guest" | "staff";

export interface Member {
    id: string;
    /** The value encoded in the wallet QR / member card. */
    walletCode: string;
    firstName: string;
    lastName: string;
    tier: MemberTier;
    memberNumber: string;
    homeCourse: string;
    points: number;
    avatarUrl?: string;
}

export const MEMBERS: Member[] = [
    {
        id: "member-001",
        walletCode: "TF-1031466",
        firstName: "Justin",
        lastName: "Girard",
        tier: "member",
        memberNumber: "TF-1031466",
        homeCourse: "Sagamore Golf Club",
        points: 2480,
    },
    {
        id: "member-002",
        walletCode: "TF-2277301",
        firstName: "Dana",
        lastName: "Whitfield",
        tier: "member",
        memberNumber: "TF-2277301",
        homeCourse: "Sagamore Golf Club",
        points: 610,
    },
    {
        id: "staff-001",
        walletCode: "TF-STAFF-04",
        firstName: "Marcus",
        lastName: "Ellery",
        tier: "staff",
        memberNumber: "TF-STAFF-04",
        homeCourse: "Sagamore Golf Club",
        points: 0,
    },
];

/** Codes that resolve to a specific failure, for QA of the unhappy paths. */
export const EXPIRED_WALLET_CODE = "TF-0000000";

export const findMemberByWalletCode = (code: string) => MEMBERS.find((member) => member.walletCode.toLowerCase() === code.trim().toLowerCase());

/** The 6-digit manual-entry fallback shown on the "Enter your code" screen. */
export const MANUAL_ENTRY_CODES: Record<string, string> = {
    "482913": "member-001",
    "771204": "member-002",
};
