import type { StoryObj } from "@storybook/nextjs-vite";
import { GlobalNav } from "@/components/kiosk/app-chrome/global-nav";
import { SignedOutCard } from "@/components/kiosk/app-chrome/wallet-drawer";
import { WelcomeNav } from "@/components/kiosk/app-chrome/welcome-nav";
import { OrderSuccessfulScreen } from "@/components/kiosk/order/order-successful-screen";
import { EntryScreen, EntryTextField } from "@/components/kiosk/screens/entry-screen";
import { GetStartedScreen } from "@/components/kiosk/screens/get-started-screen";
import { HomeScreen } from "@/components/kiosk/screens/home-screen";
import { ScanPromptScreen } from "@/components/kiosk/screens/scan-prompt-screen";
import { StandbyBoardScreen } from "@/components/kiosk/screens/standby-board-screen";
import { WindowScreen } from "@/components/kiosk/screens/window-screen";
import type { CourseBrand } from "@/data/courses";
import { MEMBERS } from "@/data/members";
import { PRO_SHOP_PRODUCTS } from "@/data/pro-shop-catalog";
import { KioskScreen } from "@/kiosk/kiosk-frame";
import { withCourseBrand, withKioskFrame, withKioskSession } from "@/kiosk/story-helpers";

type Story = StoryObj;

/** The sleeves with real pack shots, as the store home story uses. */
const FEATURED = ["titleist-pro-v1-sleeve", "taylormade-tp5-sleeve", "titleist-avx-sleeve"]
    .map((id) => PRO_SHOP_PRODUCTS.find((p) => p.id === id))
    .filter((p): p is (typeof PRO_SHOP_PRODUCTS)[number] => Boolean(p));

/**
 * The branded screens, built once for any course.
 *
 * Each course's story file is these seven with a different `CourseBrand`, so the
 * two courses are guaranteed to show the same screens in the same states — the
 * only thing that differs between them is the branding, which is the thing
 * under review. The renders are the same components the User Flows stories use,
 * with no branding props: everything course-specific arrives through
 * `withCourseBrand`, which is how a real install would receive it.
 *
 * The seven are the screens where a course is visible — its photography, its
 * mark or its name. Screens that carry neither (the tee sheet, the keypads) look
 * identical at every course and are left to User Flows.
 */
export const courseStories = (brand: CourseBrand) => {
    const branded = (story: Story, member: (typeof MEMBERS)[number] | null = null): Story => ({
        ...story,
        decorators: [withKioskSession({ member }), withCourseBrand(brand), withKioskFrame()],
    });

    return {
        /** The attract loop: the course's own photo, mark, weather and marquee. */
        Attract: branded({
            render: () => (
                <KioskScreen scroll={false} footer={<WelcomeNav onStartOrder={() => {}} onJoinWaitlist={() => {}} />}>
                    <WindowScreen onSelect={() => {}} />
                </KioskScreen>
            ),
        }),

        /** The hub. Course photos replace the stock shots where the course supplied one. */
        GetStarted: branded({
            render: () => (
                <KioskScreen scroll={false}>
                    <GetStartedScreen onSelect={() => {}} onBack={() => {}} />
                </KioskScreen>
            ),
        }),

        /** The scan prompt names the course in its subtitle. */
        DoYouWantToLogIn: branded({
            render: () => (
                <KioskScreen scroll={false}>
                    <ScanPromptScreen onEnterCode={() => {}} onDecline={() => {}} onHowToLogIn={() => {}} onStartOver={() => {}} />
                </KioskScreen>
            ),
        }),

        /** An entry screen, to show the mark at the head of the auth steps. */
        EnterYourEmail: branded({
            render: () => (
                <KioskScreen scroll={false} footer={<GlobalNav isPromptExpanded onHowToLogIn={() => {}} />}>
                    <EntryScreen
                        title="Enter your email"
                        subtitle="Enter your email address to get started."
                        field={<EntryTextField value="" placeholder="Enter your email" />}
                        value=""
                        onChange={() => {}}
                        layout="email"
                        onContinue={() => {}}
                        onBack={() => {}}
                    />
                </KioskScreen>
            ),
        }),

        /** The store landing, signed in. The rail's logo tile carries the course mark. */
        StoreHome: branded(
            {
                render: () => (
                    <KioskScreen scroll={false} footer={<GlobalNav hasOrder cartCount={0} cartTotal={0} />}>
                        <HomeScreen featuredTitle="New Arrivals" featuredItems={FEATURED} />
                    </KioskScreen>
                ),
            },
            MEMBERS[0],
        ),

        /** The board read from across the pro shop: course photo band and light mark. */
        StandbyBoard: branded({
            render: () => (
                <KioskScreen scroll={false} footer={<GlobalNav />}>
                    <StandbyBoardScreen />
                </KioskScreen>
            ),
        }),

        /**
         * The sign-off. The course mark opens it; "powered by TenFore Golf" stays
         * at the foot, because that line is the platform's credit, not the
         * venue's — a branded kiosk is still a TenFore kiosk.
         */
        OrderSuccessful: branded(
            {
                render: () => (
                    <KioskScreen
                        scroll={false}
                        footer={
                            <div className="relative h-[110px] w-full bg-primary">
                                <div className="absolute right-16 bottom-0">
                                    <SignedOutCard />
                                </div>
                            </div>
                        }
                    >
                        <OrderSuccessfulScreen onDismiss={() => {}} />
                    </KioskScreen>
                ),
            },
            MEMBERS[0],
        ),
    };
};

export const courseStoryDocs = (brand: CourseBrand, sourceFolder: string, notes: string) =>
    `**${brand.name}** — the kiosk branded for this course, from the logo and photography in \`references/102926/${sourceFolder}\`.

Nothing here is a new screen. These are the same components as **User Flows**, rendered inside a \`CourseBrandProvider\` with the course's \`CourseBrand\` (\`src/data/courses.ts\`). Every screen falls back to TenFore's own marks and stock photography when no brand is set, so branding a new course is one data object plus its files — never a fork.

Photos are cropped to the exact box they fill, at 2x, by \`npm run build-course-assets\`.

${notes}`;
