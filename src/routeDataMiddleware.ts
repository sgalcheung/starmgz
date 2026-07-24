import {
  defineRouteMiddleware,
  type StarlightRouteData,
} from '@astrojs/starlight/route-data';
import Slugger from 'github-slugger';

export const onRequest = defineRouteMiddleware((context) => {
  usePageTitleInTOC(context.locals.starlightRoute);

  const route = context.locals.starlightRoute;

  const sections = route.entry.data.sections;

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
});

export function usePageTitleInTOC(starlightRoute: StarlightRouteData) {
  const overviewLink = starlightRoute.toc?.items[0];
  if (overviewLink) {
    overviewLink.text = '概览';
  }
}
