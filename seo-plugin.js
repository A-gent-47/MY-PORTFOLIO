import { CONTENT_DATA } from './src/components/canvas/rooms/Studio/contentData.js';

// Local fallback SEO/GEO data — bypasses Sanity CMS fetches so builds work 100% offline
const SITE_URL = 'https://your-portfolio.vercel.app';

const LOCAL_GLOBAL_INFO = {
    siteTitle: 'Amit Kumar Yadav (AMIT) | Creative 3D Portfolio',
    siteDescription: 'Computer Science (AI & ML) student building interactive web applications, AI tools, and embedded hardware prototypes.',
    aboutMe: 'Amit Kumar Yadav (AMIT) — Gandhinagar, Gujarat. B.Tech CSE (AI/ML) student at Karnavati University (UIT, 2026–2030, 1st Sem) and DAV Public School alumnus (Class XII: 86%, Class X: 92%), building practical, user-focused software & embedded technology solutions with C, Arduino (Mega/Uno), Tinkercad, and prototyping.',
    email: 'amitkumaryadav4444s@gmail.com',
    githubUrl: 'https://github.com/A-gent-47',
    linkedinUrl: 'https://www.linkedin.com/in/amit-yadav-990768447',
    instagramUrl: 'https://www.instagram.com/amit_kumar_yadav444/',
    redditUrl: 'https://www.reddit.com/user/Euphoric-Ad-3632/',
};

const LOCAL_PROJECTS = [
    {
        title: 'KNIGHTFALL',
        subtitle: 'Chess Platform • Live Web App',
        url: 'https://knightfall-chess-zeta.vercel.app/',
        githubUrl: 'https://github.com/A-gent-47/knightfall-chess',
        description: 'Interactive chess platform featuring a built-in tactical puzzle library, multi-difficulty bots with distinct personalities and playstyles, move-by-move mistake analysis, and custom themes.',
        techStack: ['reactlogo.webp', 'jslogo.webp', 'tailwindlogo.webp', 'csslogo.webp'],
    },
    {
        title: 'SYNTHWAVE',
        subtitle: 'Immersive Music Visualizer • Live Web App',
        url: 'https://synthwave-pied.vercel.app/',
        githubUrl: 'https://github.com/A-gent-47/SYNTHWAVE-',
        description: 'Interactive audio-reactive music visualizer delivering an immersive synthwave visual experience directly in the browser.',
        techStack: ['jslogo.webp', 'htmllogo.webp', 'csslogo.webp'],
    },
    {
        title: 'KISANSETU (SIH 2026)',
        subtitle: 'Smart India Hackathon • SIH26032',
        url: null,
        githubUrl: null,
        description: 'Crop procurement platform built for SIH26032 (Ministry of Consumer Affairs, Food & Public Distribution) to solve long farmer waiting times and schedule uncertainty via farmer registration, slot booking, live queue management, alerts, and procurement/payment tracking.',
        techStack: ['reactlogo.webp', 'jslogo.webp', 'htmllogo.webp', 'csslogo.webp'],
    },
    {
        title: 'SMART ACCESS DOOR',
        subtitle: 'DTI Hardware Prototype • Arduino Mega',
        url: null,
        githubUrl: null,
        description: 'Energy-efficient 3-stage automated door system using low-power standby, proximity detection, weight confirmation, tactile password auth, and LED/buzzer feedback in a 1:5 tabletop prototype.',
        techStack: [],
    },
    {
        title: 'ARDUINO CIRCUIT LAB',
        subtitle: 'Tinkercad & Embedded Prototyping',
        url: null,
        githubUrl: null,
        description: 'Interactive Arduino Uno circuit builds and simulations integrating ultrasonic sensors, LDRs, SG90 servos, Neopixels, LEDs, and piezo buzzers.',
        techStack: [],
    },
    {
        title: 'NEURAL NETWORKS & DEEP LEARNING',
        subtitle: 'Fundamentals of AI • Group Research',
        url: null,
        githubUrl: null,
        description: 'Collaborative 5-member technical research and presentation breaking down neural network architectures, training workflows, and real-world deep learning applications.',
        techStack: [],
    },
];

const LOCAL_AWARDS = [];

const LOCAL_FAQ = [];

function getLocalSeoData() {
    const studio = CONTENT_DATA.map(item => ({
        ...item,
        thumbnailUrl: item.frontTexture ? `${SITE_URL}${item.frontTexture}` : undefined,
    }));

    return {
        globalInfo: LOCAL_GLOBAL_INFO,
        projects: LOCAL_PROJECTS,
        studio,
        awards: LOCAL_AWARDS,
        faqList: LOCAL_FAQ,
    };
}

// Tech stack filename -> human-readable name mapping for JSON-LD
const TECH_STACK_NAMES = {
    'reactlogo.webp': 'React',
    'htmllogo.webp': 'HTML',
    'csslogo.webp': 'CSS',
    'jslogo.webp': 'JavaScript',
    'tailwindlogo.webp': 'Tailwind CSS',
    'firebaselogo.webp': 'Firebase',
    'netlifylogo.webp': 'Netlify',
    'wordpresslogo.webp': 'WordPress',
    'elementorlogo.webp': 'Elementor',
    'phplogo.webp': 'PHP',
};

/**
 * Helper to ensure dates are in ISO-8601 format with timezone for SEO.
 */
function formatIsoDate(dateString) {
    if (!dateString) return undefined;
    if (dateString.includes('T')) return dateString; // Already has time/timezone
    return `${dateString}T12:00:00Z`; // Default to noon UTC
}

/**
 * Build dynamic JSON-LD structured data from Sanity content.
 * This generates schema.org entities that AI search engines (Google AI Overviews,
 * Perplexity, Gemini) use to understand and cite content in their answers.
 */
function buildJsonLd(globalInfo, projects, studio, awards, faqList) {
    const graph = [];

    // --- 1. Person: Central node of the Knowledge Graph ---
    const person = {
        '@type': 'Person',
        '@id': `${SITE_URL}/#person`,
        name: 'Amit Kumar Yadav',
        alternateName: ['AMIT'],
        url: SITE_URL,
        ...(globalInfo?.email ? { email: globalInfo.email } : {}),
        jobTitle: 'B.Tech CSE (AI & ML) Student & Developer',
        description: globalInfo?.aboutMe || 'Computer Science (AI & ML) student building interactive web applications, AI tools, and embedded hardware prototypes.',
        knowsAbout: ['C', 'Arduino (Mega/Uno)', 'Tinkercad', 'Prototyping', 'Artificial Intelligence', 'Machine Learning', 'React', 'Three.js', 'Web Development'],
        sameAs: [
            globalInfo?.linkedinUrl,
            globalInfo?.githubUrl,
            globalInfo?.instagramUrl,
            globalInfo?.redditUrl,
            globalInfo?.xUrl,
            globalInfo?.tiktokUrl,
            globalInfo?.youtubeUrl
        ].filter(Boolean)
    };
    graph.push(person);

    // --- 2. WebSite ---
    const website = {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: SITE_URL,
        name: globalInfo?.siteTitle || 'Amit Kumar Yadav (AMIT) | Creative 3D Portfolio',
        description: globalInfo?.siteDescription || 'Computer Science (AI & ML) student building interactive web applications, AI tools, and embedded hardware prototypes.',
        publisher: { '@id': `${SITE_URL}/#person` }
    };
    graph.push(website);

    // --- 3. ProfilePage ---
    const profilePage = {
        '@type': 'ProfilePage',
        '@id': `${SITE_URL}/#profilepage`,
        url: SITE_URL,
        mainEntity: { '@id': `${SITE_URL}/#person` },
        about: { '@id': `${SITE_URL}/#person` }
    };
    graph.push(profilePage);

    // --- 4. FAQPage (GEO & AI search engine optimizer) ---
    if (faqList && faqList.length > 0) {
        const faqPage = {
            '@type': 'FAQPage',
            '@id': `${SITE_URL}/#faq`,
            mainEntity: faqList.map(item => ({
                '@type': 'Question',
                name: item.question,
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: item.answer
                }
            }))
        };
        graph.push(faqPage);
    }

    // --- 5. ItemList: Portfolio Projects (Google rich results for lists) ---
    if (projects && projects.length > 0) {
        graph.push({
            '@type': 'ItemList',
            '@id': `${SITE_URL}/#projectslist`,
            name: 'Portfolio Projects by Amit Kumar Yadav (AMIT)',
            description: 'Selected web, AI, and hardware development projects.',
            numberOfItems: projects.length,
            itemListElement: projects.map((p, i) => ({
                '@type': 'ListItem',
                position: i + 1,
                item: {
                    '@type': 'CreativeWork',
                    name: p.seoTitle || p.title,
                    description: p.seoDescription || p.description || '',
                    ...(p.url ? { url: p.url } : {}),
                    ...(p.githubUrl ? { sameAs: p.githubUrl } : {}),
                    creator: { '@id': `${SITE_URL}/#person` },
                    ...(p.techStack && p.techStack.length > 0 ? {
                        keywords: p.techStack.map(t => TECH_STACK_NAMES[t.split('/').pop()] || t).join(', ')
                    } : {}),
                }
            }))
        });

        // Individual CreativeWork entries for each project (richer detail)
        projects.forEach(p => {
            const projectSlug = p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
            graph.push({
                '@type': 'CreativeWork',
                '@id': `${SITE_URL}/#project-${projectSlug}`,
                name: p.seoTitle || p.title,
                description: p.seoDescription || p.description || '',
                ...(p.url ? { url: p.url } : {}),
                ...(p.githubUrl ? { sameAs: p.githubUrl } : {}),
                creator: { '@id': `${SITE_URL}/#person` },
                ...(p.techStack && p.techStack.length > 0 ? {
                    keywords: p.techStack.map(t => TECH_STACK_NAMES[t.split('/').pop()] || t).join(', ')
                } : {}),
            });
        });
    }

    // --- 6. Studio Content (YouTube -> VideoObject, Blog -> Article, TikTok -> VideoObject) ---
    if (studio && studio.length > 0) {
        studio.forEach((s, idx) => {
            const studioSlug = `studio-item-${idx}`;
            if (s.platform === 'youtube') {
                let embedUrl = undefined;
                if (s.url) {
                    const ytMatch = s.url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^"&?\/\s]{11})/);
                    if (ytMatch && ytMatch[1]) {
                        embedUrl = `https://www.youtube.com/embed/${ytMatch[1]}`;
                    }
                }

                graph.push({
                    '@type': 'VideoObject',
                    '@id': `${SITE_URL}/#${studioSlug}`,
                    name: s.seoTitle || s.title,
                    description: s.seoDescription || s.description || '',
                    url: s.url || undefined,
                    contentUrl: s.url || undefined,
                    ...(embedUrl ? { embedUrl } : {}),
                    thumbnailUrl: s.thumbnailUrl || `${SITE_URL}/og-image.webp`,
                    ...(s.duration ? { duration: `PT${s.duration.replace(':', 'M')}S` } : {}),
                    ...(s.date ? { uploadDate: formatIsoDate(s.date) } : {}),
                    ...(s.views ? { interactionStatistic: { '@type': 'InteractionCounter', interactionType: 'https://schema.org/WatchAction', userInteractionCount: s.views } } : {}),
                    author: { '@id': `${SITE_URL}/#person` },
                });
            } else if (s.platform === 'blog') {
                graph.push({
                    '@type': 'Article',
                    '@id': `${SITE_URL}/#${studioSlug}`,
                    headline: s.seoTitle || s.title,
                    description: s.seoDescription || s.description || '',
                    url: s.url || undefined,
                    image: s.thumbnailUrl || `${SITE_URL}/og-image.webp`,
                    ...(s.date ? { datePublished: formatIsoDate(s.date) } : {}),
                    ...(s.readTime ? { timeRequired: `PT${s.readTime.replace(' min', '')}M` } : {}),
                    author: { '@id': `${SITE_URL}/#person` },
                });
            } else if (s.platform === 'tiktok') {
                graph.push({
                    '@type': 'VideoObject',
                    '@id': `${SITE_URL}/#${studioSlug}`,
                    name: s.seoTitle || s.title,
                    description: s.seoDescription || s.description || '',
                    url: s.url || undefined,
                    contentUrl: s.url || undefined,
                    thumbnailUrl: s.thumbnailUrl || `${SITE_URL}/og-image.webp`,
                    ...(s.date ? { uploadDate: formatIsoDate(s.date) } : {}),
                    ...(s.views ? { interactionStatistic: { '@type': 'InteractionCounter', interactionType: 'https://schema.org/WatchAction', userInteractionCount: s.views } } : {}),
                    ...(s.likes ? { aggregateRating: { '@type': 'AggregateRating', ratingCount: s.likes } } : {}),
                    author: { '@id': `${SITE_URL}/#person` },
                });
            } else if (s.platform === 'instagram' || s.platform === 'x' || s.platform === 'linkedin') {
                graph.push({
                    '@type': 'SocialMediaPosting',
                    '@id': `${SITE_URL}/#${studioSlug}`,
                    headline: s.seoTitle || s.title,
                    description: s.seoDescription || s.description || '',
                    url: s.url || undefined,
                    image: s.thumbnailUrl || `${SITE_URL}/og-image.webp`,
                    ...(s.date ? { datePublished: formatIsoDate(s.date) } : {}),
                    ...(s.likes ? { interactionStatistic: { '@type': 'InteractionCounter', interactionType: 'https://schema.org/LikeAction', userInteractionCount: s.likes } } : {}),
                    author: { '@id': `${SITE_URL}/#person` },
                });
            } else if (s.platform === 'codrops' || s.platform === 'webapp' || s.platform === 'github') {
                graph.push({
                    '@type': s.platform === 'webapp' ? 'WebApplication' : s.platform === 'github' ? 'SoftwareSourceCode' : 'Article',
                    '@id': `${SITE_URL}/#${studioSlug}`,
                    ...(s.platform === 'codrops' ? { headline: s.seoTitle || s.title } : { name: s.seoTitle || s.title }),
                    description: s.seoDescription || s.description || '',
                    url: s.url || undefined,
                    image: s.thumbnailUrl || `${SITE_URL}/og-image.webp`,
                    ...(s.date ? { datePublished: formatIsoDate(s.date) } : {}),
                    author: { '@id': `${SITE_URL}/#person` },
                });
            }
        });
    }

    // --- 7. Awards as schema.org Award/CreativeWork ---
    if (awards && awards.length > 0) {
        const categoryLabels = { sotd: 'Site of the Day', sotm: 'Site of the Month', other: 'Honorable Mention' };
        graph.push({
            '@type': 'ItemList',
            '@id': `${SITE_URL}/#awardslist`,
            name: 'Web Design Awards received by Amit Kumar Yadav (AMIT)',
            numberOfItems: awards.length,
            itemListElement: awards.map((a, i) => ({
                '@type': 'ListItem',
                position: i + 1,
                item: {
                    '@type': 'CreativeWork',
                    name: `${categoryLabels[a.category] || a.category} — ${a.seoTitle || a.title}`,
                    ...(a.date ? { dateCreated: formatIsoDate(a.date) } : {}),
                    url: a.url || undefined,
                    description: a.seoDescription || undefined,
                    award: categoryLabels[a.category] || a.category,
                    creator: { '@id': `${SITE_URL}/#person` },
                }
            }))
        });
    }

    return {
        '@context': 'https://schema.org',
        '@graph': graph
    };
}

// Helper to generate the llms.txt content in clean Markdown
function buildLlmsTxt(globalInfo, projects, studio, awards, faqList) {
    const siteTitle = globalInfo?.siteTitle || 'Amit Kumar Yadav (AMIT) | Creative 3D Portfolio';
    const siteDescription = globalInfo?.siteDescription || 'Computer Science (AI & ML) student building interactive web applications, AI tools, and embedded hardware prototypes.';
    const aboutMe = globalInfo?.aboutMe || 'I am Amit Kumar Yadav (AMIT), a B.Tech CSE (AI & ML) Student & Developer.';

    let content = `# ${siteTitle}\n`;
    content += `> ${siteDescription}\n\n`;

    content += `## Biography / About Me\n`;
    content += `${aboutMe}\n\n`;

    content += `## Contact\n`;
    if (globalInfo?.email) content += `- Email: ${globalInfo.email}\n`;
    if (globalInfo?.githubUrl) content += `- GitHub: ${globalInfo.githubUrl}\n`;
    if (globalInfo?.linkedinUrl) content += `- LinkedIn: ${globalInfo.linkedinUrl}\n`;
    if (globalInfo?.instagramUrl) content += `- Instagram: ${globalInfo.instagramUrl}\n`;
    if (globalInfo?.redditUrl) content += `- Reddit: ${globalInfo.redditUrl}\n`;
    content += `\n`;

    content += `## Core Technologies & Skills\n`;
    content += `- C, Arduino (Mega/Uno), Tinkercad, Prototyping, AI & ML, React, Three.js, React Three Fiber (R3F), GSAP, WebGL.\n\n`;

    if (projects && projects.length > 0) {
        content += `## Selected Portfolio Projects\n`;
        projects.forEach(p => {
            const tech = p.techStack && p.techStack.length > 0
                ? ` (Tech: ${p.techStack.map(t => TECH_STACK_NAMES[t.split('/').pop()] || t).join(', ')})`
                : '';
            const links = [
                p.url ? `Live: ${p.url}` : null,
                p.githubUrl ? `GitHub: ${p.githubUrl}` : null,
            ].filter(Boolean).join(' | ');
            const linkSuffix = links ? ` (${links})` : '';
            content += `- **${p.seoTitle || p.title}**${p.subtitle ? ` (${p.subtitle})` : ''}: ${p.seoDescription || p.description || ''}${tech}${linkSuffix}\n`;
        });
        content += `\n`;
    }

    if (studio && studio.length > 0) {
        content += `## Studio Content & Publications\n`;
        studio.forEach(s => {
            content += `- [${s.seoTitle || s.title} (${s.platform})](${s.url || SITE_URL}): ${s.seoDescription || s.description || ''}\n`;
        });
        content += `\n`;
    }

    if (awards && awards.length > 0) {
        content += `## Design Awards & Achievements\n`;
        const categoryLabels = { sotd: 'Site of the Day', sotm: 'Site of the Month', other: 'Honorable Mention' };
        awards.forEach(a => {
            const category = categoryLabels[a.category] || a.category;
            content += `- **${category}** — [${a.seoTitle || a.title}](${a.url || SITE_URL}): Awarded on ${a.date || 'unknown'}. ${a.seoDescription || ''}\n`;
        });
        content += `\n`;
    }

    if (faqList && faqList.length > 0) {
        content += `## Frequently Asked Questions (FAQ)\n`;
        faqList.forEach(item => {
            content += `- **${item.question}**\n`;
            content += `  ${item.answer.replace(/\n/g, '\n  ')}\n`;
        });
    }

    return content;
}

export function generateSeoHtml() {
    let cachedLlmsContent = '';

    async function getLlmsContent() {
        if (!cachedLlmsContent) {
            const { globalInfo, projects, studio, awards, faqList } = getLocalSeoData();
            cachedLlmsContent = buildLlmsTxt(globalInfo, projects, studio, awards, faqList);
        }
        return cachedLlmsContent;
    }

    return {
        name: 'sanity-seo-plugin',

        // Serve llms.txt in local development mode
        configureServer(server) {
            server.middlewares.use(async (req, res, next) => {
                if (req.url === '/llms.txt') {
                    const content = await getLlmsContent();
                    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
                    res.end(content);
                } else {
                    next();
                }
            });
        },

        // This hook runs when Vite generates or serves index.html
        async transformIndexHtml(html) {
            try {
                const { globalInfo, projects, studio, awards, faqList } = getLocalSeoData();

                // Fallback values if globalInfo is not yet created
                const siteTitle = globalInfo?.siteTitle || 'Amit Kumar Yadav (AMIT) | Creative 3D Portfolio';
                const siteDescription = globalInfo?.siteDescription || 'Computer Science (AI & ML) student building interactive web applications, AI tools, and embedded hardware prototypes.';
                const aboutMe = globalInfo?.aboutMe || 'I am Amit Kumar Yadav (AMIT), a B.Tech CSE (AI & ML) Student & Developer.';
                const escapeAttr = (val) => String(val).replace(/"/g, '&quot;');

                // Cache llms.txt content for later bundle emission
                cachedLlmsContent = buildLlmsTxt(globalInfo, projects, studio, awards, faqList);

                // ====== PART 1: Build the semantic HTML string ======
                let seoHtml = `\n<div id="seo-content" class="sr-only-seo">\n`;
                
                seoHtml += `  <header>\n`;
                seoHtml += `    <h1>${siteTitle}</h1>\n`;
                seoHtml += `    <p>${siteDescription}</p>\n`;
                seoHtml += `  </header>\n`;

                seoHtml += `  <section id="about">\n`;
                seoHtml += `    <h2>About Me</h2>\n`;
                seoHtml += `    <p>${aboutMe}</p>\n`;
                if (globalInfo?.email) seoHtml += `    <a href="mailto:${globalInfo.email}">${globalInfo.email}</a>\n`;
                if (globalInfo?.githubUrl) seoHtml += `    <a href="${globalInfo.githubUrl}">GitHub</a>\n`;
                if (globalInfo?.linkedinUrl) seoHtml += `    <a href="${globalInfo.linkedinUrl}">LinkedIn</a>\n`;
                if (globalInfo?.redditUrl) seoHtml += `    <a href="${globalInfo.redditUrl}">Reddit</a>\n`;
                seoHtml += `  </section>\n`;

                if (projects && projects.length > 0) {
                    seoHtml += `  <section id="projects">\n    <h2>Projects</h2>\n    <ul>\n`;
                    projects.forEach(p => {
                        seoHtml += `      <li>\n        <h3>${p.seoTitle || p.title}${p.subtitle ? ` — ${p.subtitle}` : ''}</h3>\n        <p>${p.seoDescription || p.description || ''}</p>\n        ${p.url ? `<a href="${p.url}">Visit ${p.seoTitle || p.title}</a>\n` : ''}${p.githubUrl ? `        <a href="${p.githubUrl}">GitHub</a>\n` : ''}      </li>\n`;
                    });
                    seoHtml += `    </ul>\n  </section>\n`;
                }

                if (studio && studio.length > 0) {
                    seoHtml += `  <section id="studio">\n    <h2>The Studio (Content)</h2>\n    <ul>\n`;
                    studio.forEach(s => {
                        seoHtml += `      <li>\n        <h3>${s.seoTitle || s.title} (${s.platform})</h3>\n        <p>${s.seoDescription || s.description || ''}</p>\n        ${s.url ? `<a href="${s.url}">View Content</a>\n` : ''}      </li>\n`;
                    });
                    seoHtml += `    </ul>\n  </section>\n`;
                }

                if (awards && awards.length > 0) {
                    seoHtml += `  <section id="awards">\n    <h2>Awards & Certificates</h2>\n    <ul>\n`;
                    awards.forEach(a => {
                        seoHtml += `      <li>\n        <h3>${a.seoTitle || a.title}</h3>\n        <p>${a.category} - ${a.date}</p>\n        <p>${a.seoDescription || ''}</p>\n        ${a.url ? `<a href="${a.url}">Link</a>\n` : ''}      </li>\n`;
                    });
                    seoHtml += `    </ul>\n  </section>\n`;
                }

                // FAQ Section (GEO/AI search optimizer fallback)
                if (faqList && faqList.length > 0) {
                    seoHtml += `  <section id="faq">\n`;
                    seoHtml += `    <h2>Frequently Asked Questions (FAQ)</h2>\n`;
                    faqList.forEach(item => {
                        seoHtml += `    <article>\n`;
                        seoHtml += `      <h3>${item.question}</h3>\n`;
                        seoHtml += `      <p>${item.answer}</p>\n`;
                        seoHtml += `    </article>\n`;
                    });
                    seoHtml += `  </section>\n`;
                }

                seoHtml += `</div>\n`;

                // ====== PART 2: Build dynamic JSON-LD ======
                const jsonLdSchemas = buildJsonLd(globalInfo, projects, studio, awards, faqList);
                const jsonLdScript = `\n  <!-- Dynamic Structured Data (JSON-LD) — generated from Sanity at build time -->\n  <script type="application/ld+json">\n${JSON.stringify(jsonLdSchemas, null, 2)}\n  </script>\n`;

                // ====== PART 3: Transform HTML ======
                // Update the <title> tag
                let transformedHtml = html.replace(
                    /<title>(.*?)<\/title>/,
                    `<title>${siteTitle}</title>`
                );
                
                // Add or replace meta description
                if (transformedHtml.includes('<meta name="description"')) {
                    transformedHtml = transformedHtml.replace(
                        /<meta\s+name="description"[\s\S]*?content="[^"]*"\s*\/?>/i,
                        `<meta name="description" content="${escapeAttr(siteDescription)}" />`
                    );
                } else {
                    transformedHtml = transformedHtml.replace(
                        '</head>',
                        `  <meta name="description" content="${escapeAttr(siteDescription)}" />\n</head>`
                    );
                }

                // Update Open Graph dynamic metadata
                transformedHtml = transformedHtml
                    .replace(
                        /<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/i,
                        `<meta property="og:title" content="${escapeAttr(siteTitle)}" />`
                    )
                    .replace(
                        /<meta\s+property="og:description"[\s\S]*?content="[^"]*"\s*\/?>/i,
                        `<meta property="og:description" content="${escapeAttr(siteDescription)}" />`
                    );

                // Update Twitter card dynamic metadata
                transformedHtml = transformedHtml
                    .replace(
                        /<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/?>/i,
                        `<meta name="twitter:title" content="${escapeAttr(siteTitle)}" />`
                    )
                    .replace(
                        /<meta\s+name="twitter:description"[\s\S]*?content="[^"]*"\s*\/?>/i,
                        `<meta name="twitter:description" content="${escapeAttr(siteDescription)}" />`
                    );

                // Inject dynamic JSON-LD right before </head> (next to the existing static one)
                transformedHtml = transformedHtml.replace('</head>', `${jsonLdScript}</head>`);

                // Replace the static placeholder with the dynamic one to prevent duplicate #seo-content and double h1s
                if (transformedHtml.includes('id="seo-content"')) {
                    transformedHtml = transformedHtml.replace(
                        /<div id="seo-content" class="sr-only-seo">[\s\S]*?<\/div>/,
                        seoHtml
                    );
                } else {
                    // Fallback injection if the template doesn't contain the static block
                    transformedHtml = transformedHtml.replace('</body>', `${seoHtml}</body>`);
                }

                return transformedHtml;
            } catch (error) {
                console.error('SEO Plugin Error: Failed to generate local SEO metadata', error);
                // Return original HTML on failure so we don't break the build
                return html;
            }
        },

        // Emit llms.txt to the build output directory
        async generateBundle() {
            const content = await getLlmsContent();
            this.emitFile({
                type: 'asset',
                fileName: 'llms.txt',
                source: content
            });
        }
    };
}
