import { createClient } from '@sanity/client';
import { createImageUrlBuilder } from '@sanity/image-url';

const SANITY_PROJECT_ID = 'YOUR_PROJECT_ID';

export const isSanityConfigured =
    Boolean(SANITY_PROJECT_ID) && SANITY_PROJECT_ID !== 'YOUR_PROJECT_ID';

export const sanityClient = isSanityConfigured
    ? createClient({
        projectId: SANITY_PROJECT_ID,
        dataset: 'production',
        useCdn: true, // `false` dla środowiska dev, `true` dla produkcji żeby było szybciej
        apiVersion: '2024-03-01', // aktualna data API
    })
    : null;

const builder = sanityClient ? createImageUrlBuilder(sanityClient) : null;

// Funkcja pomocnicza do generowania adresów URL obrazków z Sanity
export const urlFor = (source) => (builder ? builder.image(source) : null);

// Funkcja pomocnicza do zamiany domeny Sanity na proxy w Cloudflare
export const getProxyUrl = (imageBuilder) => {
    if (!imageBuilder || typeof imageBuilder.url !== 'function') return null;
    const url = imageBuilder.url();
    if (url && typeof window !== 'undefined') {
        return url.replace('https://cdn.sanity.io', '/sanity-cdn');
    }
    return url;
};
