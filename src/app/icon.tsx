import { ImageResponse } from "next/og";

// Route segment config
export const runtime = "edge";

// Image metadata
export const size = {
    width: 32,
    height: 32,
};
export const contentType = "image/png";

// Image generation
export default function Icon() {
    return new ImageResponse(
        (
            <div
                style={{
                    fontSize: 24,
                    background: "transparent",
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#9333ea", // Purple brand color
                }}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 256 256"
                    width="100%"
                    height="100%"
                    fill="none"
                >
                    <rect width="256" height="256" fill="none" />
                    <line
                        x1="208"
                        y1="128"
                        x2="128"
                        y2="208"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="32"
                    />
                    <line
                        x1="192"
                        y1="40"
                        x2="40"
                        y2="192"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="32"
                    />
                </svg>
            </div>
        ),
        {
            ...size,
        }
    );
}
