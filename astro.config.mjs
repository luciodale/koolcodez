// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from 'astro/config';


import react from '@astrojs/react';


import cloudflare from "@astrojs/cloudflare";


// https://astro.build/config
export default defineConfig({
    site: 'https://koolcodez.com',
    integrations: [mdx(), sitemap(), react()],

    markdown: {
        shikiConfig: {
            theme: 'vitesse-dark',
        },
    },

    vite: {
        plugins: [tailwindcss()],
    },

    adapter: cloudflare()
});