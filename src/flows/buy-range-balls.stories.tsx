import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { GlobalNav } from "@/components/kiosk/app-chrome/global-nav";
import { OrderSummaryNav } from "@/components/kiosk/app-chrome/order-summary-nav";
import { WelcomeNav } from "@/components/kiosk/app-chrome/welcome-nav";
import { CheckoutMethodFullScreen } from "@/components/kiosk/modals/full-screen-variants";
import { AddedToBagScreen } from "@/components/kiosk/order/added-to-bag-screen";
import { FollowInstructionsScreen } from "@/components/kiosk/order/follow-instructions-screen";
import { type OrderLine, OrderReviewScreen } from "@/components/kiosk/order/order-review-screen";
import { AddContactScreen } from "@/components/kiosk/range/add-contact-screen";
import { type BallCode, BallCodeScreen, type Delivery, type DeliveryChannel, deliveriesFor } from "@/components/kiosk/range/ball-code-screen";
import { BucketDetailDialog } from "@/components/kiosk/range/bucket-detail-dialog";
import { BucketPickerScreen } from "@/components/kiosk/range/bucket-picker-screen";
import { ATTRACT_OPTIONS_WITH_RANGE, GET_STARTED_OPTIONS_WITH_RANGE, GetStartedScreen } from "@/components/kiosk/screens/get-started-screen";
import { WindowScreen } from "@/components/kiosk/screens/window-screen";
import { MEMBERS, type Member } from "@/data/members";
import { RANGE_BUCKETS, RANGE_EXTRAS, RANGE_MENU_FULL, type RangeBucket, type RangeExtra, ballCountLabel } from "@/data/range-catalog";
import { KioskScreen } from "@/kiosk/kiosk-frame";
import { withKioskFrame, withKioskSession } from "@/kiosk/story-helpers";

const meta = {
    title: "User Flows/Buy Range Balls",
    parameters: {
        layout: "fullscreen",
        docs: {
            description: {
                component: `**Buying a bucket of range balls at the kiosk** — from the Nov 24 call with Weston, for San Diego in January. The Birdie app already does this: buy a bucket, get a ball code on the confirmation, and receive it by email and text. This is the same purchase on the kiosk.

**The flow.** The welcome screen leads its card row with **Buy a Bucket of Balls**, and Get Started gains the same card. The range opens as a **grid of product cards** — the food menu's cards, three across, so more sizes or range items are just more cards — and tapping one opens the same **item detail sheet** as a bottle of water (quantity, Add). The guest then pays through the same review, checkout-method and card-reader screens as any order, and lands on **Here's your ball code**.

**The ball code screen** is the new part:
- The code is set large and grouped in threes, with a hint to photograph it.
- An **email and a text go out automatically** to whatever the account has on file. Each row says where it went, masked, because this is a public screen.
- **If the account is missing a phone or an email**, that row offers to add one: it collects the number or address and sends the code there. A guest has neither, so both rows offer.
- **Several buckets get several codes**, one per bucket, labelled.

**Six Options** shows a busier range — the three sizes plus a Party Pack, a Range Gift Card and a Punch Card — in the same grid, two rows deep. The extras are sample items with placeholder prices; only buckets go on to issue ball codes.

**Edge cases covered here:** a sold-out size (dimmed, like a sold-out sandwich); two buckets; members with both contacts, email only and phone only; a guest with neither; and the add-contact entry screens, where Send stays off until the number or address is valid.

**Accounts used:** Justin G. has both on file, Dana W. has email only, and Marcus E. has phone only (\`src/data/members.ts\`).

**Data.** Buckets live in \`src/data/range-catalog.ts\` — Small (about 40 balls, $12), Medium (about 80, $15), Large (about 120, $18) — with product shots made for this flow. The pro-shop catalogue's own two bucket rows still carry a practice-net photo from its raw capture; they are generated, so they are left for that script to fix. Codes are sample values; real ones come from the ball machine's system.`,
            },
        },
    },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const bucket = (size: "Small" | "Medium" | "Large") => RANGE_BUCKETS.find((b) => b.size === size)!;
const line = (size: "Small" | "Medium" | "Large", quantity: number): OrderLine => ({
    item: bucket(size),
    quantity,
    modifiers: [ballCountLabel(bucket(size))],
});
const totals = (lines: OrderLine[]) => {
    const subtotalCents = lines.reduce((t, l) => t + l.item.priceCents * l.quantity, 0);
    return { subtotalCents, taxCents: Math.round(subtotalCents * 0.0825) };
};

const [JUSTIN, DANA, MARCUS] = MEMBERS;
const ONE_CODE: BallCode[] = [{ code: "482193", bucket: bucket("Medium") }];
const TWO_CODES: BallCode[] = [
    { code: "482193", bucket: bucket("Large") },
    { code: "907514", bucket: bucket("Large") },
];

// ---------------------------------------------------------------------------
// Getting there
// ---------------------------------------------------------------------------

/**
 * The welcome screen at a venue with a driving range: the range card leads the
 * attract row, so it shows without a scroll to anyone walking past.
 */
export const Attract: Story = {
    decorators: [withKioskSession(), withKioskFrame()],
    render: () => (
        <KioskScreen scroll={false} footer={<WelcomeNav onStartOrder={() => {}} onJoinWaitlist={() => {}} />}>
            <WindowScreen options={ATTRACT_OPTIONS_WITH_RANGE} onSelect={() => {}} />
        </KioskScreen>
    ),
};

/**
 * The hub at a venue with a driving range. Five cards, all the same size: the
 * range sits on its own in the last row.
 */
export const GetStartedWithRange: Story = {
    decorators: [withKioskSession(), withKioskFrame()],
    render: () => (
        <KioskScreen scroll={false}>
            <GetStartedScreen options={GET_STARTED_OPTIONS_WITH_RANGE} onSelect={() => {}} onBack={() => {}} />
        </KioskScreen>
    ),
};

/**
 * The range grid, with the item detail sheet a tap away. Interactive: tap a
 * card to open its sheet, as on the food menu. `detail` opens a sheet on load.
 */
const pickerStory = (initial: { items?: (RangeBucket | RangeExtra)[]; detail?: RangeBucket | RangeExtra; soldOut?: string[] } = {}): Story => ({
    decorators: [withKioskSession({ member: JUSTIN }), withKioskFrame()],
    render: function Picker() {
        const [open, setOpen] = useState<RangeBucket | RangeExtra | null>(initial.detail ?? null);
        // The browse rail, as on the food menu: the bag shows from the start, at
        // 0, because once someone is shopping an order exists.
        return (
            <KioskScreen scroll={false} footer={<GlobalNav hasOrder cartCount={0} cartTotal={0} />}>
                <BucketPickerScreen items={initial.items ?? RANGE_BUCKETS} onSelect={setOpen} soldOutIds={initial.soldOut} />
                {open && <BucketDetailDialog item={open} onClose={() => setOpen(null)} />}
            </KioskScreen>
        );
    },
});

/** The range grid: every size as a product card. More sizes are more cards. */
export const ChooseABucket = pickerStory();

/** A card tapped: the item detail sheet, as on the food menu. */
export const BucketDetail = pickerStory({ detail: bucket("Medium") });

/**
 * A busier range: six cards — the three sizes plus a party pack, a range gift
 * card and a punch card. Same grid, two rows; the extras open the same detail
 * sheet with a line saying what each one gets you.
 */
export const SixOptions = pickerStory({ items: RANGE_MENU_FULL });

/** A party pack tapped: four buckets, four codes, said under the price. */
export const PartyPackDetail = pickerStory({ items: RANGE_MENU_FULL, detail: RANGE_EXTRAS[0] });

/** The large size has run out for the day: dimmed and unpressable, like a sold-out sandwich. */
export const LargeSoldOut = pickerStory({ soldOut: ["range-bucket-large"] });

/** The confirmation beat after Add — the same one food gets — then back to the grid. */
export const AddedToBag: Story = {
    decorators: [withKioskSession({ member: JUSTIN }), withKioskFrame()],
    render: () => (
        <KioskScreen scroll={false}>
            <AddedToBagScreen itemCount={1} totalCents={bucket("Medium").priceCents} />
        </KioskScreen>
    ),
};

// ---------------------------------------------------------------------------
// Paying — the same screens as any order
// ---------------------------------------------------------------------------

/** Buckets are ordinary order lines, so the review screen needs nothing new. */
export const YourOrder: Story = {
    decorators: [withKioskSession({ member: JUSTIN }), withKioskFrame()],
    render: function Cart() {
        const [lines, setLines] = useState<OrderLine[]>([line("Medium", 1)]);
        const { subtotalCents, taxCents } = totals(lines);
        return (
            <KioskScreen
                scroll={false}
                footer={
                    <OrderSummaryNav
                        subtotalCents={subtotalCents}
                        taxCents={taxCents}
                        onCompleteOrder={() => {}}
                        onOrderMore={() => {}}
                        onStartOver={() => {}}
                    />
                }
            >
                <OrderReviewScreen
                    lines={lines}
                    showTotals={false}
                    onChangeQuantity={(id, q) => setLines((prev) => prev.map((l) => (l.item.id === id ? { ...l, quantity: q } : l)))}
                    onRemove={(id) => setLines((prev) => prev.filter((l) => l.item.id !== id))}
                    onViewDetails={() => {}}
                />
            </KioskScreen>
        );
    },
};

/** Where to pay — the shared full-screen question. */
export const CheckoutMethod: Story = {
    decorators: [withKioskSession({ member: JUSTIN }), withKioskFrame()],
    render: () => (
        <KioskScreen scroll={false} footer={<GlobalNav hasOrder cartCount={1} cartTotal={16.24} />}>
            <OrderReviewScreen lines={[line("Medium", 1)]} />
            <CheckoutMethodFullScreen isOpen onOpenChange={() => {}} onBack={() => {}} onStartOver={() => {}} />
        </KioskScreen>
    ),
};

/** The hand-off to the card reader. */
export const FollowInstructions: Story = {
    decorators: [withKioskSession({ member: JUSTIN }), withKioskFrame()],
    render: () => {
        const { subtotalCents, taxCents } = totals([line("Medium", 1)]);
        return (
            <KioskScreen
                scroll={false}
                footer={
                    <OrderSummaryNav
                        subtotalCents={subtotalCents}
                        taxCents={taxCents}
                        onCompleteOrder={() => {}}
                        onOrderMore={() => {}}
                        onStartOver={() => {}}
                    />
                }
            >
                <FollowInstructionsScreen />
            </KioskScreen>
        );
    },
};

// ---------------------------------------------------------------------------
// The ball code
// ---------------------------------------------------------------------------

/**
 * The confirmation, end to end: shows the code with whatever the account has
 * on file, and an Add button opens the entry screen for the missing channel.
 * Send returns here with that row marked sent.
 */
const BallCodeFlow = ({ member, codes = ONE_CODE }: { member?: Member; codes?: BallCode[] }) => {
    const initial = deliveriesFor(member);
    const [email, setEmail] = useState<Delivery>(initial.email);
    const [text, setText] = useState<Delivery>(initial.text);
    const [adding, setAdding] = useState<DeliveryChannel | null>(null);
    const [value, setValue] = useState("");

    if (adding) {
        const isText = adding === "text";
        return (
            <KioskScreen scroll={false}>
                <AddContactScreen
                    channel={adding}
                    value={value}
                    onChange={setValue}
                    onBack={() => {
                        setAdding(null);
                        setValue("");
                    }}
                    onSend={() => {
                        (isText ? setText : setEmail)({ status: "sent", to: value });
                        setAdding(null);
                        setValue("");
                    }}
                />
            </KioskScreen>
        );
    }

    return (
        <KioskScreen scroll={false}>
            <BallCodeScreen codes={codes} email={email} text={text} onAdd={setAdding} onDone={() => {}} />
        </KioskScreen>
    );
};

/** The happy path: both on file, both sent, nothing to ask. */
export const BallCodeSent: Story = {
    decorators: [withKioskSession({ member: JUSTIN }), withKioskFrame()],
    render: () => <BallCodeFlow member={JUSTIN} />,
};

/**
 * Email on file, no phone. The email went; the text row offers to add a
 * number. Interactive: Add phone → enter a number → Send comes back sent.
 */
export const BallCodeNoPhone: Story = {
    decorators: [withKioskSession({ member: DANA }), withKioskFrame()],
    render: () => <BallCodeFlow member={DANA} />,
};

/** The number entry from Add phone, part-typed: Send waits for ten digits. */
export const TextMeMyCode: Story = {
    decorators: [withKioskSession({ member: DANA }), withKioskFrame()],
    render: function Entry() {
        const [value, setValue] = useState("(240) 555-01");
        return (
            <KioskScreen scroll={false}>
                <AddContactScreen channel="text" value={value} onChange={setValue} onBack={() => {}} onSend={() => {}} />
            </KioskScreen>
        );
    },
};

/** After Send: both rows sent, the new number masked like the one on file would be. */
export const BallCodeTextAdded: Story = {
    decorators: [withKioskSession({ member: DANA }), withKioskFrame()],
    render: () => (
        <KioskScreen scroll={false}>
            <BallCodeScreen codes={ONE_CODE} email={{ status: "sent", to: DANA.email! }} text={{ status: "sent", to: "(240) 555-0177" }} onDone={() => {}} />
        </KioskScreen>
    ),
};

/** Phone on file, no email — the mirror case. Interactive, like No Phone. */
export const BallCodeNoEmail: Story = {
    decorators: [withKioskSession({ member: MARCUS }), withKioskFrame()],
    render: () => <BallCodeFlow member={MARCUS} />,
};

/** The address entry from Add email: the email keyboard, with `@` and `.com`. */
export const EmailMeMyCode: Story = {
    decorators: [withKioskSession({ member: MARCUS }), withKioskFrame()],
    render: function Entry() {
        const [value, setValue] = useState("");
        return (
            <KioskScreen scroll={false}>
                <AddContactScreen channel="email" value={value} onChange={setValue} onBack={() => {}} onSend={() => {}} />
            </KioskScreen>
        );
    },
};

/**
 * A guest has nothing on file, so nothing went out automatically: both rows
 * offer, under a line inviting a copy. The code itself never depends on it.
 */
export const BallCodeGuest: Story = {
    decorators: [withKioskSession(), withKioskFrame()],
    render: () => <BallCodeFlow />,
};

/** Two buckets, two codes — each labelled, set smaller so both fit. */
export const BallCodeTwoBuckets: Story = {
    decorators: [withKioskSession({ member: JUSTIN }), withKioskFrame()],
    render: () => <BallCodeFlow member={JUSTIN} codes={TWO_CODES} />,
};
