import type { Dictionary } from "@/lib/i18n";
import { site } from "@/content/site";
import { Phone } from "@/components/ui/Icons";
import { InquiryTrigger } from "@/components/inquiry/InquiryTrigger";

/** Feste Aktionsleiste am unteren Rand auf Mobilgeräten. */
export function MobileBar({ dict }: { dict: Dictionary }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 gap-2 border-t border-line bg-white/95 p-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] shadow-[0_-10px_30px_-18px_rgba(8,32,120,0.35)] backdrop-blur lg:hidden">
      <a
        href={`tel:${site.contact.phoneHref}`}
        className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-navy text-[0.95rem] font-semibold text-navy"
      >
        <Phone className="size-4" />
        {dict.mobileBar.call}
      </a>
      <InquiryTrigger href={dict.routes.contact} source="dialog" className="h-12 text-[0.95rem]">
        {dict.mobileBar.inquire}
      </InquiryTrigger>
    </div>
  );
}
