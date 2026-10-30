import type { Meta } from "@storybook/nextjs-vite";
import { MEMORIAL_PARK_GOLF } from "@/data/courses";
import { courseStories, courseStoryDocs } from "@/golf-courses/course-stories";

const meta = {
    title: "Golf Courses/Memorial Park",
    parameters: {
        layout: "fullscreen",
        docs: {
            description: {
                component: courseStoryDocs(
                    MEMORIAL_PARK_GOLF,
                    "Houston - Memorial Park Golf Course",
                    `**Logo.** The 1936 seal is already a circle on transparency, so the one file works on light screens and on photography. It keeps a square box, sized up from TenFore's 48px to 64px because the ring lettering closes up below that.

**Photos.** The sunset Getty frame on the attract screen; the downtown skyline over the course behind the standby board, top-anchored so the band is skyline rather than tournament grandstands; a bunkered fairway and the island green on the Get Started cards. First-time and shop keep the stock shots — nothing was supplied for them, and reusing the hero photo would show it twice.

**Needs a better logo file:** the seal is a 192px web favicon. That covers the 64px mark and the 96px attract lockup at 2x, but the store rail's 112px tile gets 1.71x and will look soft on a real panel. Ask the course for an SVG or a 512px+ PNG.`,
                ),
            },
        },
    },
} satisfies Meta;

export default meta;

const stories = courseStories(MEMORIAL_PARK_GOLF);

export const Attract = stories.Attract;
export const GetStarted = stories.GetStarted;
export const DoYouWantToLogIn = stories.DoYouWantToLogIn;
export const EnterYourEmail = stories.EnterYourEmail;
export const StoreHome = stories.StoreHome;
export const StandbyBoard = stories.StandbyBoard;
export const OrderSuccessful = stories.OrderSuccessful;
