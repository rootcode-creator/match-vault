import "@stream-io/video-react-sdk/dist/css/styles.css";
import { Inter } from "next/font/google";
import { StreamVideoProvider } from "./facetime-components/StreamVideoProvider";

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
        <html lang='en'>
            <body className={inter.className}>
                <StreamVideoProvider>
                    {children}
                </StreamVideoProvider>
            </body>
        </html>
    );
}
