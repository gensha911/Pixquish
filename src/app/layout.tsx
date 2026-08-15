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
    "compress png without losing quality",
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
    "convert image to webp",
    "convert image to avif",
    "best image format for web",
    "png vs webp",
    "webp vs png",
    "reduce image size for email",
    "instagram post size",
    "instagram story size",
    "youtube thumbnail size",
    "resize image for instagram",
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
    {
      "@type": "Question",
      name: "How do I compress a PNG without losing quality?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Upload your PNG and choose Best Quality mode. Pixquish keeps the PNG lossless when the output format is PNG (PNG uses lossless compression, so quality is never reduced). For even smaller files, switch the output format to WebP or AVIF — both support lossless modes that can shrink PNGs by 30–50% with zero quality loss.",
      },
    },
    {
      "@type": "Question",
      name: "How do I compress a JPG to 100KB?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Upload your JPG, then use the target file size feature. Pick the 100 KB preset (or type a custom value) and Pixquish runs a binary search over JPEG quality levels to produce a file as close to 100 KB as possible while keeping the best achievable visual quality.",
      },
    },
    {
      "@type": "Question",
      name: "What is the best image format for the web?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "WebP and AVIF are the best modern formats for the web — they produce files 25–50% smaller than JPEG and PNG at the same visual quality. Pixquish can convert your JPG or PNG to WebP or AVIF automatically. For logos and graphics with few colors, PNG stays lossless and crisp. For photos, WebP or AVIF is recommended.",
      },
    },
    {
      "@type": "Question",
      name: "What is the Instagram post size?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Instagram square posts are 1080×1080 pixels, landscape posts are 1080×566 pixels, and portrait posts are 1080×1350 pixels. Instagram Stories and Reels use 1080×1920 pixels. Pixquish includes all these as one-click presets in the Resize tab.",
      },
    },
    {
      "@type": "Question",
      name: "What is the YouTube thumbnail size?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "YouTube thumbnails are 1280×720 pixels (16:9 aspect ratio). Pixquish includes a YouTube Thumbnail preset in the Resize tab — upload your image, pick the preset, and download a perfectly sized thumbnail.",
      },
    },
    {
      "@type": "Question",
      name: "How do I reduce image file size for email?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Upload your image and use the target file size feature set to 200 KB or less — most email providers limit attachments to 25 MB but recommend keeping images under 1 MB. For photos, switching the output to JPEG with Balanced mode gives the smallest files with good quality.",
      },
    },
    {
      "@type": "Question",
      name: "PNG vs WebP — which is smaller?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "WebP is almost always smaller than PNG — typically 25–35% smaller for the same lossless image, and much smaller for photos (where PNG has no lossy mode). Pixquish can convert PNG to WebP with a single click in the output format selector of either the Compress or Resize tab.",
      },
    },
    {
      "@type": "Question",
      name: "How many images can I compress or resize at once?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Pixquish has no hard limit — you can batch process as many images as your browser can hold in memory. In practice, 50–200 images per batch works smoothly on most devices. Use the checkboxes to process a subset, or Resize/Compress All to handle every uploaded file at once.",
      },
    },
    {
      "@type": "Question",
      name: "Is it safe to use an online image compressor?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Pixquish is the safest kind of online compressor: it runs entirely in your browser using the Canvas API. Your images are never uploaded to a server, never stored, and never seen by anyone. There is no sign-up, no tracking of your files, and no server-side processing — everything happens on your device.",
      },
    },
    {
      "@type": "Question",
      name: "Can I convert images to WebP or AVIF?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. In either the Compress or Resize tab, change the output format selector to WebP or AVIF. Pixquish will convert your JPG, PNG, WebP, or AVIF input to the chosen format. AVIF typically produces the smallest files, followed by WebP, then JPEG.",
      },
    },
    {
      "@type": "Question",
      name: "How do I resize an image for Instagram?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Switch to the Resize tab, upload your image, then pick an Instagram preset: Square Post (1080×1080), Story/Reel (1080×1920), or Landscape (1080×566). Use the Cover fit mode to fill the canvas and crop excess, or Contain to fit the whole image with padding.",
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
  sameAs: [
    "https://github.com/gensha911",
    "https://www.instagram.com/pixquish/",
  ],
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

// HowTo schema — targets "how to compress images" searches. Eligible for
// step-by-step rich results in Google Search. Mirrors the visible guide.
const howToCompressLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to Compress Images Online Without Losing Quality",
  description:
    "Compress JPG, PNG, WebP, and AVIF images by up to 80% in your browser. No uploads, no sign-up, and your images stay private.",
  totalTime: "PT2M",
  estimatedCost: { "@type": "MonetaryAmount", currency: "USD", value: "0" },
  supply: [{ "@type": "HowToSupply", name: "JPG, PNG, WebP, or AVIF image files" }],
  tool: [{ "@type": "HowToTool", name: "A modern web browser (Chrome, Firefox, Safari, Edge)" }],
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Upload your images",
      text: "Drag and drop images onto the upload area, or click to browse your files. Pixquish accepts JPEG, PNG, WebP, and AVIF. You can upload multiple images at once for batch compression.",
      url: `${siteUrl}/#guide`,
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Choose a compression mode",
      text: "Pick Best Quality for minimal loss, Balanced for a smart trade-off, or Max Compress for the smallest possible files. Your choice is remembered across sessions.",
      url: `${siteUrl}/#guide`,
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Optionally set a target file size",
      text: "Need a file under a specific size? Click a preset (20 KB, 50 KB, 100 KB, 200 KB, 500 KB, 1 MB) or type a custom value. Pixquish uses a binary search across quality levels to hit your target.",
      url: `${siteUrl}/#guide`,
    },
    {
      "@type": "HowToStep",
      position: 4,
      name: "Click Compress",
      text: "Hit the Compress button. Use Compress All for every image, Compress N Selected for checked files, or the per-row button for one image. Everything runs locally in your browser.",
      url: `${siteUrl}/#guide`,
    },
    {
      "@type": "HowToStep",
      position: 5,
      name: "Compare before and after",
      text: "Each image shows an interactive comparison slider. Drag it to see the difference between original and compressed, scroll to zoom, and drag to pan.",
      url: `${siteUrl}/#guide`,
    },
    {
      "@type": "HowToStep",
      position: 6,
      name: "Download your compressed images",
      text: "Download individual images or use Download All to grab every processed file. Compressed files are named with a -pixquish suffix so originals are never overwritten.",
      url: `${siteUrl}/#guide`,
    },
  ],
};

// HowTo schema — targets "how to resize images" searches.
const howToResizeLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to Resize Images to Exact Dimensions Online",
  description:
    "Resize JPG, PNG, WebP, and AVIF images to any width and height in pixels, or pick from 20+ social media presets. Cover, Contain, and Stretch fit modes with aspect ratio lock.",
  totalTime: "PT1M",
  estimatedCost: { "@type": "MonetaryAmount", currency: "USD", value: "0" },
  supply: [{ "@type": "HowToSupply", name: "JPG, PNG, WebP, or AVIF image files" }],
  tool: [{ "@type": "HowToTool", name: "A modern web browser (Chrome, Firefox, Safari, Edge)" }],
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Switch to the Resize tab",
      text: "Click the Resize tab above the workspace to open the image resizer. Upload your images by dragging them in or clicking the upload area.",
      url: `${siteUrl}/#guide`,
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Set dimensions or pick a preset",
      text: "Enter exact width and height in pixels, or choose from 20+ presets for Instagram (1080x1080, 1080x1920), X/Twitter, Facebook, YouTube thumbnails, LinkedIn, Pinterest, HD 1080p, 4K UHD, and more.",
      url: `${siteUrl}/#guide`,
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Lock aspect ratio and choose a fit mode",
      text: "Toggle the aspect ratio lock to preserve proportions. Pick Cover (fill and crop excess), Contain (fit inside with padding color), or Stretch (exact dimensions, with a distortion warning if the ratio differs).",
      url: `${siteUrl}/#guide`,
    },
    {
      "@type": "HowToStep",
      position: 4,
      name: "Click Resize",
      text: "Hit Resize Selected or Resize All. Pixquish uses multi-step downscaling for sharp results, especially when shrinking images significantly.",
      url: `${siteUrl}/#guide`,
    },
    {
      "@type": "HowToStep",
      position: 5,
      name: "Download resized images",
      text: "Download individual images or use Download All. Files are named with the dimensions, e.g. originalname-1080x1080.jpg, so you always know the output size.",
      url: `${siteUrl}/#guide`,
    },
  ],
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(howToCompressLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(howToResizeLd) }}
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
