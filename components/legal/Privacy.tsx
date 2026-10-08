import { site } from "@/content/site";

const a = site.address;
const c = site.contact;

/*
 * Datenschutzerklärung – an die neue technische Umsetzung angepasst:
 * Hosting bei Vercel, keine Tracking-Cookies, Consent-Speicherung im localStorage,
 * Google Maps nur nach Einwilligung (Zwei-Klick), lokal eingebundene Schriften,
 * Kontaktformular mit optionalem Versand über Resend.
 * Hinweis: Vor dem Livegang rechtlich prüfen lassen.
 */

export const privacyUpdated = { de: "Oktober 2026", en: "October 2026" };

export function PrivacyDe() {
  return (
    <>
      <h2>1. Verantwortliche</h2>
      <p>Verantwortlich für die Datenverarbeitung auf dieser Website ist:</p>
      <address>
        <strong>ProjeXs – {site.owner.name}</strong>
        <br />
        {a.street}, {a.zip} {a.city}
        <br />
        Telefon: <a href={`tel:${c.phoneHref}`}>{c.phone}</a>
        <br />
        E-Mail: <a href={`mailto:${c.email}`}>{c.email}</a>
      </address>

      <h2>2. Überblick</h2>
      <p>
        Der Schutz Ihrer persönlichen Daten ist mir wichtig. Diese Website verwendet <strong>keine Tracking-Cookies</strong>,
        kein Tracking und keine Analyse- oder Marketingdienste. Personenbezogene Daten werden nur verarbeitet, soweit dies
        für die Bereitstellung der Website technisch erforderlich ist, wenn Sie mir über das Kontaktformular bzw. per E-Mail
        eine Nachricht senden oder wenn Sie der Anzeige externer Inhalte (Google Maps) zustimmen.
      </p>
      <p>Eine automatisierte Entscheidungsfindung einschließlich Profiling (Art. 22 DSGVO) findet nicht statt.</p>

      <h2>3. Hosting und Server-Logfiles</h2>
      <p>
        Diese Website wird bei der Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, USA, gehostet. Beim Aufruf der
        Website werden durch Ihren Browser automatisch Informationen an den Server übermittelt und vorübergehend in
        sogenannten Logfiles gespeichert:
      </p>
      <ul>
        <li>IP-Adresse des anfragenden Endgeräts,</li>
        <li>Datum und Uhrzeit des Zugriffs,</li>
        <li>Name und URL der abgerufenen Datei,</li>
        <li>Website, von der aus der Zugriff erfolgt (Referrer-URL),</li>
        <li>verwendeter Browser und ggf. das Betriebssystem.</li>
      </ul>
      <p>
        Vercel liefert die Website über ein weltweites Content-Delivery-Netzwerk aus; die Logfiles werden nach kurzer Zeit
        automatisch gelöscht. Die Verarbeitung dient der Auslieferung der Website, der Gewährleistung von Systemsicherheit
        und -stabilität sowie der Abwehr von Angriffen. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO; mein berechtigtes Interesse liegt in einer
        sicheren und zuverlässigen Bereitstellung der Website. Mit Vercel besteht ein Vertrag zur Auftragsverarbeitung
        (Art. 28 DSGVO). Vercel ist unter dem EU-US Data Privacy Framework zertifiziert; die Übermittlung in die USA stützt
        sich auf den Angemessenheitsbeschluss der EU-Kommission (Art. 45 DSGVO) sowie ergänzend auf
        EU-Standardvertragsklauseln.
      </p>

      <h2>4. Kontaktformular und E-Mail</h2>
      <p>
        Wenn Sie mir über das Kontaktformular oder per E-Mail eine Anfrage senden, verarbeite ich Ihre Angaben (Vorname,
        Nachname, E-Mail-Adresse sowie freiwillig Mobilnummer, Firma, Anliegen und Ihre Nachricht) ausschließlich zur
        Bearbeitung Ihrer Anfrage und für mögliche Anschlussfragen.
      </p>
      <p>
        Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO, sofern Ihre Anfrage mit der Anbahnung oder Erfüllung eines Vertrags
        zusammenhängt, im Übrigen Ihre Einwilligung (Art. 6 Abs. 1 lit. a DSGVO), die Sie jederzeit mit Wirkung für die
        Zukunft widerrufen können.
      </p>
      <p>
        Für die technische Zustellung der Formularnachrichten per E-Mail kann der Dienst Resend (Resend, Inc., USA) als
        Auftragsverarbeiter eingesetzt werden. Die Übermittlung erfolgt auf Grundlage von EU-Standardvertragsklauseln. Die
        Daten werden gelöscht, sobald Ihre Anfrage abschließend bearbeitet ist und keine gesetzlichen Aufbewahrungspflichten
        entgegenstehen.
      </p>

      <h2>5. Cookies, lokale Speicherung und Einwilligung</h2>
      <p>
        Diese Website setzt keine Tracking-Cookies und verwendet keine Analyse-, Tracking- oder Werbedienste. Ihre Auswahl im
        Datenschutz-Hinweis (ob externe Inhalte geladen werden dürfen) wird ausschließlich lokal in Ihrem Browser gespeichert
        (localStorage, Schlüssel „projexs:consent“) und nicht an mich oder Dritte übermittelt. Diese Speicherung ist technisch
        erforderlich, um Ihre Entscheidung zu respektieren (§ 25 Abs. 2 Nr. 2 TDDDG). Sie können die Auswahl jederzeit über
        den Link „Cookie-Einstellungen“ im Fußbereich der Website ändern oder die Daten in Ihrem Browser löschen.
      </p>

      <h2>6. Google Maps (externer Inhalt, nur nach Einwilligung)</h2>
      <p>
        Auf der Kontaktseite kann eine Karte von Google Maps angezeigt werden. Anbieter ist Google Ireland Limited, Gordon
        House, Barrow Street, Dublin 4, Irland. Die Karte wird <strong>erst geladen, wenn Sie aktiv zustimmen</strong> –
        durch Klick auf „Karte laden“ oder die Auswahl „Alle akzeptieren“ bzw. „Externe Inhalte“ im Datenschutz-Hinweis.
        Beim Laden werden Daten (insbesondere Ihre IP-Adresse) an Google übertragen; Google kann dabei Cookies setzen und
        Daten in die USA übermitteln. Rechtsgrundlage ist Ihre Einwilligung (Art. 6 Abs. 1 lit. a DSGVO, § 25 Abs. 1 TDDDG),
        die Sie jederzeit mit Wirkung für die Zukunft über „Cookie-Einstellungen“ widerrufen können. Google ist unter dem
        EU-US Data Privacy Framework zertifiziert. Weitere Informationen: <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">policies.google.com/privacy</a>.
        Ohne Einwilligung steht Ihnen ein einfacher Link „Route planen“ zur Verfügung, der Google Maps erst beim Anklicken
        in einem neuen Fenster öffnet.
      </p>

      <h2>7. Schriftarten</h2>
      <p>
        Die verwendeten Schriftarten sind lokal auf dem Server eingebunden. Beim Aufruf der Website wird keine Verbindung zu
        Servern Dritter (z. B. Google Fonts) aufgebaut.
      </p>

      <h2>8. Links zu externen Websites</h2>
      <p>
        Diese Website enthält einen einfachen Link zu meinem LinkedIn-Profil. Es handelt sich nicht um ein eingebundenes
        Plugin: Daten werden erst übertragen, wenn Sie den Link anklicken und die Website von LinkedIn aufrufen. Dort gilt die
        Datenschutzerklärung von LinkedIn.
      </p>

      <h2>9. SSL/TLS-Verschlüsselung</h2>
      <p>
        Diese Website nutzt aus Sicherheitsgründen eine SSL/TLS-Verschlüsselung. Eine verschlüsselte Verbindung erkennen Sie
        an „https://“ in der Adresszeile Ihres Browsers.
      </p>

      <h2>10. Speicherdauer</h2>
      <p>
        Personenbezogene Daten werden nur so lange gespeichert, wie es für die genannten Zwecke erforderlich ist oder
        gesetzliche Aufbewahrungsfristen es vorschreiben. Anschließend werden sie gelöscht.
      </p>

      <h2>11. Ihre Rechte</h2>
      <p>Sie haben jederzeit das Recht auf:</p>
      <ul>
        <li>Auskunft über Ihre gespeicherten Daten (Art. 15 DSGVO),</li>
        <li>Berichtigung unrichtiger Daten (Art. 16 DSGVO),</li>
        <li>Löschung (Art. 17 DSGVO),</li>
        <li>Einschränkung der Verarbeitung (Art. 18 DSGVO),</li>
        <li>Datenübertragbarkeit (Art. 20 DSGVO),</li>
        <li>Widerruf einer erteilten Einwilligung mit Wirkung für die Zukunft (Art. 7 Abs. 3 DSGVO).</li>
      </ul>

      <h3>Widerspruchsrecht (Art. 21 DSGVO)</h3>
      <p>
        Sofern Ihre Daten auf Grundlage berechtigter Interessen (Art. 6 Abs. 1 lit. f DSGVO) verarbeitet werden, können Sie
        aus Gründen, die sich aus Ihrer besonderen Situation ergeben, jederzeit Widerspruch gegen die Verarbeitung einlegen.
      </p>

      <h3>Beschwerderecht</h3>
      <p>
        Sie haben das Recht, sich bei einer Datenschutz-Aufsichtsbehörde zu beschweren. Zuständig ist die Landesbeauftragte für
        den Datenschutz Niedersachsen.
      </p>

      <h2>12. Kontakt zum Datenschutz</h2>
      <p>
        Für Fragen zum Datenschutz oder zur Ausübung Ihrer Rechte wenden Sie sich bitte an{" "}
        <a href={`mailto:${c.email}`}>{c.email}</a>.
      </p>

      <h2>13. Änderungen</h2>
      <p>
        Ich passe diese Datenschutzerklärung an, wenn sich die Rechtslage oder die Website ändert. Es gilt die jeweils auf
        dieser Seite veröffentlichte Fassung.
      </p>
    </>
  );
}

export function PrivacyEn() {
  return (
    <>
      <h2>1. Controller</h2>
      <p>The controller responsible for data processing on this website is:</p>
      <address>
        <strong>ProjeXs – {site.owner.name}</strong>
        <br />
        {a.street}, {a.zip} {a.city}, Germany
        <br />
        Phone: <a href={`tel:${c.phoneHref}`}>{c.phone}</a>
        <br />
        Email: <a href={`mailto:${c.email}`}>{c.email}</a>
      </address>

      <h2>2. Overview</h2>
      <p>
        Protecting your personal data matters to me. This website uses <strong>no tracking cookies</strong>, no tracking and
        no analytics or marketing services. Personal data is only processed where technically necessary to provide the
        website, when you send me a message via the contact form or by email, or when you consent to external content
        (Google Maps) being displayed.
      </p>
      <p>There is no automated decision-making, including profiling (Art. 22 GDPR).</p>

      <h2>3. Hosting and server log files</h2>
      <p>
        This website is hosted by Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, USA. When you visit the website,
        your browser automatically transmits information to the server, which is stored temporarily in log files:
      </p>
      <ul>
        <li>IP address of the requesting device,</li>
        <li>date and time of access,</li>
        <li>name and URL of the requested file,</li>
        <li>referring website (referrer URL),</li>
        <li>browser used and, where applicable, the operating system.</li>
      </ul>
      <p>
        Vercel delivers the website via a global content delivery network; log files are deleted automatically after a short
        period. This processing serves to deliver the website, to ensure system security and stability and to fend off
        attacks. The legal basis is Art. 6 (1) (f) GDPR. A data processing agreement (Art. 28 GDPR) is in place with Vercel. Vercel is
        certified under the EU-US Data Privacy Framework; transfers to the USA are based on the European Commission’s adequacy
        decision (Art. 45 GDPR) and, additionally, on EU standard contractual clauses.
      </p>

      <h2>4. Contact form and email</h2>
      <p>
        If you send me an enquiry via the contact form or by email, I process your details (first name, last name, email
        address and, optionally, mobile number, company, topic and your message) solely to handle your enquiry and any
        follow-up questions.
      </p>
      <p>
        The legal basis is Art. 6 (1) (b) GDPR where your enquiry relates to entering into or performing a contract, and
        otherwise your consent (Art. 6 (1) (a) GDPR), which you may withdraw at any time with effect for the future.
      </p>
      <p>
        The email delivery service Resend (Resend, Inc., USA) may be used as a processor to deliver form messages. Transfers
        are based on EU standard contractual clauses. Data is deleted once your enquiry has been fully handled, unless
        statutory retention obligations apply.
      </p>

      <h2>5. Cookies, local storage and consent</h2>
      <p>
        This website sets no tracking cookies and uses no analytics, tracking or advertising services. Your choice in the
        privacy notice (whether external content may be loaded) is stored solely in your browser (localStorage, key
        “projexs:consent”) and is not transmitted to me or to third parties. This storage is technically necessary to respect
        your decision (Section 25 (2) no. 2 TDDDG). You can change your choice at any time via the “Cookie settings” link in
        the website footer or by clearing your browser data.
      </p>

      <h2>6. Google Maps (external content, only with consent)</h2>
      <p>
        The contact page can display a map from Google Maps, provided by Google Ireland Limited, Gordon House, Barrow
        Street, Dublin 4, Ireland. The map is <strong>loaded only after you actively consent</strong> – by clicking “Load
        map” or choosing “Accept all” / “External content” in the privacy notice. When loaded, data (in particular your IP
        address) is transmitted to Google; Google may set cookies and transfer data to the USA. The legal basis is your
        consent (Art. 6 (1) (a) GDPR, Section 25 (1) TDDDG), which you can withdraw at any time with effect for the future via
        “Cookie settings”. Google is certified under the EU-US Data Privacy Framework. Further information:{" "}
        <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">policies.google.com/privacy</a>.
        Without consent, a plain “Get directions” link is available that opens Google Maps in a new window only when clicked.
      </p>

      <h2>7. Fonts</h2>
      <p>
        All fonts are hosted locally. No connection to third-party servers (e.g. Google Fonts) is established when you visit
        the website.
      </p>

      <h2>8. Links to external websites</h2>
      <p>
        This website contains a plain link to my LinkedIn profile. It is not an embedded plugin: data is only transmitted
        when you click the link and visit LinkedIn, where LinkedIn’s privacy policy applies.
      </p>

      <h2>9. SSL/TLS encryption</h2>
      <p>For security reasons this website uses SSL/TLS encryption, recognisable by “https://” in your browser’s address bar.</p>

      <h2>10. Retention</h2>
      <p>
        Personal data is stored only as long as necessary for the purposes stated or as required by statutory retention
        periods, and is deleted thereafter.
      </p>

      <h2>11. Your rights</h2>
      <p>You have the right at any time to:</p>
      <ul>
        <li>access your stored data (Art. 15 GDPR),</li>
        <li>rectification of inaccurate data (Art. 16 GDPR),</li>
        <li>erasure (Art. 17 GDPR),</li>
        <li>restriction of processing (Art. 18 GDPR),</li>
        <li>data portability (Art. 20 GDPR),</li>
        <li>withdraw consent with effect for the future (Art. 7 (3) GDPR).</li>
      </ul>

      <h3>Right to object (Art. 21 GDPR)</h3>
      <p>
        Where your data is processed on the basis of legitimate interests (Art. 6 (1) (f) GDPR), you may object to the
        processing at any time on grounds relating to your particular situation.
      </p>

      <h3>Right to lodge a complaint</h3>
      <p>
        You have the right to lodge a complaint with a data protection supervisory authority. The competent authority is the
        State Commissioner for Data Protection of Lower Saxony (Die Landesbeauftragte für den Datenschutz Niedersachsen).
      </p>

      <h2>12. Contact regarding data protection</h2>
      <p>
        For questions about data protection or to exercise your rights, please contact <a href={`mailto:${c.email}`}>{c.email}</a>.
      </p>

      <h2>13. Changes</h2>
      <p>
        I update this privacy policy when the legal situation or the website changes. The version published on this page
        applies.
      </p>
    </>
  );
}
