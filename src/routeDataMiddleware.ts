import {
  defineRouteMiddleware,
  type StarlightRouteData,
} from '@astrojs/starlight/route-data';
import Slugger from 'github-slugger';
import type { CatalogType } from './content/schemas';
import type { APIContext } from 'astro';

export const onRequest = defineRouteMiddleware((context) => {
  usePageTitleInTOC(context.locals.starlightRoute);

  const route = context.locals.starlightRoute;

  const sections = route.entry.data.sections;

  const pathSegments = context.url.pathname.split('/').filter(Boolean);
  const currentId = pathSegments.at(-1) ?? '';
  updateSitePage(context);

  // handle sections in the frontmatter to generate a table of contents for the page(MDX)
  if (sections) {
    const slugger = new Slugger();
    const items = sections.map((section) => ({
      depth: 2,
      text: section.title,
      slug: slugger.slug(section.title),
      children: [],
    }));

    route.toc = {
      ...(route.toc ?? {
        minHeadingLevel: 2,
        maxHeadingLevel: 2,
        items: [],
      }),
      items: [...(route.toc?.items ?? []), ...items],
    };
  }

  // handle children of the table of contents to flatten the structure and make it easier to navigate(MD)
  if (route.toc) {
    const items = route.toc.items;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.children.length > 0) {
        const children = item.children.map((child) => ({
          ...child,
          depth: 2,
          children: [],
        }));

        items.splice(i + 1, 0, ...children);
        item.children = [];
        i += children.length;
      }
    }
  }

  if (Number(currentId) && Number(currentId) != 404) {
    renderSideBar(route, context.locals.catalogs, currentId);
  }
});

function updateSitePage(context: APIContext) {
  const currentURI = context.url.pathname;

  if (currentURI.includes('magazine') || currentURI.includes('markdownpage')) {
    context.locals.starlightRoute.siteTitle += ' Demo';
  }
  if (currentURI.includes('zgjjjc')) {
    context.locals.starlightRoute.siteTitle = '《中国纪检监察》';
  }
  if (currentURI.includes('cpaj')) {
    context.locals.starlightRoute.siteTitle = '《中国行政管理》';
  }
}

function usePageTitleInTOC(starlightRoute: StarlightRouteData) {
  const overviewLink = starlightRoute.toc?.items[0];
  if (overviewLink) {
    overviewLink.text = '概览';
  }
}

function renderSideBar(
  starlightRoute: StarlightRouteData,
  catalogs: CatalogType,
  id: string,
) {
  starlightRoute.sidebar = catalogs.map((catalog) => ({
    type: 'group',
    label: catalog.label,
    entries: catalog.items.map((item) => ({
      type: 'link',
      label: item.label,
      href: item.link,
      isCurrent: item.link.endsWith(id),
      badge: undefined,
      attrs: {},
    })),
    collapsed: false,
    badge: undefined,
  }));
}
