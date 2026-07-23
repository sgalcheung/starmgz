// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightThemeGalaxy from 'starlight-theme-galaxy';

// https://astro.build/config
export default defineConfig({
  integrations: [
    starlight({
      title: 'Star MGZ',
      social: [
        {
          icon: 'github',
          label: 'GitHub',
          href: 'https://github.com/withastro/starlight',
        },
      ],
      sidebar: [
        {
          label: 'Static',
          items: [{ autogenerate: { directory: 'static' } }],
        },
        {
          label: 'Dynamic',
          items: [{ autogenerate: { directory: 'dynamic' } }],
        },
      ],
      customCss: ['./src/styles/magazine.css'],
      plugins: [starlightThemeGalaxy()],
      routeMiddleware: './src/routeDataMiddleware.ts',
    }),
  ],
});
