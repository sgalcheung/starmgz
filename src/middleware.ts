import { defineMiddleware } from 'astro:middleware';
import type { CatalogType } from './content/schemas';
import { getCollection, type CollectionEntry } from 'astro:content';

type MagazineEntry = CollectionEntry<'zgjjjcs'> | CollectionEntry<'cpajs'>;
const catalogCache = new Map<string, CatalogType>();

// `context` and `next` are automatically typed
export const onRequest = defineMiddleware(async (context, next) => {
  const pathSegments = context.url.pathname.split('/').filter(Boolean);
  const currentPathPrefix =
    pathSegments.length > 1
      ? `/${pathSegments.slice(0, -1).join('/')}`
      : `/${pathSegments[0] ?? ''}`;

  if (
    !currentPathPrefix.includes('zgjjjc') &&
    !currentPathPrefix.includes('cpaj')
  ) {
    await next();
    return;
  }

  const magazineKey = pathSegments.at(-2);
  if (!magazineKey) return;

  if (catalogCache.has(magazineKey)) {
    const cachedCatalogs = catalogCache.get(magazineKey);
    if (cachedCatalogs) {
      context.locals.catalogs = cachedCatalogs;
      await next();
      return;
    }
  } else {
    const collectionName = currentPathPrefix.includes('zgjjjc')
      ? 'zgjjjcs'
      : currentPathPrefix.includes('cpaj')
        ? 'cpajs'
        : undefined;

    if (!collectionName) {
      await next();
      return;
    }

    const entries: MagazineEntry[] =
      collectionName === 'zgjjjcs'
        ? await getCollection('zgjjjcs')
        : await getCollection('cpajs');

    const grouped = groupBySafe<MagazineEntry, number>(
      entries,
      (entry) => entry.data.year,
    );

    const catalogs: CatalogType = Array.from(grouped, ([year, items]) => ({
      label: `${String(year)} 年`,
      items: items.map((item) => ({
        label: `${item?.data.year}年第${item?.data.issueNo}期`,
        link: `${currentPathPrefix}/${item.id}`,
      })),
    }));

    catalogCache.set(magazineKey, catalogs);
    context.locals.catalogs = catalogs;
  }

  await next();
});

/**
 * 类型安全的 Object.groupBy 包装器
 */
function groupBySafe<T, K extends PropertyKey>(
  items: T[],
  keyFn: (item: T) => K,
): Map<K, T[]> {
  const grouped = Object.groupBy(items, keyFn);
  const result = new Map<K, T[]>();

  // 使用 for...in 配合类型断言
  for (const key in grouped) {
    if (Object.prototype.hasOwnProperty.call(grouped, key)) {
      // 将字符串键转换为 K 类型
      const typedKey = key as unknown as K;
      result.set(typedKey, grouped[key] ?? []);
    }
  }

  return result;
}
