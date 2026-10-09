import type { Dictionary } from "./de";

/**
 * All English copy. Must mirror the structure of content/de.ts.
 */
export const en: Dictionary = {
  locale: "en",
  htmlLang: "en",
  ogLocale: "en_GB",

  routes: {
    home: "/en",
    imprint: "/en/legal-notice",
    privacy: "/en/privacy",
    terms: "/agb",
    contact: "/en/contact",
  },

  ids: {
    services: "services",
    expertise: "expertise",
    projects: "projects",
    golive: "go-live",
    about: "about",
    faq: "faq",
    contact: "contact",
  },

  meta: {
    title: "ProjeXs – SAP Project Management & Implementation Expert | Daniela Franzen",
    description:
      "Daniela Franzen brings complex SAP projects safely to go-live: S/4HANA transformations, global template rollouts, programme and interim management. 23+ years of experience, PMP® certified.",
    keywords: [
      "SAP project management",
      "SAP project manager",
      "SAP programme management",
      "S/4HANA transformation",
      "S/4HANA implementation",
      "SAP template rollout",
      "SAP interim management",
      "IT crisis management",
      "Daniela Franzen",
      "ProjeXs",
    ],
    ogTitle: "Complex SAP projects. Safely to go-live.",
    ogSubtitle: "Project leadership · Programme management · Interim management",
  },

  nav: {
    skip: "Skip to content",
    items: [
      { label: "Services", id: "services" },
      { label: "Expertise", id: "expertise" },
      { label: "Projects", id: "projects" },
      { label: "About", id: "about" },
      { label: "FAQ", id: "faq" },
    ],
    contactLabel: "Contact",
    cta: "Start a project",
    menuOpen: "Open menu",
    menuClose: "Close menu",
    menuTitle: "Navigation",
    switchLabel: "DE",
    switchAria: "DE – switch to German",
    homeAria: "ProjeXs – home",
  },

  hero: {
    eyebrow: "SAP project management · S/4HANA · Interim",
    titleLead: "Complex SAP projects.",
    titleAccent: "Safely",
    titleTail: "to go-live.",
    lead:
      "I’m Daniela Franzen – SAP programme and project manager with more than 23 years of experience. I lead S/4HANA transformations, global template rollouts and upgrades to success – with budget discipline and teams that own the result.",
    primary: "Start a project",
    secondary: "View projects",
    credentialsLabel: "Certifications",
    credentials: ["PMP®", "PSM I", "SAP certified"],
    trustLabel: "Project experience includes",
    trust: ["HELM AG", "Panasonic", "IBM"],
    photoAlt: "Daniela Franzen, SAP programme and project manager, portrait in a dark blazer",
    callLabel: "Or call directly",
    location: "Buchholz i. d. Nordheide · Hamburg · remote",
    card: {
      label: "Most recent programme",
      title: "Global S/4HANA implementation",
      client: "HELM AG · 2020 – 2024",
      result: "Go-live in 13 subsidiaries across Europe and Asia – on time and on budget.",
    },
  },

  process: {
    eyebrow: "Working together",
    title: "How we get started.",
    intro: "Three steps from first enquiry to kick-off – clear, fast and straightforward.",
    steps: [
      {
        title: "Introductory call",
        text: "We discuss the starting point, goals and timeline of your initiative – by phone or video.",
      },
      {
        title: "Assessment & proposal",
        text: "You receive my honest assessment of the role and commitment your project needs – with a clear proposal.",
      },
      {
        title: "Kick-off & delivery",
        text: "Fast onboarding, clear structure and regular reporting – through go-live and an orderly handover.",
      },
    ],
    cta: "Request an introductory call",
  },

  why: {
    eyebrow: "Why ProjeXs",
    title: "Experience that brings projects safely home.",
    intro:
      "What you get when you work with me: proven experience instead of promises – and project leadership that takes responsibility.",
    points: [
      {
        title: "23+ years of SAP, 15+ years of leadership",
        text: "From SD consulting at IBM and 16 years of project and portfolio management at Panasonic to leading a global S/4HANA programme.",
      },
      {
        title: "On time and on budget",
        text: "13 go-lives across Europe and Asia within the planned three-year timeframe – and every SAP rollout at Panasonic from 2005 to 2016 delivered to plan.",
      },
      {
        title: "In-house mindset, external perspective",
        text: "I know both sides – as an external consultant and from in-house positions. That’s how solutions gain real acceptance inside the organisation.",
      },
      {
        title: "Certified and methodical",
        text: "PMP®, Professional Scrum Master (PSM I) and SAP certified – classic, agile or hybrid, whatever your project needs.",
      },
    ],
    cta: "Book an introductory call",
    ctaHint: "No obligation · personal reply",
  },

  lead: {
    title: "An SAP project coming up?",
    text: "Let’s talk briefly: starting point, goals, timeline. I’ll get back to you personally – no sales pitch.",
    primary: "Start a project",
    call: "Call now",
    close: "Dismiss",
  },

  consent: {
    title: "Privacy settings",
    text: "This website sets no tracking cookies. External content (Google Maps on the contact page) is loaded only with your consent. Your choice is stored locally in your browser.",
    necessary: "Technically necessary",
    necessaryText: "Required to run the website, e.g. remembering your privacy choice. Always on.",
    external: "External content (Google Maps)",
    externalText: "Loads the map on the contact page from Google. Data such as your IP address is transmitted to Google.",
    acceptAll: "Accept all",
    necessaryOnly: "Necessary only",
    settings: "Settings",
    save: "Save selection",
    privacyLink: "Privacy policy",
    reopen: "Cookie settings",
  },

  inquiry: {
    title: "Start a project",
    subtitle: "Two minutes to your enquiry. I’ll get back to you personally.",
    stepLabel: "Step",
    of: "of",
    next: "Next",
    back: "Back",
    submit: "Send enquiry",
    close: "Close",
    enterHint: "Enter ↵ to continue",
    optionalHint: "You can also skip this step.",
    steps: {
      topic: { q: "What is your initiative about?", hint: "Choose what fits best." },
      timeframe: {
        q: "When should it start?",
        label: "Timeframe",
        options: ["As soon as possible", "Within the next 1–3 months", "Later this year", "Still open"],
      },
      person: { q: "Who am I speaking with?", hint: "Name and company." },
      contact: { q: "How can I best reach you?", hint: "An email address is enough – the mobile number is optional." },
      message: { q: "What should I know up front?", hint: "Starting point, scope and goals – in a few sentences." },
      consent: { q: "Almost done.", hint: "Please confirm the data processing and your enquiry comes straight to me." },
    },
    pageLink: "Prefer the contact page instead?",
  },

  contactPage: {
    metaTitle: "Contact | ProjeXs – Daniela Franzen",
    metaDescription:
      "Get in touch with Daniela Franzen: SAP project leadership, programme management and interim management. Enquire in a few steps or directly by phone and email.",
    eyebrow: "Contact",
    title: "Tell me about your initiative.",
    intro: "Describe your SAP project in a few steps – or simply call me. I’ll get back to you personally.",
    formTitle: "Your enquiry",
    tabStepper: "Step by step",
    tabClassic: "Classic form",
    directTitle: "Direct contact",
    availabilityTitle: "Availability",
    availabilityText: "Available on business days by phone and email. I’ll get back to you personally and promptly – by video call if you prefer.",
    mapTitle: "Location",
    mapLoad: "Load map (Google Maps)",
    mapHint: "Loading the map transmits data to Google. Details:",
    mapRoute: "Get directions",
    mapIframeTitle: "Google Maps: ProjeXs location in Buchholz in der Nordheide",
    backHome: "Back to home",
  },

  mobileBar: {
    call: "Call",
    inquire: "Start a project",
    expand: "Expand contact bar",
    collapse: "Collapse contact bar",
  },

  stats: [
    { value: 23, suffix: "+", label: "years of experience in SAP projects" },
    { value: 15, suffix: "+", label: "years in leadership positions" },
    { value: 13, suffix: "", label: "go-lives across Europe & Asia in one S/4HANA programme" },
    { value: 90, suffix: "", label: "internal & external project members led" },
  ],

  services: {
    eyebrow: "Services",
    title: "How can I support you?",
    intro:
      "As project lead, programme manager or interim manager: I take responsibility wherever SAP initiatives need experience, pace and a clear line.",
    roles: [
      {
        title: "Project leadership",
        text: "SAP implementations, S/4HANA transformations and template rollouts – led with strategic thinking and a clear focus on project goals. Every phase efficient and purposeful.",
        points: ["S/4HANA implementation", "Template rollouts", "SAP upgrades"],
      },
      {
        title: "Programme management",
        text: "I steer dependencies and the interplay of everyone involved – through stakeholder integration, budget discipline and targeted change management for lasting results.",
        points: ["Roadmap & budget", "Governance & reporting", "Change management"],
      },
      {
        title: "Interim management",
        text: "When leadership is missing or an initiative must start right away, I take responsibility at short notice – and hand over in an orderly way once your organisation is ready.",
        points: ["Fast onboarding", "Stabilisation", "Orderly handover"],
      },
    ],
    situationsTitle: "Typical situations where I help",
    situations: [
      {
        title: "Urgent project delivery",
        text: "A project has to be delivered at short notice, but internal resources are lacking? With fast onboarding and a pragmatic approach, I drive the implementation quickly and efficiently.",
      },
      {
        title: "IT crisis management",
        text: "When an IT project runs into trouble, I analyse the situation, identify problems fast and take the measures that stabilise the project and lead it to success.",
      },
      {
        title: "Organisational change",
        text: "Integrating a new unit or a carve-out: I adapt IT landscape and organisational structures smoothly – into existing structures or as a standalone unit.",
      },
      {
        title: "Bridging leadership gaps",
        text: "If a new leader isn’t available in time, I become the point of contact for your stakeholders, stabilise the team, support recruiting and ensure a seamless handover.",
      },
    ],
  },

  expertise: {
    eyebrow: "Expertise",
    title: "Internal mindset. External perspective.",
    intro:
      "As an SAP project and programme manager I combine both: the distance and fresh impulses of an outsider – and a deep understanding of internal dynamics, decision paths and challenges.",
    pillars: [
      {
        title: "In-house & leadership experience",
        text: "More than 23 years of SAP projects, over 15 years in leadership positions. I know the typical pitfalls – and which steps it takes for a programme to go live successfully.",
      },
      {
        title: "SAP roadmaps & strategy",
        text: "Planning and delivering SAP roadmaps and the strategic development of SAP organisations – for better business processes and greater efficiency.",
      },
      {
        title: "Internal & external teams",
        text: "I know both sides – as an external consultant and from in-house positions. That’s how I deliver projects with high acceptance, on time and on budget.",
      },
      {
        title: "Stakeholder management",
        text: "Every relevant stakeholder involved, expectations considered – with close collaboration in the team and regular reporting to senior management (C-level).",
      },
      {
        title: "Team dynamics",
        text: "I create an environment that combines the strengths of internal and external teams – so projects succeed technically and are carried by everyone.",
      },
      {
        title: "Methodological depth",
        text: "From strategy and budget calculation to managing complex rollouts – as a certified PMP® and Professional Scrum Master: classic, agile or hybrid.",
      },
    ],
    highlightsTitle: "Key achievements & highlights",
    highlights: [
      {
        title: "Leading global SAP rollouts",
        text: "Global and regional rollouts (S/4HANA and ECC 6.0) with full budget responsibility.",
      },
      {
        title: "Building rollout organisations",
        text: "Built and led internal and external rollout organisations in Europe and Asia.",
      },
      {
        title: "Integrating business processes",
        text: "Successfully integrated business processes and IT structures through global template rollouts.",
      },
      {
        title: "Communication & strategy",
        text: "Communication plans that convey project goals and align initiatives with long-term corporate objectives.",
      },
    ],
    modulesTitle: "SAP modules & integration",
    modules: [
      { code: "S/4", name: "S/4HANA" },
      { code: "SD", name: "Sales & Distribution" },
      { code: "MM", name: "Materials Mgmt." },
      { code: "PP", name: "Production Planning" },
      { code: "TM", name: "Transportation" },
      { code: "QM", name: "Quality Mgmt." },
      { code: "PS", name: "Project System" },
      { code: "FI", name: "Financials" },
      { code: "CO", name: "Controlling" },
      { code: "APO", name: "Advanced Planning" },
      { code: "WMS", name: "Warehouse Mgmt." },
      { code: "CS", name: "Customer Service" },
      { code: "REA", name: "Recycling (WEEE)" },
      { code: "BW", name: "Business Warehouse" },
      { code: "B2B", name: "Partner integration" },
      { code: "EDI", name: "Data interchange" },
    ],
  },

  projects: {
    eyebrow: "Projects",
    title: "Projects & responsibilities.",
    intro:
      "An insight into major programmes and projects I was responsible for as SAP programme and project manager.",
    note: "I’m happy to send you a complete overview of my projects and achievements on request.",
    cta: "Request the full project overview",
    labels: {
      period: "Period",
      industry: "Industry",
      release: "Release",
      modules: "Modules",
      team: "Project size",
      result: "Result",
      more: "Further projects",
      showMore: "Show all details",
      showLess: "Show less",
    },
    clients: [
      {
        client: "HELM AG",
        period: "04/2020 – 05/2024",
        industry: "Chemicals, pharma & crop solutions",
        headline: "Global S/4HANA implementation & template rollout",
        release: "S/4HANA 1809 & 2022",
        modules: ["SD", "MM", "PP", "TM", "QM", "PS&S", "FI", "CO"],
        team: "90 internal & external staff",
        kpis: [
          { value: "8 + 5", label: "go-lives in Europe & Asia" },
          { value: "3 years", label: "planned timeframe met" },
          { value: "90", label: "project members" },
        ],
        engagements: [
          {
            role: "Programme Manager S/4HANA implementation Europe & Asia",
            period: "04/2021 – 05/2024",
            points: [
              "Developed and implemented a detailed global rollout roadmap for Europe, Asia and the Americas",
              "Overall programme management of the global template rollout and control of all project phases",
              "Built an efficient SAP rollout and support organisation",
              "Integrated an internal reorganisation into the S/4HANA rollout process",
              "Stakeholder management and reporting at C-level",
              "Overall budget responsibility including calculation, controlling and reporting",
            ],
            result:
              "Successful go-live in 8 European and 5 Asian subsidiaries within the planned three-year timeframe – on time and on budget.",
          },
          {
            role: "Programme Manager SAP upgrade",
            period: "06/2023 – 01/2024",
            points: [
              "Executed the upgrade from S/4HANA 1809 to 2022",
              "Planned and integrated the upgrade into the Asia rollout",
            ],
            result: "Upgrade to S/4HANA 2022 without business interruption – seamlessly integrated into the Asia rollout.",
          },
          {
            role: "SAP support organisation",
            period: "05/2020 – 10/2020",
            points: [
              "Strategic design and set-up of the internal and external SAP support structure",
              "RFP preparation and vendor selection",
            ],
            result: "An effective internal and external SAP support structure in place.",
          },
        ],
        more: [] as string[],
      },
      {
        client: "Panasonic",
        period: "12/2003 – 03/2020",
        industry: "Consumer goods & retail",
        headline: "SAP ECC rollouts & S/4HANA transformation",
        release: "ECC 6.0 → S/4HANA",
        modules: ["SD", "APO", "MM", "WMS", "CS", "FI", "REA", "BW", "B2B", "B2X", "EDI"],
        team: "Up to 70 internal & external staff",
        kpis: [
          { value: "16 years", label: "SAP project & portfolio management" },
          { value: "70", label: "project members at peak" },
          { value: "All", label: "SAP rollouts 2005–2016 on time & on budget" },
        ],
        engagements: [
          {
            role: "Integration Manager S/4HANA transformation",
            period: "04/2017 – 03/2020",
            points: [
              "Requirements catalogue, tendering process and vendor selection",
              "Concepts for cross-project topics: test management, authorisation concept, business process automation, batch management",
              "Strategic planning of the greenfield implementation in Europe",
              "Trained teams at two locations",
            ],
            result: "Project cost calculation completed and group-internal approval process initiated.",
          },
          {
            role: "Project Manager BW on HANA",
            period: "10/2017 – 09/2018",
            points: [
              "Led the migration of the central SAP BW systems from DB2 to BW on HANA",
              "Steered the internal and external offshore team",
            ],
            result: "",
          },
          {
            role: "Project Manager agile project methodology",
            period: "04/2017 – 08/2018",
            points: ["Developed and implemented an internal hybrid-agile project methodology based on Scrum"],
            result: "",
          },
          {
            role: "Project study ERP landscape",
            period: "11/2014 – 12/2016",
            points: ["Analysed the existing ERP landscape (ECC 6.0) and assessed options for an S/4HANA transformation"],
            result: "Business case and strategic roadmap – the basis for the later S/4HANA implementation plan.",
          },
          {
            role: "Project Manager SAP rollouts",
            period: "2005 – 2016",
            points: [
              "SAP rollouts in countries including Turkey, the Netherlands, Portugal and Finland",
              "Integrated new business units such as Healthcare and Project Business into the existing SAP landscape",
            ],
            result: "All rollouts completed on time and within budget.",
          },
        ],
        more: [
          "Cross-regional global SAP template",
          "CPFR implementation in Europe",
          "Upgrade 4.6C → ERP 6.0 & APO 4.0 → 5.0 (sub-project lead test, cut-over, hypercare)",
          "Central warehouse concept in SAP",
          "Recycling fee billing (WEEE/REA)",
          "Euro conversion Slovakia",
          "Field service & project planning tools",
          "EDI outtasking",
        ],
      },
      {
        client: "IBM Deutschland GmbH",
        period: "05/2001 – 11/2003",
        industry: "Consumer goods & retail · Client: Panasonic",
        headline: "SAP SD consulting: implementation & rollout",
        release: "",
        modules: ["SD"],
        team: "",
        kpis: [] as Array<{ value: string; label: string }>,
        engagements: [
          {
            role: "SD Consultant SAP rollout (freelance for IBM)",
            period: "01/2002 – 11/2003",
            points: [
              "Analysis, customising and training in the SD module",
              "Coordinated and executed tests and go-live support",
              "Pilot in Germany and Austria, rollout to Belgium and Scandinavia",
            ],
            result: "Pilot in Germany and Austria delivered successfully – the foundation for the rollout to Belgium and Scandinavia.",
          },
          {
            role: "SD Consultant SAP implementation",
            period: "05/2001 – 12/2001",
            points: [
              "Analysis and customising of the SD module",
              "Training and test support",
              "Implementation of the pilot in Germany and Austria",
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
    title: "The magic of the go-live moment.",
    quote:
      "What excites me most about my work is the go-live moment of an SAP project. The instant when all the planning and effort finally pays off and the system goes into operation successfully.",
    quoteTail: "That’s the moment that shows me why I love my profession.",
    author: "Daniela Franzen",
    photoAlt: "Daniela Franzen smiling in a dark blazer",
    checklistTitle: "Go-live checklist",
    checklist: [
      "Master data migrated smoothly",
      "Interfaces & authorisations working",
      "System fully operational",
      "Team working in harmony",
      "Change nearly invisible to customers & suppliers",
    ],
    status: "Live",
  },

  about: {
    eyebrow: "About",
    name: "Daniela Franzen",
    roles: "Project leadership · Programme management · Interim management",
    title: "I specialise in leading and successfully delivering complex SAP projects and programmes.",
    paragraphs: [
      "With more than 23 years of experience in SAP projects – over 15 of them in leadership positions – at ProjeXs I offer you tailored advice and successful delivery of your initiatives.",
      "My career began as an SD consultant at IBM. It was followed by 16 years of SAP project and portfolio management at Panasonic and programme leadership of a global S/4HANA implementation at HELM AG. This blend of consulting and in-house experience shapes how I work.",
    ],
    portraitAlt: "Portrait of Daniela Franzen in a light blazer",
    valuesTitle: "What I stand for",
    values: [
      {
        title: "Long-standing experience",
        text: "Numerous SAP implementations and S/4HANA transformations across industries – and a deep understanding of the challenges and solutions in the SAP world.",
      },
      {
        title: "Focused project leadership",
        text: "Strategic thinking and a clear focus on project goals – so that every phase runs efficiently and purposefully.",
      },
      {
        title: "Far-sighted programme management",
        text: "Business goals in view, dependencies under control: through stakeholder integration, budget discipline and targeted change management.",
      },
    ],
    certsTitle: "Certifications & awards",
    certs: [
      { name: "PMP®", detail: "Project Management Professional (PMI)" },
      { name: "PSM I", detail: "Professional Scrum Master" },
      { name: "SAP MM", detail: "SAP certification Materials Management" },
      { name: "GenAI", detail: "Generative AI Overview for Project Managers" },
      { name: "Award", detail: "Panasonic Business Performance Award" },
    ],
    timelineTitle: "Career",
    timeline: [
      { year: "2001", title: "IBM Deutschland", text: "SD consultant, SAP implementation & rollout" },
      { year: "2003", title: "Panasonic", text: "SAP project & portfolio management, Integration Manager S/4HANA" },
      { year: "2020", title: "HELM AG", text: "Programme Manager, global S/4HANA implementation" },
      { year: "Today", title: "ProjeXs", text: "Project leadership, programme & interim management" },
    ],
  },

  faq: {
    eyebrow: "FAQ",
    title: "Frequently asked questions.",
    items: [
      {
        q: "In which roles can I engage you for my SAP project?",
        a: "As project lead, programme manager or interim manager – for S/4HANA implementations, global template rollouts, SAP upgrades, IT crises or organisational change such as integrations and carve-outs.",
      },
      {
        q: "How quickly can you start?",
        a: "Pace matters, especially for urgent initiatives. Thanks to fast onboarding and a pragmatic approach I’m productive quickly. Talk to me about your timeline.",
      },
      {
        q: "Do you work on-site or remotely?",
        a: "I’m based in Buchholz in der Nordheide near Hamburg. I have worked in international teams across Europe and Asia.",
      },
      {
        q: "Which certifications do you hold?",
        a: "I’m a certified Project Management Professional (PMP®, PMI) and Professional Scrum Master (PSM I), and I hold an SAP certification in Materials Management (MM).",
      },
      {
        q: "Which SAP modules are you experienced in?",
        a: "Project responsibility for SD, MM, PP, TM, QM, PS, FI, CO, APO, WMS, CS, REA and BW, among others, plus B2B and EDI integrations – in SAP ECC 6.0 and S/4HANA (including releases 1809 and 2022).",
      },
      {
        q: "Can I get a complete project overview?",
        a: "Yes, gladly. This page shows a selection – I’ll send you the complete overview of my projects and achievements on request.",
      },
    ],
  },

  contact: {
    eyebrow: "Contact",
    title: "Let’s talk about your SAP project.",
    intro:
      "Use the contact form or write to me directly. I’ll get back to you personally.",
    personal: "I look forward to hearing from you.",
    stepperTeaser: "Prefer step by step?",
    stepperCta: "Start the enquiry dialog",
    pageCta: "Go to the contact page",
    emailLabel: "Email",
    phoneLabel: "Mobile",
    linkedinLabel: "LinkedIn",
    linkedinText: "View profile",
    locationLabel: "Location",
    location: "Buchholz i. d. Nordheide · Hamburg metropolitan area",
    form: {
      firstName: "First name",
      lastName: "Last name",
      email: "Email",
      phone: "Mobile",
      company: "Company",
      optional: "optional",
      topic: "What is it about?",
      topics: [
        "Project leadership",
        "Programme management",
        "Interim management",
        "IT crisis management",
        "Request project overview",
        "Other",
      ],
      message: "Your message",
      messagePlaceholder: "Current situation, timeline, goals …",
      consentBefore: "I agree that my details will be processed to handle my enquiry. See the ",
      consentLink: "privacy policy",
      consentAfter: " for details.",
      submit: "Send enquiry",
      sending: "Sending …",
      successTitle: "Thank you!",
      successText: "Your message has arrived. I’ll get back to you personally very soon.",
      errorText: "Something went wrong. Please try again or write directly to",
      fallbackText:
        "Direct sending is currently unavailable. Your message is ready – simply send it via your email client.",
      fallbackButton: "Send via email",
      mailSubject: "Enquiry via projexs.de",
      required: "Please fill in this field.",
      invalidEmail: "Please enter a valid email address.",
      consentRequired: "Please agree to the processing of your data.",
      tooShort: "Please describe your request in a few sentences.",
    },
  },

  footer: {
    tagline: "Your solution for complex SAP projects.",
    description:
      "SAP project leadership, programme management and interim management – for S/4HANA transformations, global template rollouts and upgrades. Based in Buchholz in der Nordheide near Hamburg.",
    servicesTitle: "Services",
    services: [
      { label: "SAP project leadership", id: "services" },
      { label: "Programme management", id: "services" },
      { label: "Interim management", id: "services" },
      { label: "IT crisis management", id: "services" },
      { label: "S/4HANA transformation", id: "expertise" },
      { label: "Go-live support", id: "go-live" },
    ],
    navTitle: "Navigation",
    contactTitle: "Contact",
    legalTitle: "Legal",
    imprint: "Legal notice",
    privacy: "Privacy",
    terms: "Terms (German)",
    certsLabel: "Certified",
    certs: ["PMP® – Project Management Professional", "PSM I – Professional Scrum Master", "SAP certified (MM)"],
    languageLabel: "Language",
    ctaTitle: "Ready for your next SAP project?",
    ctaText: "Request an introductory call – I’ll get back to you personally.",
    cta: "Start a project",
    seoText:
      "ProjeXs is the consultancy of Daniela Franzen, SAP programme and project manager based in Buchholz in der Nordheide near Hamburg, Germany. She has led SAP projects since 2001 – as an SD consultant at IBM, through 16 years of SAP project and portfolio management at Panasonic, and most recently as programme manager of a global S/4HANA implementation at HELM AG with 13 go-lives across Europe and Asia. Companies in Hamburg, northern Germany, the DACH region and across Europe engage her as SAP project lead, for the programme management of large transformations, as interim manager during leadership gaps, or for IT crisis management when a project is in trouble. Her focus: S/4HANA implementation and transformation, global template rollouts, SAP upgrades, carve-outs and integrations, and building SAP rollout and support organisations. Module experience includes SD, MM, PP, TM, QM, PS, FI, CO, APO, WMS, CS, REA and BW as well as B2B and EDI integrations – in SAP ECC 6.0 and S/4HANA. Daniela Franzen is a certified Project Management Professional (PMP®), Professional Scrum Master (PSM I) and SAP certified; she works on-site, hybrid or remotely and has led international teams across Europe and Asia.",
    rights: "All rights reserved.",
    backToTop: "Back to top",
  },

  legal: {
    backHome: "Back to home",
    updated: "Last updated",
    germanOnly: "The German version is legally binding.",
  },
};
