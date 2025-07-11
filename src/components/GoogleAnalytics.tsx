'use client';

import Script from 'next/script';

export default function GoogleAnalytics() {
  const gtagId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  if (!gtagId) {
    return null;
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gtagId}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gtagId}');
        `}
      </Script>
    </>
  );
}
