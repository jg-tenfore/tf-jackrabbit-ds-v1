/**
 * The standalone clickable prototype.
 *
 * Deployed to `/prototype/` on Pages, beside Storybook at the root. It imports
 * the same `src/components/kiosk/*` the stories do — that is the point of it
 * living in this repo rather than its own: an edit to a component reaches both
 * surfaces on the next build, with no package to publish and no version to keep
 * in sync.
 */
import { PrototypeApp } from "@/prototype/prototype-app";

export default function Home() {
    return <PrototypeApp />;
}
