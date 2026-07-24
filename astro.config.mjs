// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightThemeGalaxy from 'starlight-theme-galaxy';

// https://astro.build/config
export default defineConfig({
  site: 'https://sgalcheung.github.io',
  base: '/starmgz',
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
          label: 'Dynamic',
          items: [{ autogenerate: { directory: 'dynamic' } }],
        },
        {
          label: 'Static',
          items: [{ autogenerate: { directory: 'static' } }],
        },
        {
          label: 'StarlightPage',
          items: [
            {
              label: '2026年第14期',
              link: '/magazine/',
            },
          ],
        },
      ],
      customCss: ['./src/styles/magazine.css'],
      plugins: [starlightThemeGalaxy()],
      routeMiddleware: './src/routeDataMiddleware.ts',
    }),
  ],
});
