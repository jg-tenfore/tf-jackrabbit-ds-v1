import type { Meta } from "@storybook/nextjs-vite";
import { MONTGOMERY_COUNTY_GOLF } from "@/data/courses";
import { courseStories, courseStoryDocs } from "@/golf-courses/course-stories";

const meta = {
    title: "Golf Courses/Montgomery County Golf",
    parameters: {
        layout: "fullscreen",
        docs: {
            description: {
                component: courseStoryDocs(
                    MONTGOMERY_COUNTY_GOLF,
                    "MCG - Montgomery County Golf",
                    `**Logo.** The MCG lettermark is a vector, so it is used as drawn on light screens and recoloured white for the photo bands — its green and violet both sink into a dimmed fairway. It is wide and carries "Everything Golf" set small underneath, so it takes a 64px height rather than TenFore's 48px square; at 48px the tagline drops under 5px.

**Photos.** Hampshire Greens on the attract screen, Little Bennett behind the standby board, and a lesson, the cart path and a Northwest green on the Get Started cards. The shop card keeps the stock food shot — no food photography was supplied.

**Under 2x:** the attract photo is 1426px for a 750px band (1.90x). Every source is 2560px on its long edge, which a portrait crop cannot fully use. Close enough to review; a 3000px+ original would fix it.`,
                ),
            },
        },
    },
} satisfies Meta;

export default meta;

const stories = courseStories(MONTGOMERY_COUNTY_GOLF);

export const Attract = stories.Attract;
export const GetStarted = stories.GetStarted;
export const DoYouWantToLogIn = stories.DoYouWantToLogIn;
export const EnterYourEmail = stories.EnterYourEmail;
export const StoreHome = stories.StoreHome;
export const StandbyBoard = stories.StandbyBoard;
export const OrderSuccessful = stories.OrderSuccessful;
