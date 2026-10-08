import type { Dictionary } from "@/lib/i18n";
import { site } from "@/content/site";
import { Phone } from "@/components/ui/Icons";
import { InquiryTrigger } from "@/components/inquiry/InquiryTrigger";

/** Feste Aktionsleiste am unteren Rand auf Mobilgeräten. */
export function MobileBar({ dict }: { dict: Dictionary }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 gap-2 border-t border-line bg-white/95 p-2 backdrop-blur lg:hidden">
      <a
        href={`tel:${site.contact.phoneHref}`}
        className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-navy text-[0.95rem] font-semibold text-navy"
      >
        <Phone className="size-4" />
        {dict.mobileBar.call}
      </a>
      <InquiryTrigger href={dict.routes.contact} className="h-11 text-[0.95rem]">
        {dict.mobileBar.inquire}
      </InquiryTrigger>
    </div>
  );
}
