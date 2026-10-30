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
                    `**Logo.** The 1936 crest is a clean vector and already a circle on transparency, so the one file works sharp at every size, on light screens and on photography. It keeps a square box, sized up from TenFore's 48px to 64px because the ring lettering closes up below that.

**Photos.** The sunset Getty frame on the attract screen; the sky and tree line from the same frame behind the standby board (the skyline shot was taken during tournament week and cannot be cropped clear of the grandstands); a bunkered fairway and the island green on the Get Started cards. First-time and shop keep the stock shots — nothing was supplied for them, and reusing the hero photo would show it twice.`,
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
