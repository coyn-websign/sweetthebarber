// Fadeback shared core: Firebase, vibes, fonts, question defaults, i18n, theming.
(function () {
  const FB = window.FB_CONFIG;
  firebase.initializeApp(FB);
  const db = firebase.firestore();
  const auth = firebase.auth();

  const BASE = location.origin + location.pathname.replace(/[^/]*$/, '').replace(/\/(s|dash)\/$/, '/');

  // Each vibe is a full palette. ink = text, mute = secondary text, line = hairlines.
  const VIBES = {
    sweet:    { label: 'Sweet & Lofi',    bg: '#140c12', card: '#1f151c', ink: '#fff3f8', mute: '#c9a9b9', line: '#3a2833', accent: '#ff9ad0', accentInk: '#1a0a13', glow: '#ff5fb4', font: 'bricolage' },
    candy:    { label: 'Cotton Candy',    bg: '#ffe3ef', card: '#fff6fa', ink: '#1a0a13', mute: '#7a5566', line: '#f3c4d8', accent: '#111111', accentInk: '#ffffff', glow: '#ff9ad0', font: 'bricolage' },
    classic:  { label: 'Classic Pole',    bg: '#f4efe6', card: '#fffdf8', ink: '#141414', mute: '#6b645a', line: '#e2d9c8', accent: '#c8102e', accentInk: '#ffffff', glow: '#1f3a93', font: 'playfair' },
    midnight: { label: 'Midnight Gold',   bg: '#0b0b0c', card: '#161617', ink: '#f5f1e6', mute: '#a39e90', line: '#2b2a27', accent: '#d4af37', accentInk: '#141005', glow: '#d4af37', font: 'syne' },
    concrete: { label: 'Street Concrete', bg: '#1b1c1e', card: '#252629', ink: '#f2f2f0', mute: '#a2a3a6', line: '#36383c', accent: '#ff5a1f', accentInk: '#140600', glow: '#ff5a1f', font: 'archivo' },
    mint:     { label: 'Fresh Mint',      bg: '#eef8f4', card: '#ffffff', ink: '#0d2a22', mute: '#557a6e', line: '#cfe7de', accent: '#0f9d75', accentInk: '#ffffff', glow: '#6ee7b7', font: 'space' }
  };

  const FONTS = {
    bricolage: { label: 'Bricolage (bold & friendly)', display: "'Bricolage Grotesque'", q: 'Bricolage+Grotesque:opsz,wght@12..96,600;12..96,800' },
    playfair:  { label: 'Playfair (classic)',          display: "'Playfair Display'",    q: 'Playfair+Display:wght@600;800' },
    syne:      { label: 'Syne (luxe)',                 display: "'Syne'",                q: 'Syne:wght@600;800' },
    archivo:   { label: 'Archivo Black (street)',      display: "'Archivo Black'",       q: 'Archivo+Black' },
    space:     { label: 'Space Grotesk (clean)',       display: "'Space Grotesk'",       q: 'Space+Grotesk:wght@500;700' },
    unbounded: { label: 'Unbounded (loud)',            display: "'Unbounded'",           q: 'Unbounded:wght@600;800' }
  };

  const DEFAULT_SERVICES = ['Fade', 'Taper', 'Lineup / shape-up', 'Beard trim', 'Cut + beard', 'Kids cut', 'Design / part', 'Other'];
  const DEFAULT_WANTS = ['Online booking', 'House calls', 'Hot towel finish', 'Beard care', 'Products for sale', 'Loyalty card', 'Student / kids pricing', 'Late or weekend slots', 'Hair designs', 'Better music & vibe'];
  const SOURCES = ['Instagram', 'TikTok', 'Friend / family', 'Walked by', 'Google', 'Other'];
  const SCORE_KEYS = ['clean', 'time', 'vibe', 'value'];

  const T = {
    en: {
      start: "Let's go", takes: 'Takes about 60 seconds. Keep it real, it helps me level up.',
      next: 'Next', back: 'Back', skip: 'Skip', send: 'Send it', sending: 'Sending…',
      q_service: 'What did you get today?',
      q_quality: 'Did you receive a quality experience?',
      quality: { yes: 'Yes, 100%', mostly: 'Mostly', no: 'Not really' },
      q_rating: 'Rate the cut itself',
      rating_lo: 'Not it', rating_hi: 'Perfect',
      q_scores: 'Quick ratings',
      scores: { clean: 'Clean & hygienic', time: 'On time / wait', vibe: 'Vibe & conversation', value: 'Worth the price' },
      q_nps: 'How likely are you to recommend me to a friend?',
      nps_lo: 'Not likely', nps_hi: 'For sure',
      q_again: 'Would you book again?',
      again: { yes: 'Yes', maybe: 'Maybe', no: 'No' },
      q_source: 'How did you find me?',
      q_wants: 'What would you love to see added?', wants_hint: 'Pick as many as you want',
      want_other: 'Something else? Type it here',
      q_improve: 'One thing I could do better?', improve_hint: 'Area of improvement. Be honest, nothing is too small.',
      improve_ph: 'e.g. faster booking replies, sharper lineup, more music…',
      q_last: 'Anything else?', shout_ph: 'Shoutout, story, anything on your mind',
      name_ph: 'Your name (optional)', contact_ph: 'IG or phone (optional)',
      feature: 'OK to share my words on Instagram',
      thanks: 'Thank you!', thanks_sub: 'Your feedback just landed. See you next cut.',
      book: 'Book your next cut', follow: 'Follow on Instagram',
      notfound: "This survey link doesn't exist yet.", err: "That didn't send. Check your connection and try again.",
      powered: 'Powered by Fadeback'
    },
    fr: {
      start: "C'est parti", takes: "Environ 60 secondes. Sois honnête, ça m'aide à m'améliorer.",
      next: 'Suivant', back: 'Retour', skip: 'Passer', send: 'Envoyer', sending: 'Envoi…',
      q_service: "Qu'est-ce que tu as fait aujourd'hui?",
      q_quality: 'As-tu reçu une expérience de qualité?',
      quality: { yes: 'Oui, 100 %', mostly: 'Plutôt', no: 'Pas vraiment' },
      q_rating: 'Note la coupe',
      rating_lo: 'Bof', rating_hi: 'Parfaite',
      q_scores: 'Notes rapides',
      scores: { clean: 'Propreté et hygiène', time: 'Ponctualité / attente', vibe: 'Ambiance et jasette', value: 'Vaut le prix' },
      q_nps: 'Quelles sont les chances que tu me recommandes à un ami?',
      nps_lo: 'Peu probable', nps_hi: 'Certain',
      q_again: 'Reviendrais-tu?',
      again: { yes: 'Oui', maybe: 'Peut-être', no: 'Non' },
      q_source: 'Comment tu m’as trouvé?',
      q_wants: "Qu'aimerais-tu voir de plus?", wants_hint: 'Choisis-en autant que tu veux',
      want_other: 'Autre chose? Écris-le ici',
      q_improve: 'Une chose que je pourrais améliorer?', improve_hint: "Point à améliorer. Sois franc, rien n'est trop petit.",
      improve_ph: 'ex. répondre plus vite, contours plus nets, meilleure musique…',
      q_last: 'Autre chose?', shout_ph: 'Un mot, une histoire, ce que tu veux',
      name_ph: 'Ton nom (optionnel)', contact_ph: 'IG ou téléphone (optionnel)',
      feature: "OK pour partager mes mots sur Instagram",
      thanks: 'Merci!', thanks_sub: 'Ton avis est bien reçu. À la prochaine coupe.',
      book: 'Réserve ta prochaine coupe', follow: 'Suivre sur Instagram',
      notfound: "Ce lien de sondage n'existe pas encore.", err: "L'envoi a échoué. Vérifie ta connexion et réessaie.",
      powered: 'Propulsé par Fadeback'
    }
  };
  // Option labels the barber did not customise get translated too.
  const FR_OPTS = {
    'Fade': 'Dégradé', 'Taper': 'Taper', 'Lineup / shape-up': 'Contour', 'Beard trim': 'Barbe', 'Cut + beard': 'Coupe + barbe',
    'Kids cut': 'Coupe enfant', 'Design / part': 'Design / ligne', 'Other': 'Autre',
    'Online booking': 'Réservation en ligne', 'House calls': 'Coupe à domicile', 'Hot towel finish': 'Serviette chaude',
    'Beard care': 'Soin de barbe', 'Products for sale': 'Produits à vendre', 'Loyalty card': 'Carte fidélité',
    'Student / kids pricing': 'Prix étudiant / enfant', 'Late or weekend slots': 'Plages tard / fin de semaine',
    'Hair designs': 'Designs', 'Better music & vibe': 'Musique et ambiance',
    'Instagram': 'Instagram', 'TikTok': 'TikTok', 'Friend / family': 'Ami / famille', 'Walked by': 'En passant', 'Google': 'Google'
  };

  function blankBarber(slug) {
    return {
      slug, name: '', handle: '', email: '', booking: '', city: '', tagline: '', verse: '',
      logo: '', vibe: 'sweet', colors: { ...VIBES.sweet }, font: 'bricolage', lang: 'en', bilingual: true,
      services: DEFAULT_SERVICES.slice(), wants: DEFAULT_WANTS.slice(), team: []
    };
  }

  // Firestore doc wins; starter brands fall back to their static JSON so the QR works from day one.
  async function loadBarber(slug) {
    if (!slug) return null;
    try {
      const snap = await db.collection('barbers').doc(slug).get();
      if (snap.exists) return { ...blankBarber(slug), ...snap.data(), slug, _live: true };
    } catch (e) { console.warn('[fadeback] profile read failed', e); }
    try {
      const res = await fetch(BASE + 'brands/' + slug + '.json', { cache: 'no-cache' });
      if (res.ok) {
        const b = await res.json();
        if (b.logo && !/^(data:|https?:)/.test(b.logo)) b.logo = BASE + b.logo;
        return { ...blankBarber(slug), ...b, slug, _preset: true };
      }
    } catch (e) {}
    return null;
  }

  const loadedFonts = new Set();
  function loadFont(key) {
    const f = FONTS[key] || FONTS.bricolage;
    if (loadedFonts.has(key)) return f;
    loadedFonts.add(key);
    const l = document.createElement('link');
    l.rel = 'stylesheet';
    l.href = 'https://fonts.googleapis.com/css2?family=' + f.q + '&display=swap';
    document.head.appendChild(l);
    return f;
  }

  function applyTheme(b, el) {
    el = el || document.documentElement;
    const c = { ...VIBES.sweet, ...(VIBES[b.vibe] || {}), ...(b.colors || {}) };
    const f = loadFont(b.font || c.font);
    for (const k of ['bg', 'card', 'ink', 'mute', 'line', 'accent', 'accentInk', 'glow']) el.style.setProperty('--' + k, c[k]);
    el.style.setProperty('--display', f.display + ', system-ui, sans-serif');
    const meta = document.querySelector('meta[name=theme-color]');
    if (meta) meta.content = c.bg;
  }

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
  }
  function slugify(s) {
    return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 32);
  }
  function surveyUrl(slug) { return BASE + 's/?b=' + encodeURIComponent(slug); }
  function dashUrl(slug) { return BASE + 'dash/?b=' + encodeURIComponent(slug); }
  function igUrl(handle) { const h = String(handle || '').replace(/^@/, '').trim(); return h ? 'https://www.instagram.com/' + h + '/' : ''; }

  window.FB = {
    db, auth, BASE, VIBES, FONTS, T, FR_OPTS, SOURCES, SCORE_KEYS, DEFAULT_SERVICES, DEFAULT_WANTS,
    blankBarber, loadBarber, applyTheme, loadFont, esc, slugify, surveyUrl, dashUrl, igUrl,
    ADMIN: 'noriodeobaro@gmail.com'
  };
})();
