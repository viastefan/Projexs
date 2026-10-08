import type { Dictionary } from "@/lib/i18n";
import { buildJsonLd, JsonLdScript } from "@/lib/jsonld";
import { Hero } from "@/components/sections/Hero";
import { Stats } from "@/components/sections/Stats";
import { Services } from "@/components/sections/Services";
import { Why } from "@/components/sections/Why";
import { Process } from "@/components/sections/Process";
import { Expertise } from "@/components/sections/Expertise";
import { Projects } from "@/components/sections/Projects";
import { GoLive } from "@/components/sections/GoLive";
import { About } from "@/components/sections/About";
import { Faq } from "@/components/sections/Faq";
import { Contact } from "@/components/sections/Contact";

export function HomePage({ dict }: { dict: Dictionary }) {
  return (
    <>
      <JsonLdScript data={buildJsonLd(dict, "home")} />
      <Hero dict={dict} />
      <Stats dict={dict} />
      <Services dict={dict} />
      <Why dict={dict} />
      <Expertise dict={dict} />
      <Projects dict={dict} />
      <Process dict={dict} />
      <GoLive dict={dict} />
      <About dict={dict} />
      <Faq dict={dict} />
      <Contact dict={dict} />
    </>
  );
}
