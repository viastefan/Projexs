/**
 * Alle deutschen Texte der Website.
 * Grundlage sind die Inhalte der bisherigen Website projexs.de –
 * redaktionell überarbeitet und neu strukturiert.
 * Die Struktur muss mit content/en.ts übereinstimmen (prüft TypeScript).
 */
export const de = {
  locale: "de",
  htmlLang: "de-DE",
  ogLocale: "de_DE",

  routes: {
    home: "/",
    imprint: "/impressum",
    privacy: "/datenschutz",
    terms: "/agb",
    contact: "/kontakt",
  },

  ids: {
    services: "leistungen",
    expertise: "expertise",
    projects: "projekte",
    golive: "go-live",
    about: "ueber-mich",
    faq: "faq",
    contact: "kontakt",
  },

  meta: {
    title: "ProjeXs – Expertin für SAP-Projektmanagement & Implementierung | Daniela Franzen",
    description:
      "Daniela Franzen führt komplexe SAP-Projekte sicher ins Go-live: S/4HANA-Transformationen, globale Template-Rollouts, Programm- und Interim-Management. Über 23 Jahre Erfahrung, PMP®-zertifiziert.",
    keywords: [
      "SAP Projektmanagement",
      "SAP Projektleitung",
      "SAP Programmmanagement",
      "S/4HANA Transformation",
      "S/4HANA Implementierung",
      "SAP Template Rollout",
      "SAP Interim Management",
      "IT-Krisenmanagement",
      "Daniela Franzen",
      "ProjeXs",
    ],
    ogTitle: "Komplexe SAP-Projekte. Sicher ins Go-live.",
    ogSubtitle: "Projektleitung · Programmmanagement · Interim Management",
  },

  nav: {
    skip: "Zum Inhalt springen",
    items: [
      { label: "Leistungen", id: "leistungen" },
      { label: "Expertise", id: "expertise" },
      { label: "Projekte", id: "projekte" },
      { label: "Über mich", id: "ueber-mich" },
      { label: "FAQ", id: "faq" },
    ],
    contactLabel: "Kontakt",
    cta: "Projekt anfragen",
    menuOpen: "Menü öffnen",
    menuClose: "Menü schließen",
    menuTitle: "Navigation",
    switchLabel: "EN",
    switchAria: "EN – auf Englisch wechseln",
    homeAria: "ProjeXs – zur Startseite",
  },

  hero: {
    eyebrow: "SAP-Projektmanagement · S/4HANA · Interim",
    titleLead: "Komplexe SAP-Projekte.",
    titleAccent: "Sicher",
    titleTail: "ins Go-live.",
    lead:
      "Ich bin Daniela Franzen – SAP-Programm- und Projektmanagerin mit über 23 Jahren Erfahrung. Ich führe S/4HANA-Transformationen, globale Template-Rollouts und Upgrades zum Ziel – mit Budgettreue und Teams, die das Ergebnis tragen.",
    primary: "Projekt anfragen",
    secondary: "Projekte ansehen",
    credentialsLabel: "Zertifizierungen",
    credentials: ["PMP®", "PSM I", "SAP-zertifiziert"],
    trustLabel: "Projekterfahrung u. a. bei",
    trust: ["HELM AG", "Panasonic", "IBM"],
    photoAlt: "Daniela Franzen, SAP-Programm- und Projektmanagerin, Porträt im dunklen Blazer",
    callLabel: "Oder direkt anrufen",
    location: "Buchholz i. d. Nordheide · Hamburg · remote",
    card: {
      label: "Zuletzt verantwortet",
      title: "Globale S/4HANA-Einführung",
      client: "HELM AG · 2020 – 2024",
      result: "Go-live in 13 Niederlassungen in Europa und Asien – termingerecht und im Budget.",
    },
  },

  process: {
    eyebrow: "Zusammenarbeit",
    title: "So kommen wir ins Projekt.",
    intro: "Drei Schritte von der ersten Anfrage bis zum Start – klar, schnell und ohne Umwege.",
    steps: [
      {
        title: "Erstgespräch",
        text: "Wir besprechen Ausgangslage, Ziele und Zeitrahmen Ihres Vorhabens – telefonisch oder per Video.",
      },
      {
        title: "Einschätzung & Angebot",
        text: "Sie erhalten meine ehrliche Einschätzung, welche Rolle und welchen Einsatz Ihr Projekt braucht – mit einem klaren Angebot.",
      },
      {
        title: "Start & Umsetzung",
        text: "Schnelle Einarbeitung, klare Struktur und regelmäßiges Reporting – bis zum Go-live und zur geordneten Übergabe.",
      },
    ],
    cta: "Erstgespräch anfragen",
  },

  why: {
    eyebrow: "Warum ProjeXs",
    title: "Erfahrung, die Projekte sicher ins Ziel bringt.",
    intro:
      "Was Sie bekommen, wenn Sie mit mir arbeiten: belegbare Erfahrung statt Versprechen – und eine Projektleitung, die Verantwortung übernimmt.",
    points: [
      {
        title: "23+ Jahre SAP, 15+ Jahre Führung",
        text: "Von der SD-Beratung bei IBM über 16 Jahre Projekt- und Portfoliomanagement bei Panasonic bis zur Programmleitung einer globalen S/4HANA-Einführung.",
      },
      {
        title: "Termingerecht und im Budget",
        text: "13 Go-lives in Europa und Asien innerhalb des geplanten 3-Jahres-Zeitrahmens – und alle SAP-Rollouts 2005–2016 bei Panasonic im Plan.",
      },
      {
        title: "Inhouse-Denken, externe Perspektive",
        text: "Ich kenne beide Seiten – als externe Beraterin und aus Inhouse-Positionen. So entstehen Lösungen mit hoher Akzeptanz im Unternehmen.",
      },
      {
        title: "Zertifiziert und methodensicher",
        text: "PMP®, Professional Scrum Master (PSM I) und SAP-zertifiziert – klassisch, agil oder hybrid, je nachdem, was Ihr Projekt braucht.",
      },
    ],
    cta: "Erstgespräch vereinbaren",
    ctaHint: "Unverbindlich · persönliche Rückmeldung",
  },

  lead: {
    title: "Steht ein SAP-Projekt an?",
    text: "Lassen Sie uns kurz sprechen: Ausgangslage, Ziele, Zeitrahmen. Ich melde mich persönlich – ohne Verkaufsgespräch.",
    primary: "Projekt anfragen",
    call: "Direkt anrufen",
    close: "Hinweis schließen",
  },

  consent: {
    title: "Datenschutz-Einstellungen",
    text: "Diese Website setzt keine Tracking-Cookies. Externe Inhalte (Google Maps auf der Kontaktseite) werden erst nach Ihrer Zustimmung geladen. Ihre Auswahl wird lokal in Ihrem Browser gespeichert.",
    necessary: "Technisch notwendig",
    necessaryText: "Für den Betrieb der Website erforderlich, z. B. das Speichern Ihrer Datenschutz-Auswahl. Immer aktiv.",
    external: "Externe Inhalte (Google Maps)",
    externalText: "Lädt die Karte auf der Kontaktseite von Google. Dabei werden Daten (z. B. Ihre IP-Adresse) an Google übertragen.",
    acceptAll: "Alle akzeptieren",
    necessaryOnly: "Nur notwendige",
    settings: "Einstellungen",
    save: "Auswahl speichern",
    privacyLink: "Datenschutzerklärung",
    reopen: "Cookie-Einstellungen",
  },

  inquiry: {
    title: "Projekt anfragen",
    subtitle: "In zwei Minuten zur Anfrage. Ich melde mich persönlich bei Ihnen.",
    stepLabel: "Schritt",
    of: "von",
    next: "Weiter",
    back: "Zurück",
    submit: "Anfrage senden",
    close: "Schließen",
    enterHint: "Enter ↵ für Weiter",
    optionalHint: "Sie können diesen Schritt auch überspringen.",
    steps: {
      topic: { q: "Worum geht es bei Ihrem Vorhaben?", hint: "Wählen Sie, was am besten passt." },
      timeframe: {
        q: "Wann soll es losgehen?",
        label: "Zeitrahmen",
        options: ["So schnell wie möglich", "In den nächsten 1–3 Monaten", "Später im Jahr", "Noch offen"],
      },
      person: { q: "Mit wem spreche ich?", hint: "Name und Unternehmen." },
      contact: { q: "Wie erreiche ich Sie am besten?", hint: "Eine E-Mail-Adresse genügt – die Mobilnummer ist optional." },
      message: { q: "Was sollte ich vorab wissen?", hint: "Ausgangslage, Rahmen und Ziele – in wenigen Sätzen." },
      consent: { q: "Fast geschafft.", hint: "Bitte bestätigen Sie die Datenverarbeitung, dann geht die Anfrage an mich." },
    },
    pageLink: "Lieber in Ruhe auf der Kontaktseite?",
  },

  contactPage: {
    metaTitle: "Kontakt | ProjeXs – Daniela Franzen",
    metaDescription:
      "Nehmen Sie Kontakt zu Daniela Franzen auf: SAP-Projektleitung, Programmmanagement und Interim Management. Anfrage in wenigen Schritten oder direkt per Telefon und E-Mail.",
    eyebrow: "Kontakt",
    title: "Erzählen Sie mir von Ihrem Vorhaben.",
    intro:
      "Beschreiben Sie Ihr SAP-Projekt in wenigen Schritten – oder rufen Sie mich direkt an. Ich melde mich persönlich bei Ihnen.",
    formTitle: "Ihre Anfrage",
    tabStepper: "Schritt für Schritt",
    tabClassic: "Klassisches Formular",
    directTitle: "Direkter Kontakt",
    availabilityTitle: "Erreichbarkeit",
    availabilityText: "Werktags telefonisch und per E-Mail erreichbar. Ich melde mich persönlich und zeitnah bei Ihnen – auf Wunsch auch per Video-Call.",
    mapTitle: "Standort",
    mapLoad: "Karte laden (Google Maps)",
    mapHint: "Beim Laden der Karte werden Daten an Google übertragen. Details:",
    mapRoute: "Route planen",
    mapIframeTitle: "Google Maps: Standort von ProjeXs in Buchholz in der Nordheide",
    backHome: "Zur Startseite",
  },

  mobileBar: {
    call: "Anrufen",
    inquire: "Projekt anfragen",
  },

  stats: [
    { value: 23, suffix: "+", label: "Jahre Erfahrung in SAP-Projekten" },
    { value: 15, suffix: "+", label: "Jahre in Führungspositionen" },
    { value: 13, suffix: "", label: "Go-lives in Europa & Asien in einem S/4HANA-Programm" },
    { value: 90, suffix: "", label: "interne & externe Projektmitglieder geführt" },
  ],

  services: {
    eyebrow: "Leistungen",
    title: "Womit kann ich Sie unterstützen?",
    intro:
      "Ob als Projektleitung, im Programmmanagement oder als Interim Managerin: Ich übernehme Verantwortung dort, wo SAP-Vorhaben Erfahrung, Tempo und eine klare Linie brauchen.",
    roles: [
      {
        title: "Projektleitung",
        text: "SAP-Implementierungen, S/4HANA-Transformationen und Template-Rollouts – geführt mit strategischem Denken und klarem Fokus auf die Projektziele. Jede Phase effizient und zielgerichtet.",
        points: ["S/4HANA-Implementierung", "Template-Rollouts", "SAP-Upgrades"],
      },
      {
        title: "Programmmanagement",
        text: "Ich steuere Abhängigkeiten und das Zusammenspiel aller Beteiligten – mit Stakeholder-Integration, Budgettreue und gezieltem Change-Management für nachhaltige Ergebnisse.",
        points: ["Roadmap & Budget", "Governance & Reporting", "Change-Management"],
      },
      {
        title: "Interim Management",
        text: "Wenn Führung fehlt oder ein Vorhaben sofort starten muss, übernehme ich kurzfristig Verantwortung – und übergebe geordnet, sobald Ihre Organisation so weit ist.",
        points: ["Schneller Einstieg", "Stabilisierung", "Geordnete Übergabe"],
      },
    ],
    situationsTitle: "Typische Situationen, in denen ich unterstütze",
    situations: [
      {
        title: "Dringende Projektumsetzung",
        text: "Ein Projekt muss kurzfristig umgesetzt werden, doch interne Ressourcen fehlen? Dank schneller Einarbeitung und pragmatischer Herangehensweise treibe ich die Implementierung schnell und effizient voran.",
      },
      {
        title: "IT-Krisenmanagement",
        text: "Gerät ein IT-Projekt in Schwierigkeiten, analysiere ich die Lage, identifiziere Probleme rasch und ergreife die Maßnahmen, die das Projekt stabilisieren und zum Erfolg führen.",
      },
      {
        title: "Organisationsveränderungen",
        text: "Integration einer neuen Einheit oder Carve-out: Ich passe IT-Landschaft und Organisationsstrukturen reibungslos an – in bestehende Strukturen oder als eigenständige Einheit.",
      },
      {
        title: "Überbrückung von Führungspositionen",
        text: "Ist eine neue Führungskraft nicht rechtzeitig verfügbar, bin ich Ansprechpartnerin für Ihre Stakeholder, stabilisiere das Team, unterstütze bei der Rekrutierung und sorge für eine nahtlose Übergabe.",
      },
    ],
  },

  expertise: {
    eyebrow: "Expertise",
    title: "Interne Denkweise. Externe Perspektive.",
    intro:
      "Als SAP-Projekt- und Programmmanagerin verbinde ich beides: die Distanz und die Impulse einer Außenstehenden – und das tiefe Verständnis für interne Dynamiken, Entscheidungswege und Herausforderungen.",
    pillars: [
      {
        title: "Inhouse- & Führungserfahrung",
        text: "Über 23 Jahre SAP-Projekte, mehr als 15 Jahre in Führungspositionen. Ich kenne die typischen Stolpersteine – und weiß, welche Schritte nötig sind, damit ein Programm erfolgreich live geht.",
      },
      {
        title: "SAP-Roadmaps & Strategie",
        text: "Planung und Umsetzung von SAP-Roadmaps sowie die strategische Weiterentwicklung von SAP-Organisationen – für bessere Geschäftsprozesse und mehr Effizienz.",
      },
      {
        title: "Interne & externe Teams",
        text: "Ich kenne beide Seiten – als externe Beraterin und aus Inhouse-Positionen. So setze ich Projekte mit hoher Akzeptanz um, in Zeit und Budget.",
      },
      {
        title: "Stakeholder-Management",
        text: "Alle relevanten Stakeholder eingebunden, Erwartungen berücksichtigt – mit enger Zusammenarbeit im Team und regelmäßigem Reporting an das Senior Management (C-Level).",
      },
      {
        title: "Teamdynamik",
        text: "Ich schaffe ein Umfeld, das die Stärken interner und externer Teams verbindet – damit Projekte nicht nur technisch gelingen, sondern von allen getragen werden.",
      },
      {
        title: "Methodenkompetenz",
        text: "Von Strategie und Budgetkalkulation bis zum Management komplexer Rollouts – als zertifizierte PMP® und Professional Scrum Master klassisch, agil oder hybrid.",
      },
    ],
    highlightsTitle: "Besondere Erfolge & Highlights",
    highlights: [
      {
        title: "Leitung globaler SAP-Rollouts",
        text: "Globale und regionale Rollouts (S/4HANA und ECC 6.0) mit umfassender Budgetverantwortung.",
      },
      {
        title: "Aufbau von Rollout-Organisationen",
        text: "Aufbau und Führung interner und externer Rollout-Organisationen in Europa und Asien.",
      },
      {
        title: "Integration von Geschäftsprozessen",
        text: "Geschäftsprozesse und IT-Strukturen erfolgreich über globale Template-Rollouts integriert.",
      },
      {
        title: "Kommunikation & Strategie",
        text: "Kommunikationspläne, die Projektziele vermitteln und Initiativen an langfristigen Unternehmenszielen ausrichten.",
      },
    ],
    modulesTitle: "SAP-Module & Integration",
    modules: [
      { code: "S/4", name: "S/4HANA" },
      { code: "SD", name: "Vertrieb" },
      { code: "MM", name: "Materialwirtschaft" },
      { code: "PP", name: "Produktionsplanung" },
      { code: "TM", name: "Transportmanagement" },
      { code: "QM", name: "Qualitätsmanagement" },
      { code: "PS", name: "Projektsystem" },
      { code: "FI", name: "Finanzwesen" },
      { code: "CO", name: "Controlling" },
      { code: "APO", name: "Advanced Planning" },
      { code: "WMS", name: "Lagerverwaltung" },
      { code: "CS", name: "Kundenservice" },
      { code: "REA", name: "Recycling (WEEE)" },
      { code: "BW", name: "Business Warehouse" },
      { code: "B2B", name: "Partner-Integration" },
      { code: "EDI", name: "Datenaustausch" },
    ],
  },

  projects: {
    eyebrow: "Projekte",
    title: "Projekte & Verantwortlichkeiten.",
    intro:
      "Ein Einblick in bedeutende Programme und Projekte, die ich als SAP-Programm- und Projektmanagerin verantwortet habe.",
    note: "Gerne sende ich Ihnen auf Anfrage eine vollständige Übersicht meiner Projekte und Erfolge zu.",
    cta: "Vollständige Projektübersicht anfragen",
    labels: {
      period: "Zeitraum",
      industry: "Branche",
      release: "Release",
      modules: "Module",
      team: "Projektgröße",
      result: "Ergebnis",
      more: "Weitere Projekte",
      showMore: "Alle Details anzeigen",
      showLess: "Weniger anzeigen",
    },
    clients: [
      {
        client: "HELM AG",
        period: "04/2020 – 05/2024",
        industry: "Chemie, Pharma & Crop Solutions",
        headline: "Globale S/4HANA-Implementierung & Template-Rollout",
        release: "S/4HANA 1809 & 2022",
        modules: ["SD", "MM", "PP", "TM", "QM", "PS&S", "FI", "CO"],
        team: "90 interne & externe Mitarbeitende",
        kpis: [
          { value: "8 + 5", label: "Go-lives in Europa & Asien" },
          { value: "3 Jahre", label: "geplanter Zeitrahmen eingehalten" },
          { value: "90", label: "Projektmitglieder" },
        ],
        engagements: [
          {
            role: "Programm-Managerin S/4HANA-Implementierung Europa & Asien",
            period: "04/2021 – 05/2024",
            points: [
              "Entwicklung und Umsetzung einer detaillierten globalen Rollout-Roadmap für Europa, Asien und Amerika",
              "Gesamtleitung des globalen Template-Rollouts und Steuerung aller Projektphasen",
              "Aufbau einer effizienten SAP-Rollout- und Support-Organisation",
              "Integration einer internen Reorganisation in den S/4HANA-Rollout-Prozess",
              "Stakeholder-Management und Reporting auf C-Level",
              "Gesamtbudgetverantwortung inkl. Kalkulation, Controlling und Reporting",
            ],
            result:
              "Erfolgreicher Go-live in 8 europäischen und 5 asiatischen Niederlassungen innerhalb des geplanten 3-Jahres-Zeitrahmens – termingerecht und im Budget.",
          },
          {
            role: "Programm-Managerin SAP-Upgrade",
            period: "06/2023 – 01/2024",
            points: [
              "Durchführung des Upgrades von S/4HANA 1809 auf 2022",
              "Planung und Integration des Upgrades in den Asien-Rollout",
            ],
            result:
              "Upgrade auf S/4HANA 2022 ohne Betriebsunterbrechungen – nahtlos in den Asien-Rollout integriert.",
          },
          {
            role: "SAP-Supportorganisation",
            period: "05/2020 – 10/2020",
            points: [
              "Strategische Gestaltung und Aufbau der internen und externen SAP-Supportstruktur",
              "Vorbereitung des RFP und Anbieterauswahl",
            ],
            result: "Aufbau einer effektiven internen und externen SAP-Supportstruktur.",
          },
        ],
        more: [] as string[],
      },
      {
        client: "Panasonic",
        period: "12/2003 – 03/2020",
        industry: "Konsumgüter & Handel",
        headline: "SAP ECC-Rollouts & S/4HANA-Transformation",
        release: "ECC 6.0 → S/4HANA",
        modules: ["SD", "APO", "MM", "WMS", "CS", "FI", "REA", "BW", "B2B", "B2X", "EDI"],
        team: "Bis zu 70 interne & externe Mitarbeitende",
        kpis: [
          { value: "16 Jahre", label: "SAP-Projekt- & Portfoliomanagement" },
          { value: "70", label: "Projektmitglieder in der Spitze" },
          { value: "Alle", label: "SAP-Rollouts 2005–2016 termingerecht & im Budget" },
        ],
        engagements: [
          {
            role: "Integration Manager S/4HANA-Transformation",
            period: "04/2017 – 03/2020",
            points: [
              "Anforderungskatalog, Ausschreibungsprozess und Lieferantenauswahl",
              "Konzeption projektübergreifender Themen: Testmanagement, Berechtigungskonzept, Business Process Automation, Batch Management",
              "Strategische Planung der Greenfield-Implementierung in Europa",
              "Schulung von Teams an zwei Standorten",
            ],
            result:
              "Projektkostenkalkulation erfolgreich abgeschlossen und konzerninternen Genehmigungsprozess gestartet.",
          },
          {
            role: "Projektmanagerin BW on HANA",
            period: "10/2017 – 09/2018",
            points: [
              "Leitung der Migration der zentralen SAP BW-Systeme von DB2 auf BW on HANA",
              "Steuerung des internen und externen Offshore-Teams",
            ],
            result: "",
          },
          {
            role: "Projektmanagerin Agile Projektmethodik",
            period: "04/2017 – 08/2018",
            points: ["Entwicklung und Implementierung einer internen hybrid-agilen Projektmethodik auf Basis von Scrum"],
            result: "",
          },
          {
            role: "Projektstudie ERP-Landschaft",
            period: "11/2014 – 12/2016",
            points: ["Analyse der bestehenden ERP-Landschaft (ECC 6.0) und Bewertung einer S/4HANA-Transformation"],
            result:
              "Business Case und strategische Roadmap – Grundlage für den späteren S/4HANA-Implementierungsplan.",
          },
          {
            role: "Projektmanagerin SAP-Rollouts",
            period: "2005 – 2016",
            points: [
              "SAP-Rollouts u. a. in der Türkei, den Niederlanden, Portugal und Finnland",
              "Integration neuer Geschäftseinheiten wie Healthcare und Project Business in die bestehende SAP-Landschaft",
            ],
            result: "Alle Rollouts termingerecht und innerhalb des Budgets abgeschlossen.",
          },
        ],
        more: [
          "Regionsübergreifendes globales SAP-Template",
          "CPFR-Implementierung in Europa",
          "Upgrade 4.6C → ERP 6.0 & APO 4.0 → 5.0 (Teilprojektleitung Test, Cutover, Hypercare)",
          "Zentrallagerkonzept in SAP",
          "Recyclinggebühren-Abrechnung (WEEE/REA)",
          "Euro-Umstellung Slowakei",
          "Außendienststeuerung & Projektplanungstools",
          "EDI-Outtasking",
        ],
      },
      {
        client: "IBM Deutschland GmbH",
        period: "05/2001 – 11/2003",
        industry: "Konsumgüter & Handel · Kunde: Panasonic",
        headline: "SAP SD-Consulting: Implementierung & Rollout",
        release: "",
        modules: ["SD"],
        team: "",
        kpis: [] as Array<{ value: string; label: string }>,
        engagements: [
          {
            role: "SD-Consultant SAP-Rollout (Freelancerin für IBM)",
            period: "01/2002 – 11/2003",
            points: [
              "Analyse, Customizing und Training im Modul SD",
              "Koordination und Durchführung von Tests sowie Go-live-Support",
              "Pilotprojekt in Deutschland und Österreich, Rollout in Belgien und Skandinavien",
            ],
            result:
              "Pilot in Deutschland und Österreich erfolgreich umgesetzt – Grundlage für den Rollout in Belgien und Skandinavien.",
          },
          {
            role: "SD-Consultant SAP-Implementierung",
            period: "05/2001 – 12/2001",
            points: [
              "Analyse und Customizing des Moduls SD",
              "Schulungen und Test-Unterstützung",
              "Implementierung des Pilotprojekts in Deutschland und Österreich",
            ],
            result: "",
          },
        ],
        more: [] as string[],
      },
    ],
  },

  golive: {
    eyebrow: "Go-live",
    title: "Die Magie des Go-live-Moments.",
    quote:
      "Was mich an meiner Arbeit am meisten begeistert, ist der Go-live-Moment eines SAP-Projekts. Der Augenblick, wenn all die Planung und Mühe endlich Früchte tragen und das System erfolgreich in Betrieb genommen wird.",
    quoteTail:
      "Das ist der Moment, der mir zeigt, warum ich meinen Beruf so liebe.",
    author: "Daniela Franzen",
    photoAlt: "Daniela Franzen lächelnd im dunklen Blazer",
    checklistTitle: "Go-live-Checkliste",
    checklist: [
      "Stammdaten reibungslos migriert",
      "Schnittstellen & Berechtigungen funktionieren",
      "System voll einsatzbereit",
      "Team arbeitet im Gleichklang",
      "Für Kunden & Lieferanten nahezu unsichtbar",
    ],
    status: "Live",
  },

  about: {
    eyebrow: "Über mich",
    name: "Daniela Franzen",
    roles: "Projektleitung · Programmmanagement · Interim Management",
    title:
      "Ich spezialisiere mich auf die Leitung und erfolgreiche Umsetzung komplexer SAP-Projekte und -Programme.",
    paragraphs: [
      "Mit über 23 Jahren Erfahrung in SAP-Projekten – davon mehr als 15 Jahre in Führungspositionen – biete ich Ihnen bei ProjeXs maßgeschneiderte Beratung und eine erfolgreiche Umsetzung Ihrer Vorhaben.",
      "Meine Laufbahn begann als SD-Consultant bei IBM. Es folgten 16 Jahre SAP-Projekt- und Portfoliomanagement bei Panasonic und die Programmleitung einer globalen S/4HANA-Implementierung bei der HELM AG. Diese Mischung aus Beratungs- und Inhouse-Erfahrung prägt meine Arbeit.",
    ],
    portraitAlt: "Porträt von Daniela Franzen im hellen Blazer",
    valuesTitle: "Wofür ich stehe",
    values: [
      {
        title: "Langjährige Erfahrung",
        text: "Zahlreiche SAP-Implementierungen und S/4HANA-Transformationen in verschiedenen Branchen – und ein tiefes Verständnis für Herausforderungen und Lösungen im SAP-Umfeld.",
      },
      {
        title: "Projektleitung mit Fokus",
        text: "Strategisches Denken und ein klarer Fokus auf die Projektziele – damit jede Phase effizient und zielgerichtet verläuft.",
      },
      {
        title: "Programmmanagement mit Weitblick",
        text: "Unternehmensziele im Blick, Abhängigkeiten im Griff: durch Stakeholder-Integration, Budgettreue und gezieltes Change-Management.",
      },
    ],
    certsTitle: "Zertifizierungen & Auszeichnungen",
    certs: [
      { name: "PMP®", detail: "Project Management Professional (PMI)" },
      { name: "PSM I", detail: "Professional Scrum Master" },
      { name: "SAP MM", detail: "SAP-Zertifizierung Materialwirtschaft" },
      { name: "GenAI", detail: "Generative AI Overview for Project Managers" },
      { name: "Award", detail: "Panasonic Business Performance Award" },
    ],
    timelineTitle: "Stationen",
    timeline: [
      { year: "2001", title: "IBM Deutschland", text: "SD-Consultant SAP-Implementierung & Rollout" },
      { year: "2003", title: "Panasonic", text: "SAP-Projekt- & Portfoliomanagement, Integration Manager S/4HANA" },
      { year: "2020", title: "HELM AG", text: "Programm-Managerin globale S/4HANA-Implementierung" },
      { year: "Heute", title: "ProjeXs", text: "Projektleitung, Programmmanagement & Interim Management" },
    ],
  },

  faq: {
    eyebrow: "FAQ",
    title: "Häufige Fragen.",
    items: [
      {
        q: "In welchen Rollen kann ich Sie für mein SAP-Projekt einsetzen?",
        a: "Als Projektleitung, im Programmmanagement oder als Interim Managerin – etwa für S/4HANA-Implementierungen, globale Template-Rollouts, SAP-Upgrades, IT-Krisen oder Organisationsveränderungen wie Integrationen und Carve-outs.",
      },
      {
        q: "Wie schnell können Sie einsteigen?",
        a: "Gerade bei dringenden Vorhaben zählt Tempo. Dank schneller Einarbeitung und pragmatischer Herangehensweise bin ich zügig arbeitsfähig. Sprechen Sie mich auf Ihren Zeitrahmen an.",
      },
      {
        q: "Arbeiten Sie vor Ort oder remote?",
        a: "Mein Sitz ist Buchholz in der Nordheide bei Hamburg. Ich habe in internationalen Teams in Europa und Asien gearbeitet.",
      },
      {
        q: "Welche Zertifizierungen bringen Sie mit?",
        a: "Ich bin zertifizierte Project Management Professional (PMP®, PMI) und Professional Scrum Master (PSM I) und verfüge über eine SAP-Zertifizierung im Bereich Materialwirtschaft (MM).",
      },
      {
        q: "Mit welchen SAP-Modulen haben Sie Erfahrung?",
        a: "Projektverantwortung u. a. für SD, MM, PP, TM, QM, PS, FI, CO, APO, WMS, CS, REA und BW sowie für B2B- und EDI-Integrationen – in SAP ECC 6.0 und S/4HANA (u. a. Releases 1809 und 2022).",
      },
      {
        q: "Kann ich eine vollständige Projektübersicht erhalten?",
        a: "Ja, gerne. Auf dieser Seite finden Sie eine Auswahl – die vollständige Übersicht meiner Projekte und Erfolge sende ich Ihnen auf Anfrage zu.",
      },
    ],
  },

  contact: {
    eyebrow: "Kontakt",
    title: "Lassen Sie uns über Ihr SAP-Projekt sprechen.",
    intro:
      "Nutzen Sie das Kontaktformular oder schreiben Sie mir direkt. Ich melde mich persönlich bei Ihnen.",
    personal: "Ich freue mich auf Ihre Nachricht.",
    stepperTeaser: "Lieber Schritt für Schritt?",
    stepperCta: "Anfrage im Dialog starten",
    pageCta: "Zur Kontaktseite",
    emailLabel: "E-Mail",
    phoneLabel: "Mobil",
    linkedinLabel: "LinkedIn",
    linkedinText: "Profil ansehen",
    locationLabel: "Standort",
    location: "Buchholz i. d. Nordheide · Metropolregion Hamburg",
    form: {
      firstName: "Vorname",
      lastName: "Nachname",
      email: "E-Mail",
      phone: "Mobil",
      company: "Firma",
      optional: "optional",
      topic: "Worum geht es?",
      topics: [
        "Projektleitung",
        "Programmmanagement",
        "Interim Management",
        "IT-Krisenmanagement",
        "Projektübersicht anfordern",
        "Sonstiges",
      ],
      message: "Ihre Nachricht",
      messagePlaceholder: "Ausgangslage, Zeitrahmen, Ziele …",
      consentBefore: "Ich bin einverstanden, dass meine Angaben zur Bearbeitung meiner Anfrage verarbeitet werden. Details in der ",
      consentLink: "Datenschutzerklärung",
      consentAfter: ".",
      submit: "Anfrage abschicken",
      sending: "Wird gesendet …",
      successTitle: "Vielen Dank!",
      successText: "Ihre Nachricht ist angekommen. Ich melde mich zeitnah persönlich bei Ihnen.",
      errorText: "Leider ist etwas schiefgelaufen. Bitte versuchen Sie es erneut oder schreiben Sie direkt an",
      fallbackText:
        "Der Direktversand ist gerade nicht verfügbar. Ihre Nachricht ist vorbereitet – senden Sie sie einfach über Ihr E-Mail-Programm.",
      fallbackButton: "Per E-Mail senden",
      mailSubject: "Anfrage über projexs.de",
      required: "Bitte ausfüllen.",
      invalidEmail: "Bitte eine gültige E-Mail-Adresse angeben.",
      consentRequired: "Bitte stimmen Sie der Datenverarbeitung zu.",
      tooShort: "Bitte beschreiben Sie Ihr Anliegen in ein paar Sätzen.",
    },
  },

  footer: {
    tagline: "Ihre Lösung für komplexe SAP-Projekte.",
    description:
      "SAP-Projektleitung, Programmmanagement und Interim Management – für S/4HANA-Transformationen, globale Template-Rollouts und Upgrades. Sitz in Buchholz in der Nordheide bei Hamburg.",
    servicesTitle: "Leistungen",
    services: [
      { label: "SAP-Projektleitung", id: "leistungen" },
      { label: "Programmmanagement", id: "leistungen" },
      { label: "Interim Management", id: "leistungen" },
      { label: "IT-Krisenmanagement", id: "leistungen" },
      { label: "S/4HANA-Transformation", id: "expertise" },
      { label: "Go-live-Begleitung", id: "go-live" },
    ],
    navTitle: "Navigation",
    contactTitle: "Kontakt",
    legalTitle: "Rechtliches",
    imprint: "Impressum",
    privacy: "Datenschutz",
    terms: "AGB",
    certsLabel: "Zertifiziert",
    certs: ["PMP® – Project Management Professional", "PSM I – Professional Scrum Master", "SAP-zertifiziert (MM)"],
    languageLabel: "Sprache",
    ctaTitle: "Bereit für Ihr nächstes SAP-Projekt?",
    ctaText: "Erstgespräch anfragen – ich melde mich persönlich.",
    cta: "Projekt anfragen",
    seoText:
      "ProjeXs ist das Beratungsunternehmen von Daniela Franzen, SAP-Programm- und Projektmanagerin mit Sitz in Buchholz in der Nordheide bei Hamburg. Seit 2001 führt sie SAP-Projekte – als SD-Consultant bei IBM, über 16 Jahre im SAP-Projekt- und Portfoliomanagement bei Panasonic und zuletzt als Programm-Managerin einer globalen S/4HANA-Implementierung bei der HELM AG mit 13 Go-lives in Europa und Asien. Unternehmen aus Hamburg, Norddeutschland, dem gesamten DACH-Raum und Europa beauftragen sie als SAP-Projektleitung, für das Programmmanagement großer Transformationen, als Interim Managerin bei Führungsvakanzen oder für IT-Krisenmanagement, wenn ein Projekt in Schieflage gerät. Die Schwerpunkte: S/4HANA-Implementierung und -Transformation, globale Template-Rollouts, SAP-Upgrades, Carve-outs und Integrationen sowie der Aufbau von SAP-Rollout- und Support-Organisationen. Modulerfahrung besteht unter anderem in SD, MM, PP, TM, QM, PS, FI, CO, APO, WMS, CS, REA und BW sowie in B2B- und EDI-Integrationen – in SAP ECC 6.0 und S/4HANA. Daniela Franzen ist zertifizierte Project Management Professional (PMP®), Professional Scrum Master (PSM I) und SAP-zertifiziert; sie arbeitet vor Ort, hybrid oder remote und hat internationale Teams in Europa und Asien geführt.",
    rights: "Alle Rechte vorbehalten.",
    backToTop: "Nach oben",
  },

  legal: {
    backHome: "Zur Startseite",
    updated: "Stand",
    germanOnly: "",
  },
};

export type Dictionary = typeof de;
