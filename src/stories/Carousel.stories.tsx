import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ChevronLeft, ChevronRight } from "@untitledui/icons";
import { Carousel } from "@/components/application/carousel/carousel-base";
import { sagamoreImagesByCategory } from "@/components/foundations/sagamore/sagamore-assets";
import { cx } from "@/utils/cx";

/**
 * The Carousel walks a golfer through the course one frame at a time — a gallery
 * of signature holes, a flyover of the back nine, or the morning view from the
 * first tee. Built on Embla, it keeps the swing smooth on touch and keyboard
 * alike. Every frame uses real Sagamore photography indexed from images/sagamore.
 */
const meta = {
    title: "Components/Media & Visuals/Carousel",
    component: Carousel.Root,
    parameters: { layout: "centered" },
    argTypes: {
        orientation: {
            control: "inline-radio",
            options: ["horizontal", "vertical"],
            description: "Direction the frames scroll past.",
        },
    },
} satisfies Meta<typeof Carousel.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Real Sagamore course photography, indexed from images/sagamore. */
const PHOTOS = sagamoreImagesByCategory("photography");

const arrowClass =
    "absolute top-1/2 -translate-y-1/2 flex size-9 items-center justify-center rounded-full bg-primary text-fg-secondary shadow-md ring-1 ring-primary transition duration-100 ease-linear hover:bg-primary_hover";

/** A single course photo slide. */
const PhotoSlide = ({ src, alt }: { src: string; alt: string }) => (
    <img src={src} alt={alt} className="aspect-video w-full rounded-xl object-cover" loading="lazy" />
);

/** Default flyover of the course with arrow triggers and dot indicators. */
export const Playground: Story = {
    render: (args) => (
        <Carousel.Root {...args} className="w-150">
            <Carousel.Content className="gap-4">
                {PHOTOS.map((photo) => (
                    <Carousel.Item key={photo.name}>
                        <PhotoSlide src={photo.src} alt={photo.name} />
                    </Carousel.Item>
                ))}
            </Carousel.Content>

            <Carousel.PrevTrigger className={({ isDisabled }) => cx(arrowClass, "left-3", isDisabled && "cursor-not-allowed opacity-50")}>
                <ChevronLeft className="size-5" aria-hidden="true" />
            </Carousel.PrevTrigger>
            <Carousel.NextTrigger className={({ isDisabled }) => cx(arrowClass, "right-3", isDisabled && "cursor-not-allowed opacity-50")}>
                <ChevronRight className="size-5" aria-hidden="true" />
            </Carousel.NextTrigger>

            <Carousel.IndicatorGroup className="absolute inset-x-0 bottom-3 flex justify-center gap-2">
                {({ index }) => (
                    <Carousel.Indicator
                        key={index}
                        index={index}
                        className={({ isSelected }) =>
                            cx("size-2 rounded-full transition duration-100 ease-linear", isSelected ? "w-5 bg-white" : "bg-white/60")
                        }
                    />
                )}
            </Carousel.IndicatorGroup>
        </Carousel.Root>
    ),
};

/** Looping gallery: arrows never disable because the reel wraps back to the first frame. */
export const Looping: Story = {
    render: () => (
        <Carousel.Root opts={{ loop: true }} className="w-150">
            <Carousel.Content className="gap-4">
                {PHOTOS.map((photo) => (
                    <Carousel.Item key={photo.name}>
                        <PhotoSlide src={photo.src} alt={photo.name} />
                    </Carousel.Item>
                ))}
            </Carousel.Content>

            <Carousel.PrevTrigger className={cx(arrowClass, "left-3")}>
                <ChevronLeft className="size-5" aria-hidden="true" />
            </Carousel.PrevTrigger>
            <Carousel.NextTrigger className={cx(arrowClass, "right-3")}>
                <ChevronRight className="size-5" aria-hidden="true" />
            </Carousel.NextTrigger>
        </Carousel.Root>
    ),
};

/** Dot indicators only — a clean photo strip with no arrows; swipe or tap a dot to navigate. */
export const IndicatorsOnly: Story = {
    render: () => (
        <Carousel.Root className="w-150">
            <Carousel.Content className="gap-4">
                {PHOTOS.map((photo) => (
                    <Carousel.Item key={photo.name}>
                        <PhotoSlide src={photo.src} alt={photo.name} />
                    </Carousel.Item>
                ))}
            </Carousel.Content>

            <Carousel.IndicatorGroup className="mt-4 flex justify-center gap-2">
                {({ index }) => (
                    <Carousel.Indicator
                        key={index}
                        index={index}
                        className={({ isSelected }) =>
                            cx("size-2.5 rounded-full transition duration-100 ease-linear", isSelected ? "bg-fg-primary" : "bg-fg-quaternary")
                        }
                    />
                )}
            </Carousel.IndicatorGroup>
        </Carousel.Root>
    ),
};

/** Looping course photography framed with overlay arrow triggers. */
export const WithImagery: Story = {
    render: () => (
        <Carousel.Root opts={{ loop: true }} className="w-150">
            <Carousel.Content>
                {PHOTOS.map((photo) => (
                    <Carousel.Item key={photo.name}>
                        <PhotoSlide src={photo.src} alt={photo.name} />
                    </Carousel.Item>
                ))}
            </Carousel.Content>

            <Carousel.PrevTrigger className={cx(arrowClass, "left-3")}>
                <ChevronLeft className="size-5" aria-hidden="true" />
            </Carousel.PrevTrigger>
            <Carousel.NextTrigger className={cx(arrowClass, "right-3")}>
                <ChevronRight className="size-5" aria-hidden="true" />
            </Carousel.NextTrigger>
        </Carousel.Root>
    ),
};

/** Vertical scroll of the photo reel — handy for a sidebar gallery or scorecard preview. */
export const Vertical: Story = {
    render: () => (
        <Carousel.Root orientation="vertical" className="h-100 w-150">
            <Carousel.Content className="h-100 gap-4">
                {PHOTOS.map((photo) => (
                    <Carousel.Item key={photo.name} className="basis-full">
                        <img src={photo.src} alt={photo.name} className="size-full rounded-xl object-cover" loading="lazy" />
                    </Carousel.Item>
                ))}
            </Carousel.Content>

            <Carousel.PrevTrigger className="absolute top-3 left-1/2 flex size-9 -translate-x-1/2 items-center justify-center rounded-full bg-primary text-fg-secondary shadow-md ring-1 ring-primary transition duration-100 ease-linear hover:bg-primary_hover">
                <ChevronLeft className="size-5 rotate-90" aria-hidden="true" />
            </Carousel.PrevTrigger>
            <Carousel.NextTrigger className="absolute bottom-3 left-1/2 flex size-9 -translate-x-1/2 items-center justify-center rounded-full bg-primary text-fg-secondary shadow-md ring-1 ring-primary transition duration-100 ease-linear hover:bg-primary_hover">
                <ChevronRight className="size-5 rotate-90" aria-hidden="true" />
            </Carousel.NextTrigger>
        </Carousel.Root>
    ),
};
