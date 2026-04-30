import "@stream-io/video-react-sdk/dist/css/styles.css";
import { Inter } from "next/font/google";

const inter = Inter({
    subsets: ["latin"],
    preload: false,
    display: "swap",
});



export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className={inter.className}>
            {children}
        </div>
    );
}
