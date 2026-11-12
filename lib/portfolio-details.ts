import { type PortfolioId } from "@/lib/portfolio-sites";

export type PortfolioDetail = {
  tags: string[];
  product: string;
  client: string;
  description: string;
};

const IT: Record<PortfolioId, PortfolioDetail> = {
  quipalermo: {
    tags: ["Portale civico", "Mappa", "Eventi", "Directory", "IT/EN"],
    product: "Portale web con area pubblica e strumenti di moderazione",
    client: "Iniziativa civica territoriale",
    description:
      "Sito realizzato per un portale civico. I visitatori trovano una mappa, una directory di attività, eventi con iscrizione, notizie, ricerca e una sezione per le imprese. È previsto l’invio di segnalazioni con posizione e foto. Il contenuto è in italiano e inglese. La struttura è pensata per orientare chi cerca informazioni sul territorio e per raccogliere richieste di contatto senza moltiplicare i canali.",
  },
  alvenco: {
    tags: ["Sito corporate", "Servizi digitali", "Piani", "Preventivo"],
    product: "Sito vetrina corporate",
    client: "Studio digitale",
    description:
      "Sito realizzato per uno studio digitale. Presenta linee di lavoro su siti web, applicazioni e commercio elettronico, con piani mensili di presenza online e un percorso chiaro verso il preventivo. Ci sono sezioni di servizio, recapiti e indicazioni su come avviare un progetto. La struttura è pensata per le richieste di contatto e per far capire in pochi passaggi cosa viene offerto, senza elencare metriche o casi nominati.",
  },
  "hotel-boutique": {
    tags: ["Hospitality", "Camere", "Prenotazione", "IT/EN/FR/ES"],
    product: "Sito vetrina con prenotazione e area ospite",
    client: "Struttura ricettiva",
    description:
      "Sito realizzato per un hotel boutique. Comprende home, camere (matrimoniale, superior e suite), ristorante, chi siamo e contatti, con testi in italiano, inglese, francese e spagnolo. È collegata la prenotazione e, per gli ospiti, web check-in, colazione e richiesta transfer. La struttura è pensata per mostrare le camere e raccogliere prenotazioni e richieste di soggiorno in modo diretto dal sito.",
  },
  "noleggio-con-conducente": {
    tags: ["NCC", "Flotta", "Tour", "IT/EN"],
    product: "Sito vetrina con form di richiesta",
    client: "Azienda di noleggio con conducente",
    description:
      "Sito realizzato per un servizio di noleggio con conducente. Include home, servizi, chi siamo, contatti, hub tour (prossimi, aperti e passati), FAQ e una pagina per le agenzie. I testi sono in italiano e inglese. Il form di contatto può partire già orientato sul tipo di richiesta. La struttura è pensata per spiegare flotta e servizi e per raccogliere preventivi su trasferimenti e tour organizzati con partner.",
  },
  "bed-and-breakfast": {
    tags: ["B&B", "Camere", "Dintorni", "Contatti"],
    product: "Sito vetrina ricettivo",
    client: "Struttura ricettiva di piccole dimensioni",
    description:
      "Sito realizzato per un bed and breakfast. Le pagine coprono la home, le camere, i dintorni e i contatti, con testi in italiano sul soggiorno e sull’accoglienza. La home presenta l’ospitalità, la colazione e i dintorni; le camere hanno schede dedicate. La struttura è pensata per far scegliere la stanza e inviare una richiesta di soggiorno, senza un motore di prenotazione visibile nel repository.",
  },
  "manutenzione-uk": {
    tags: ["Manutenzione", "Servizi", "Aree", "FAQ", "EN"],
    product: "Sito vetrina locale",
    client: "Impresa di manutenzione immobiliare",
    description:
      "Sito realizzato per un’impresa di manutenzione in Regno Unito. Pagine in inglese: home, servizi, chi siamo, zone coperte, galleria, FAQ e contatti. I servizi descritti nel sito includono riparazioni, idraulica, interventi elettrici, imbiancatura, giardino, pavimenti e montaggio arredi. C’è una stima chiara e un invito a chiamare o scrivere. La struttura è pensata per le richieste di intervento su immobili residenziali.",
  },
  traslochi: {
    tags: ["Traslochi", "Deposito", "Trasporti", "Facchinaggio"],
    product: "Sito vetrina servizi logistici",
    client: "Azienda di traslochi e trasporti",
    description:
      "Sito realizzato per un’azienda di traslochi. Oltre alla home ci sono chi siamo, contatti e schede servizio: traslochi, facchinaggio, deposito merci, noleggio autoscala e trasporti nazionali. Ogni linea ha una pagina propria con invito al contatto. La struttura è pensata per chi deve spostare arredi o merci e vuole capire il servizio prima di chiedere un sopralluogo o un preventivo.",
  },
  "studio-legale-uk-demo": {
    tags: ["Studio legale", "Practice areas", "Team", "EN"],
    product: "Sito vetrina professionale",
    client: "Studio professionale legale",
    description:
      "Sito realizzato per uno studio legale in lingua inglese. Copre home, servizi, aree di pratica (immigrazione, famiglia, lavoro, contenzioso, testamenti, successioni, conveyancing e immobiliare commerciale), persone, contatti e un’area informativa. Ogni area ha pagine di approfondimento. La struttura è pensata per spiegare le competenze e indirizzare verso un primo contatto, senza dichiarare incarichi in corso e senza esporre fascicoli o nomi.",
  },
  "ecommerce-demo": {
    tags: ["E-commerce", "Catalogo", "Checkout", "B2B", "Admin"],
    product: "Negozio online con back-office",
    client: "Attività commerciale con vendita a privati e rivenditori",
    description:
      "Sito realizzato per un negozio online. Il pubblico vede catalogo, categorie, scheda prodotto, carrello, checkout e account. È prevista una distinzione tra acquisto privato e listino per rivenditori. C’è un back-office per catalogo, scorte, ordini, clienti, coupon e vetrina. La struttura è pensata per navigare i prodotti e completare un ordine, con la gestione quotidiana lasciata all’amministrazione interna del negozio.",
  },
  "consulenza-tributaria": {
    tags: ["Fisco", "Lavoro", "FAQ", "Contatti"],
    product: "Sito vetrina professionale",
    client: "Studio professionale",
    description:
      "Sito realizzato per uno studio di consulenza. Pagine in italiano: home, chi siamo, servizi, FAQ e contatti. I servizi sono suddivisi tra consulenza del lavoro e ambito fiscale, con elenchi di attività e un invito all’area riservata dall’header. Schema e form di contatto sono pensati per il primo appuntamento. La struttura è pensata per presentare lo studio e raccogliere richieste senza esporre fascicoli o dati di assistiti.",
  },
  "consulenza-del-lavoro": {
    tags: ["Fisco", "Tributario", "Contabilità", "FAQ"],
    product: "Sito vetrina professionale",
    client: "Studio professionale",
    description:
      "Sito realizzato per uno studio di consulenza fiscale e tributaria. Pagine in italiano: home, chi siamo, servizi, team, FAQ e contatti. I servizi coprono pianificazione fiscale, diritto tributario, rapporti con la pubblica amministrazione, contabilità e assistenza alle imprese. C’è una chiamata alla consulenza preliminare. La struttura è pensata per spiegare le competenze e avviare il primo contatto da form o recapiti.",
  },
  "educazione-cinofila": {
    tags: ["Educazione cinofila", "Servizi", "Blog", "Eventi"],
    product: "Sito vetrina con blog e CMS",
    client: "Professionista dell’educazione cinofila",
    description:
      "Sito realizzato per un educatore cinofilo. Include home, chi sono, servizi, eventi, blog e contatti, con testi in italiano. I servizi in evidenza riguardano educazione di base e rieducazione comportamentale; i contenuti del blog e degli eventi arrivano da un CMS. La struttura è pensata per presentare i percorsi e raccogliere richieste di contatto, lasciando i testi editoriali aggiornabili senza intervenire sul codice.",
  },
  "ambulatorio-veterinario": {
    tags: ["Ambulatorio", "Visite", "Chirurgia", "Contatti"],
    product: "Sito vetrina a pagina unica",
    client: "Ambulatorio veterinario",
    description:
      "Sito realizzato per un ambulatorio veterinario. Una sola pagina pubblica raggruppa presentazione, servizi e contatti. I servizi descritti sono visite di base, chirurgia, analisi di laboratorio, vaccinazioni e primo intervento. Non ci sono altre sezioni di navigazione nel repository. La struttura è pensata per spiegare l’offerta clinica in sintesi e per far arrivare una richiesta di contatto o di appuntamento.",
  },
  "centro-cinofilo-demo": {
    tags: ["Centro cinofilo", "Servizi", "Prenotazione", "Area soci"],
    product: "Sito vetrina con prenotazione e area riservata",
    client: "Centro cinofilo associativo",
    description:
      "Sito realizzato per un centro cinofilo. Il pubblico trova servizi, prenotazione di visite e attività, galleria, eventi, chi siamo, come funziona e un’area soci. C’è una dashboard per calendario, contenuti e richieste. Le attività sono presentate come percorsi per chi frequenta il campo. La struttura è pensata per capire l’offerta, prenotare un’attività e poi gestire le richieste dal back-office interno.",
  },
};

const EN: Record<PortfolioId, PortfolioDetail> = {
  quipalermo: {
    tags: ["Civic portal", "Map", "Events", "Directory", "IT/EN"],
    product: "Web portal with public pages and moderation tools",
    client: "Civic / local information initiative",
    description:
      "Site built for a civic portal. Visitors get a map, a business directory, events with sign-up, news, search and a section for companies. People can send reports with a location and photos. Copy is in Italian and English. The layout is meant to help people find local information and send a contact request without spreading enquiries across too many channels.",
  },
  alvenco: {
    tags: ["Corporate site", "Digital services", "Plans", "Quote"],
    product: "Corporate brochure website",
    client: "Digital studio",
    description:
      "Site built for a digital studio. It presents web, app and ecommerce work, monthly online-presence plans and a clear path to a quote. Service sections, contact details and a short explanation of how a project starts are included. The layout is meant for contact requests and to show what is offered in a few steps, without listing metrics or named case studies.",
  },
  "hotel-boutique": {
    tags: ["Hospitality", "Rooms", "Booking", "IT/EN/FR/ES"],
    product: "Brochure site with booking and guest area",
    client: "Hospitality business",
    description:
      "Site built for a boutique hotel. It includes home, rooms (double, superior and suite), restaurant, about and contact, with Italian, English, French and Spanish copy. Direct booking is linked, and guests can use web check-in, breakfast information and a transfer request. The layout is meant to present rooms and collect bookings and stay enquiries from the site itself, in a short path.",
  },
  "noleggio-con-conducente": {
    tags: ["Chauffeur hire", "Fleet", "Tours", "IT/EN"],
    product: "Brochure site with enquiry form",
    client: "Chauffeur and coach-hire operator",
    description:
      "Site built for chauffeur and coach hire. It includes home, services, about, contact, a tour hub (upcoming, open and past), FAQ and a page for agencies. Copy is in Italian and English. The contact form can open already aimed at the type of request. The layout is meant to explain fleet and services and to collect quotes for transfers and tours run with partners.",
  },
  "bed-and-breakfast": {
    tags: ["B&B", "Rooms", "Area", "Contact"],
    product: "Hospitality brochure site",
    client: "Small lodging business",
    description:
      "Site built for a bed and breakfast. Pages cover home, rooms, the surrounding area and contact, with Italian copy about the stay and the welcome. The home presents hospitality, breakfast and nearby places; rooms have their own cards. The layout is meant to help guests pick a room and send a stay request; the repository does not show a live booking engine.",
  },
  "manutenzione-uk": {
    tags: ["Maintenance", "Services", "Areas", "FAQ", "EN"],
    product: "Local brochure website",
    client: "Property maintenance business",
    description:
      "Site built for a property-maintenance firm in the United Kingdom. English pages cover home, services, about, coverage areas, gallery, FAQ and contact. Services on the site include repairs, plumbing, electrical work, painting, garden care, flooring and furniture assembly. Estimates are described as clear, with a call or write prompt. The layout is meant for job enquiries on homes and small properties.",
  },
  traslochi: {
    tags: ["Removals", "Storage", "Haulage", "Portering"],
    product: "Logistics brochure website",
    client: "Removals and transport company",
    description:
      "Site built for a removals company. Besides the home there are about, contact and service pages: moves, portering, storage, vehicle-mounted lift hire and national transport. Each line has its own page and a contact prompt. The layout is meant for people moving furniture or goods who want to understand the service before asking for a survey or a quote by form.",
  },
  "studio-legale-uk-demo": {
    tags: ["Law firm", "Practice areas", "Team", "EN"],
    product: "Professional brochure website",
    client: "Legal practice",
    description:
      "Site built for a law firm, in English. It covers home, services, practice areas (immigration, family, employment, litigation, wills, probate, conveyancing and commercial property), people, contact and an information area. Each area has deeper pages. The layout is meant to explain the work and point visitors to a first enquiry, without stating any ongoing instruction and without showing case files.",
  },
  "ecommerce-demo": {
    tags: ["Ecommerce", "Catalogue", "Checkout", "B2B", "Admin"],
    product: "Online shop with back office",
    client: "Retailer selling to consumers and trade",
    description:
      "Site built for an online shop. Shoppers see the catalogue, categories, product page, basket, checkout and account. Private purchase and a trade price list are separated. A back office covers catalogue, stock, orders, customers, coupons and the storefront. The layout is meant for browsing products and completing an order, with day-to-day operations kept in the admin area of the shop.",
  },
  "consulenza-tributaria": {
    tags: ["Tax", "Employment", "FAQ", "Contact"],
    product: "Professional brochure website",
    client: "Professional practice",
    description:
      "Site built for an advisory practice. Italian pages cover home, about, services, FAQ and contact. Services are split between employment consultancy and tax work, with activity lists and a private-area link in the header. Schema and the contact form are aimed at a first appointment. The layout is meant to present the practice and collect enquiries without showing client files.",
  },
  "consulenza-del-lavoro": {
    tags: ["Tax", "Litigation", "Accounts", "FAQ"],
    product: "Professional brochure website",
    client: "Professional practice",
    description:
      "Site built for a tax and accounts practice. Italian pages cover home, about, services, team, FAQ and contact. Services include tax planning, tax litigation, dealings with public bodies, bookkeeping and support for companies. There is a call to an introductory consultation. The layout is meant to explain the skills on offer and start the first contact by form or listed details.",
  },
  "educazione-cinofila": {
    tags: ["Dog training", "Services", "Blog", "Events"],
    product: "Brochure site with blog and CMS",
    client: "Dog-training professional",
    description:
      "Site built for a dog trainer. It includes home, about, services, events, blog and contact, in Italian. Featured services cover basic training and behaviour work; blog and event copy come from a CMS. The layout is meant to present the programmes and collect contact requests, so editorial text can be updated later without changing the underlying code of the site.",
  },
  "ambulatorio-veterinario": {
    tags: ["Clinic", "Consults", "Surgery", "Contact"],
    product: "Single-page brochure website",
    client: "Veterinary clinic",
    description:
      "Site built for a veterinary clinic. One public page groups the introduction, services and contact. Services described are general consults, surgery, lab tests, vaccinations and first response. The repository has no further navigation sections. The layout is meant to summarise the clinical offer on a short public page and to send a contact or appointment request from that same view.",
  },
  "centro-cinofilo-demo": {
    tags: ["Dog centre", "Services", "Booking", "Members"],
    product: "Brochure site with booking and members’ area",
    client: "Membership dog centre",
    description:
      "Site built for a dog centre. The public site has services, booking for visits and activities, gallery, events, about, how it works and a members’ area. A dashboard covers calendar, content and requests. Activities are shown as programmes for people who use the grounds. The layout is meant to explain the offer, take bookings and handle requests in the back office.",
  },
};

export function getPortfolioDetail(
  id: PortfolioId,
  locale: string,
): PortfolioDetail {
  return locale === "it" ? IT[id] : EN[id];
}
