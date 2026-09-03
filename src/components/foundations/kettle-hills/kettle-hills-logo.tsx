import type { ImgHTMLAttributes } from "react";
import { kettleHillsLogo } from "./kettle-hills-assets";

/**
 * The Kettle Hills Golf Course logo. A convenience wrapper around the indexed
 * logo asset — size it with `className` (e.g. `h-16 w-auto`).
 */
export const KettleHillsLogo = (props: Omit<ImgHTMLAttributes<HTMLImageElement>, "src">) => {
    return <img src={kettleHillsLogo} alt="Kettle Hills Golf Course" {...props} />;
};
