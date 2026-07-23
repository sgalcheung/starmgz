import {
  defineRouteMiddleware,
  type StarlightRouteData,
} from '@astrojs/starlight/route-data';
import Slugger from 'github-slugger';

export const onRequest = defineRouteMiddleware((context) => {
  usePageTitleInTOC(context.locals.starlightRoute);
  
  const route = context.locals.starlightRoute;

  const sections = route.entry.data.sections;

  if (!sections) {
    return;
  }

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
});

export function usePageTitleInTOC(starlightRoute: StarlightRouteData) {
  const overviewLink = starlightRoute.toc?.items[0];
  if (overviewLink) {
    overviewLink.text = '概览';
  }
}
