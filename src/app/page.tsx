/**
 * Landing route for the Next app.
 *
 * This project's deliverable is Storybook, not a Next site — but `next build`,
 * `next dev` and `next start` all hard-fail without an app directory, and
 * shipping scripts that always error is a trap for CI and for anyone cloning
 * the repo. This is the minimal shell that makes them work, and the place the
 * clickable prototype will live once there is one.
 */
export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-16 text-center">
            <h1 className="text-4xl font-bold text-primary">JackRabbit Kiosk Design System</h1>
            <p className="max-w-prose text-lg text-tertiary">
                The component library lives in Storybook. Run <code className="font-mono">npm run storybook</code>, or see the published build.
            </p>
            <a
                href="https://jg-tenfore.github.io/tf-jackrabbit-ds-v1/"
                className="rounded-lg bg-brand-solid px-6 py-3 text-lg font-semibold text-white transition duration-100 ease-linear hover:bg-brand-solid_hover"
            >
                Open Storybook
            </a>
        </main>
    );
}
