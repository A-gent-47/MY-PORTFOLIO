/**
 * Studio Content Data
 *
 * Contains showcase items for the Studio monitor tower.
 * Device shapes ('tv', 'monitor', 'phone') temporarily reuse existing textures in /textures/studio/.
 */

export const PLATFORM_CONFIG = {
    webapp: {
        color: '#1a1a1a',
        accentColor: '#333333',
        icon: '🌐',
        label: 'Live Web App',
        shape: 'tv',
    },
    github: {
        color: '#24292e',
        accentColor: '#111111',
        icon: '💻',
        label: 'GitHub',
        shape: 'monitor',
    },
    linkedin: {
        color: '#0077B5',
        accentColor: '#005E93',
        icon: 'in',
        label: 'LinkedIn',
        shape: 'phone',
    },
    youtube: {
        color: '#FF0000',
        accentColor: '#cc0000',
        icon: '▶',
        label: 'YouTube',
        shape: 'tv',
    },
    blog: {
        color: '#4A90D9',
        accentColor: '#2d6cb5',
        icon: '📝',
        label: 'Blog',
        shape: 'monitor',
    },
    tiktok: {
        color: '#00F2EA',
        accentColor: '#FF0050',
        icon: '🎵',
        label: 'TikTok',
        shape: 'phone',
    },
    instagram: {
        color: '#E1306C',
        accentColor: '#C13584',
        icon: '📷',
        label: 'Instagram',
        shape: 'phone',
    },
    x: {
        color: '#000000',
        accentColor: '#14171A',
        icon: '𝕏',
        label: 'X (Twitter)',
        shape: 'monitor',
    },
    codrops: {
        color: '#0099FF',
        accentColor: '#0077CC',
        icon: '💧',
        label: 'Codrops',
        shape: 'monitor',
    },
};

const RAW_CONTENT_DATA = [
    {
        id: 'studio-knightfall',
        platform: 'webapp',
        device: 'tv',
        title: 'KNIGHTFALL — Chess Platform',
        description: 'Interactive chess platform featuring a built-in tactical puzzle library, multi-difficulty bots with distinct personalities and playstyles, move-by-move mistake analysis, and custom themes.',
        frontTexture: '/textures/studio/tvfront_filmikprojektdlamultiego.webp',
        paintedFrontTexture: '/textures/studio/tvfront_filmikprojektdlamultiego_painted.webp',
        thumbnail: null,
        url: 'https://knightfall-chess-zeta.vercel.app/',
        date: '2026-11-01',
    },
    {
        id: 'studio-synthwave',
        platform: 'webapp',
        device: 'tv',
        title: 'SYNTHWAVE — Music Visualizer',
        description: 'Interactive audio-reactive music visualizer delivering an immersive synthwave visual experience directly in the browser.',
        frontTexture: '/textures/studio/tvfront_filmikedytowaniezdjec.webp',
        paintedFrontTexture: '/textures/studio/tvfront_filmikedytowaniezdjec_painted.webp',
        thumbnail: null,
        url: 'https://synthwave-pied.vercel.app/',
        date: '2026-10-15',
    },
    {
        id: 'studio-github',
        platform: 'github',
        device: 'monitor',
        title: 'GitHub — Code & Hardware Builds (KisanSetu SIH 2026 & Smart Access Door)',
        description: 'Explore repositories and engineering builds including KisanSetu (SIH26032) crop procurement platform, Smart Access Door (Arduino Mega), and Arduino Circuit Lab prototypes.',
        frontTexture: '/textures/studio/monitorfront_postnafbdoublewinner.webp',
        paintedFrontTexture: '/textures/studio/monitorfront_postnafbdoublewinner_painted.webp',
        thumbnail: null,
        url: 'https://github.com/A-gent-47',
        date: '2026-11-15',
    },
    {
        id: 'studio-linkedin',
        platform: 'linkedin',
        device: 'phone',
        title: 'Connect on LinkedIn',
        description: 'Connect with Amit Kumar Yadav (AMIT) — B.Tech CSE (AI/ML) Student & Developer at Karnavati University (UIT), Gandhinagar.',
        frontTexture: '/textures/studio/phonefront_followmeontiktok.webp',
        paintedFrontTexture: '/textures/studio/phonefront_followmeontiktok_painted.webp',
        thumbnail: null,
        url: 'https://www.linkedin.com/in/amit-yadav-990768447',
        date: '2026-11-20',
    },
];

const ytTextures = ['/textures/studio/tvfront_filmikprojektdlamultiego.webp', '/textures/studio/tvfront_filmikedytowaniezdjec.webp'];
const ytPaintedTextures = ['/textures/studio/tvfront_filmikprojektdlamultiego_painted.webp', '/textures/studio/tvfront_filmikedytowaniezdjec_painted.webp'];
const blogTextures = ['/textures/studio/monitorfront_postnafbdoublewinner.webp'];
const blogPaintedTextures = ['/textures/studio/monitorfront_postnafbdoublewinner_painted.webp'];
const ttTextures = ['/textures/studio/phonefront_followmeontiktok.webp'];
const ttPaintedTextures = ['/textures/studio/phonefront_followmeontiktok_painted.webp'];

let ytIdx = 0, blogIdx = 0, ttIdx = 0;
let ytPIdx = 0, blogPIdx = 0, ttPIdx = 0;

export const CONTENT_DATA = RAW_CONTENT_DATA.map((item) => {
    const shape = item.device || PLATFORM_CONFIG[item.platform]?.shape || 'monitor';
    return {
        ...item,
        frontTexture: item.frontTexture || (
            shape === 'tv' ? ytTextures[ytIdx++ % ytTextures.length] :
                shape === 'monitor' ? blogTextures[blogIdx++ % blogTextures.length] :
                    ttTextures[ttIdx++ % ttTextures.length]
        ),
        paintedFrontTexture: item.paintedFrontTexture || (
            shape === 'tv' ? ytPaintedTextures[ytPIdx++ % ytPaintedTextures.length] :
                shape === 'monitor' ? blogPaintedTextures[blogPIdx++ % blogPaintedTextures.length] :
                    ttPaintedTextures[ttPIdx++ % ttPaintedTextures.length]
        )
    };
});

// Helper to get content by platform
export const getContentByPlatform = (platform) => {
    if (platform === 'all') return CONTENT_DATA;
    return CONTENT_DATA.filter(item => item.platform === platform);
};

// Get latest content (for "On Air" indicator)
export const getLatestContent = () => {
    return [...CONTENT_DATA].sort((a, b) => new Date(b.date) - new Date(a.date))[0];
};
