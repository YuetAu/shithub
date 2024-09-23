import { Providers } from './provider';
import './styles/globals.css'
import { Metadata, Viewport } from 'next'

const APP_NAME = "ShitHub";
const APP_DEFAULT_TITLE = "ShitHub";
const APP_TITLE_TEMPLATE = "%s - Shit Counter";
const APP_DESCRIPTION = "Provide the shittest experience for you.";

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_DEFAULT_TITLE,
    startupImage: [
      {
        url: "/poop.png",
      },
    ],
  },
  formatDetection: {
    telephone: false,
  },
  metadataBase: new URL("https://shithub.xyz"),
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
  twitter: {
    card: "summary",
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
  icons: {
    icon: '/poop.png',
    apple: '/poop.png',
  },
};

export const viewport: Viewport = {
  themeColor: "#FFFFFF",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}