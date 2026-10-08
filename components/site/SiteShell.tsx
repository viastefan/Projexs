import type { ReactNode } from "react";
import type { Dictionary } from "@/lib/i18n";
import { fontVariables } from "@/lib/fonts";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { MobileBar } from "./MobileBar";
import { InquiryModal } from "@/components/inquiry/InquiryModal";
import { LeadPopup } from "@/components/lead/LeadPopup";
import { ConsentBanner } from "@/components/consent/ConsentBanner";
import { RevealObserver } from "@/components/ui/Reveal";

/** Gemeinsames HTML-Gerüst für die deutschen und englischen Seiten. */
export function SiteShell({ dict, children }: { dict: Dictionary; children: ReactNode }) {
  return (
    <html lang={dict.htmlLang} className={fontVariables}>
      <body className="min-h-dvh bg-paper pb-[calc(4.25rem+env(safe-area-inset-bottom))] text-ink antialiased lg:pb-0">
        <Header dict={dict} />
        <main id="main" tabIndex={-1} className="outline-none">
          {children}
        </main>
        <Footer dict={dict} />
        <MobileBar dict={dict} />
        <InquiryModal dict={dict} />
        <LeadPopup dict={dict} />
        <ConsentBanner dict={dict} />
        <RevealObserver />
      </body>
    </html>
  );
}
