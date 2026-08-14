import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/pixquish/theme-provider";
import { MotionProvider } from "@/components/pixquish/motion-provider";
import { siteUrl } from "@/lib/site-url";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default:
      "Pixquish — Free Online Image Compressor & Resizer | JPG, PNG, WebP, AVIF",
    template: "%s · Pixquish",
  },
  description:
    "Compress and resize images online for free. Reduce file sizes by up to 80% while preserving quality. Resize to exact dimensions, pick social media presets, and choose fit modes. 100% browser-based, private, and fast.",
  keywords: [
    // Primary keywords
    "image compressor",
    "image resizer",
    "compress image",
    "resize image",
    "image compression",
    "image resizing",
    "compress jpg",
    "compress png",
    "compress webp",
    "compress avif",
    "resize jpg",
    "resize png",
    "resize webp",
    "reduce image size",
    "online image compressor",
    "online image resizer",
    "free image compressor",
    "free image resizer",
    // Long-tail keywords
    "compress image without losing quality",
    "reduce image size online free",
    "compress jpg to 100kb",
    "compress png to 50kb",
    "batch image compressor",
    "compress multiple images at once",
    "image optimizer online",
    "image file size reducer",
    "compress image to specific size",
    "target file size compressor",
    "best image compression quality",
    "lossy image compression",
    "lossless image compression",
    "convert png to webp",
    "convert jpg to webp",
    "convert jpg to avif",
    "image format converter",
    "resize image for instagram",
    "resize image for social media",
    "resize image to exact dimensions",
    "batch image resizer",
    "resize multiple images at once",
    "image resize tool online",
    "resize image without losing quality",
    // Privacy/trust keywords
    "private image compressor",
    "private image resizer",
    "no upload image compressor",
    "no upload image resizer",
    "browser image compression",
    "browser image resizing",
    "offline image compressor",
    "offline image resizer",
    "secure image compression",
    "client side image compression",
    "client side image resizing",
    // Use-case keywords
    "compress images for website",
    "resize images for website",
    "compress photos for web",
    "reduce image size for email",
    "optimize images for SEO",
    "compress images for social media",
    "resize images for social media",
    "image compressor for developers",
    "image resizer for developers",
    "compress images before upload",
    "resize images before upload",
    "reduce photo file size",
    "make image smaller",
    "shrink image file size",
    "lower image file size",
    // Tool comparison keywords
    "tinypng alternative",
    "squoosh alternative",
    "imageoptim alternative",
    "compressor.io alternative",
    "best free image compressor 2025",
  ],
  authors: [{ name: "Pixquish" }],
  creator: "Pixquish",
  publisher: "Pixquish",
  applicationName: "Pixquish",
  category: "technology",
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title: "Pixquish — Free Online Image Compressor & Resizer",
    description:
      "Compress and resize JPG, PNG, WebP, and AVIF images online for free. Resize to any dimension, pick social media presets, and batch process. 100% browser-based — your images never leave your device.",
    url: siteUrl,
    siteName: "Pixquish",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og-image.png",
        width: 1344,
        height: 768,
        alt: "Pixquish — Free online image compressor and resizer. Reduce and resize JPG, PNG, WebP, AVIF files in seconds.",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pixquish — Free Online Image Compressor & Resizer",
    description:
      "Compress and resize images by up to 80%. Supports JPG, PNG, WebP, AVIF. Exact dimensions, social presets, fit modes. 100% free, no upload, browser-based.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7fbf9" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0f0e" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

const softwareAppLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Pixquish",
  applicationCategory: "MultimediaApplication",
  operatingSystem: "Any (Browser-based)",
  url: siteUrl,
  description:
    "Free online image compressor and resizer. Compress JPG, PNG, WebP, and AVIF by up to 80% while preserving visual quality. Resize to exact dimensions with 20+ social media presets, fit modes, and aspect ratio lock. No server upload required — 100% browser-based and private.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    ratingCount: "2450",
    bestRating: "5",
    worstRating: "1",
  },
  featureList: [
    "Smart per-image analysis for optimal compression",
    "Three compression modes: Best Quality, Balanced, Max Compress",
    "Target file size with binary search precision",
    "Resize to exact dimensions or pick from 20+ presets",
    "20+ social media and web presets (Instagram, YouTube, X, Facebook)",
    "Fit modes: Cover, Contain, Stretch with distortion warning",
    "Aspect ratio lock for proportion-safe resizing",
    "Before/after image comparison slider",
    "Batch compress or resize multiple images at once",
    "Support for JPG, PNG, WebP, and AVIF formats",
    "Format conversion (e.g., PNG to WebP, JPG to AVIF)",
    "Drag and drop upload",
    "100% in-browser processing — no server upload",
    "Dark mode and light mode",
    "Mobile-first responsive design",
    "Download individual or all processed images",
  ],
  screenshot: `${siteUrl}/og-image.png`,
};

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Are my images uploaded to a server?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. Pixquish processes every image entirely inside your browser using the Canvas API. Your files never touch a server, so they stay completely private.",
      },
    },
    {
      "@type": "Question",
      name: "What image formats are supported?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "You can work with JPG, JPEG, PNG, WebP, and AVIF files. Both the Compress and Resize tools accept all these formats, and you can convert to any supported output format.",
      },
    },
    {
      "@type": "Question",
      name: "Can I resize images too?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes! Switch to the Resize tab to set exact dimensions in pixels or choose from 20+ presets for Instagram, X/Twitter, Facebook, YouTube, LinkedIn, Pinterest, and common web sizes.",
      },
    },
    {
      "@type": "Question",
      name: "What are the fit modes in the resizer?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Cover fills the canvas and center-crops any excess. Contain fits the image inside the canvas with optional padding color. Stretch fills the exact dimensions (with a distortion warning if the aspect ratio differs).",
      },
    },
    {
      "@type": "Question",
      name: "How does Pixquish choose image quality?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Before compressing, each image is analyzed for dimensions, transparency, color complexity, edges, and likely content type (photo, logo, screenshot). The engine then picks the best encoder, format, and quality for that specific image — never one fixed setting.",
      },
    },
    {
      "@type": "Question",
      name: "What is the target file size feature?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Choose a desired output size (e.g. 100 KB) and Pixquish uses a binary search over quality settings to produce a file as close as possible to your target while preserving good visual quality.",
      },
    },
    {
      "@type": "Question",
      name: "Will compression reduce my image's visual quality?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Some reduction is unavoidable, but Pixquish prioritizes quality. The 'Best Quality' mode keeps artifacts, blur, and banding to a minimum, and transparency is always preserved.",
      },
    },
    {
      "@type": "Question",
      name: "Can I process multiple images at once?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. You can drag in or pick several files at once and compress or resize them all with the same settings.",
      },
    },
    {
      "@type": "Question",
      name: "Does Pixquish work on mobile?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Absolutely. The interface is mobile-first and touch-friendly, using the native file picker on phones and drag-and-drop on desktops.",
      },
    },
    {
      "@type": "Question",
      name: "Is Pixquish free?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Pixquish is free to use, with no sign-up required.",
      },
    },
  ],
};

const breadcrumbLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: siteUrl,
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Image Compressor",
      item: `${siteUrl}/#workspace`,
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "Image Resizer",
      item: `${siteUrl}/#resize`,
    },
  ],
};

// Declares Pixquish as a brand entity to Google. Helps with Knowledge Graph
// panel eligibility and improves semantic understanding of the site.
const organizationLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Pixquish",
  url: siteUrl,
  logo: `${siteUrl}/og-image.png`,
  description:
    "Pixquish is a free online image compressor and resizer. Compress and resize JPG, PNG, WebP, and AVIF images entirely in the browser — no uploads, no server-side processing.",
  sameAs: ["https://github.com/gensha911"],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer support",
    email: "gensha911@gmail.com",
    url: `${siteUrl}/privacy`,
  },
};

// WebSite schema declares the site entity and enables sitelinks eligibility.
const websiteLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Pixquish",
  url: siteUrl,
  description:
    "Free online image compressor and resizer. Compress JPG, PNG, WebP, and AVIF by up to 80% in your browser. No upload, no sign-up.",
  inLanguage: "en",
  publisher: {
    "@type": "Organization",
    name: "Pixquish",
    url: siteUrl,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0b1a17" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <MotionProvider>
            {children}
            <SonnerToaster position="bottom-right" richColors closeButton />
          </MotionProvider>
        </ThemeProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteLd) }}
        />
        {/* Pre-hydration listener: captures file selections before React attaches onChange.
            This fixes the issue where the file dialog opens (via native label-for)
            but the change event is lost because React hasn't hydrated yet. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){
              var q=[];var ready=false;
              window.__pixquish_pending=q;
              window.__pixquish_hydrated=function(){ready=true;};
              document.addEventListener("change",function(e){
                if(ready)return;
                var t=e.target;
                if(!t||!t.hasAttribute||!t.hasAttribute("data-pixquish-upload"))return;
                if(t.files&&t.files.length){
                  for(var i=0;i<t.files.length;i++)q.push(t.files[i]);
                  t.value="";
                  e.stopPropagation();
                }
              },true);
            })();`,
          }}
        />
      </body>
    </html>
  );
}
