import "@stream-io/video-react-sdk/dist/css/styles.css";
import { Inter } from "next/font/google";
import { StreamVideoProvider } from "./facetime-components/StreamVideoProvider";
import "./globals.css";

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
                    <nav className='w-full py-4 md:px-8 px-4 text-center flex items-center justify-end sticky top-0 bg-white '>
                        <span className='text-sm text-gray-500'>Guest mode</span>
                    </nav>

                    {children}
                </StreamVideoProvider>
            </body>
        </html>
    );
}