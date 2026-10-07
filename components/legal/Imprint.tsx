import { site } from "@/content/site";

const a = site.address;
const c = site.contact;

export function ImprintDe() {
  return (
    <>
      <h2>Angaben gemäß § 5 DDG</h2>
      <address>
        <strong>ProjeXs – {site.owner.name}</strong>
        <br />
        {site.owner.roles.de.join(" · ")}
        <br />
        {a.street}
        <br />
        {a.zip} {a.city}
        <br />
        {a.country}
      </address>

      <h2>Kontakt</h2>
      <p>
        Mobil: <a href={`tel:${c.phoneHref}`}>{c.phone}</a>
        <br />
        E-Mail: <a href={`mailto:${c.email}`}>{c.email}</a>
        <br />
        Web: <a href={site.url}>{site.url.replace(/^https?:\/\//, "")}</a>
      </p>

      {site.legal.vatId && (
        <>
          <h2>Umsatzsteuer-ID</h2>
          <p>Umsatzsteuer-Identifikationsnummer gemäß § 27a Umsatzsteuergesetz: {site.legal.vatId}</p>
        </>
      )}

      <h2>Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</h2>
      <p>
        {site.owner.name}, Anschrift wie oben.
      </p>

      <h2>Haftung für Inhalte</h2>
      <p>
        Die Inhalte dieser Website wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität
        der Inhalte kann jedoch keine Gewähr übernommen werden. Als Diensteanbieterin bin ich gemäß § 7 Abs. 1 DDG für eigene
        Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich.
      </p>

      <h2>Haftung für Links</h2>
      <p>
        Diese Website enthält Links zu externen Websites Dritter, auf deren Inhalte ich keinen Einfluss habe. Für die Inhalte
        der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber verantwortlich. Bei Bekanntwerden von
        Rechtsverletzungen werden derartige Links umgehend entfernt.
      </p>

      <h2>Urheberrecht</h2>
      <p>
        Die Inhalte und Werke auf dieser Website – insbesondere Texte und Fotografien – unterliegen dem deutschen
        Urheberrecht. Vervielfältigung, Bearbeitung und Verbreitung außerhalb der Grenzen des Urheberrechts bedürfen der
        vorherigen schriftlichen Zustimmung.
      </p>
    </>
  );
}

export function ImprintEn() {
  return (
    <>
      <h2>Information pursuant to Section 5 DDG (German Digital Services Act)</h2>
      <address>
        <strong>ProjeXs – {site.owner.name}</strong>
        <br />
        {site.owner.roles.en.join(" · ")}
        <br />
        {a.street}
        <br />
        {a.zip} {a.city}
        <br />
        Germany
      </address>

      <h2>Contact</h2>
      <p>
        Mobile: <a href={`tel:${c.phoneHref}`}>{c.phone}</a>
        <br />
        Email: <a href={`mailto:${c.email}`}>{c.email}</a>
        <br />
        Web: <a href={site.url}>{site.url.replace(/^https?:\/\//, "")}</a>
      </p>

      {site.legal.vatId && (
        <>
          <h2>VAT ID</h2>
          <p>VAT identification number pursuant to Section 27a of the German VAT Act: {site.legal.vatId}</p>
        </>
      )}

      <h2>Responsible for content pursuant to Section 18 (2) MStV</h2>
      <p>{site.owner.name}, address as above.</p>

      <h2>Liability for content</h2>
      <p>
        The content of this website has been created with the utmost care. However, no guarantee can be given for its
        accuracy, completeness or timeliness. As a service provider I am responsible for my own content on these pages in
        accordance with general law (Section 7 (1) DDG).
      </p>

      <h2>Liability for links</h2>
      <p>
        This website contains links to external third-party websites over whose content I have no influence. The respective
        provider or operator is always responsible for the content of linked pages. Should I become aware of any legal
        infringements, such links will be removed immediately.
      </p>

      <h2>Copyright</h2>
      <p>
        The content and works on this website – in particular texts and photographs – are subject to German copyright law.
        Reproduction, editing and distribution beyond the limits of copyright law require prior written consent.
      </p>
    </>
  );
}
