import { defineMiddleware } from 'astro:middleware';
import type { CatalogType } from './content/schemas';
import { getCollection } from 'astro:content';

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

// `context` and `next` are automatically typed
export const onRequest = defineMiddleware(async (context, next) => {

  let catalogs: CatalogType = [];

  const cacheData = context.locals.catalogs;

  if (cacheData) {
    catalogs = cacheData;
  } else {
    const zgjjjcsEntries = await getCollection('zgjjjcs');

    const pathSegments = context.url.pathname.split('/').filter(Boolean);
    const currentPathPrefix =
      pathSegments.length > 1
        ? `/${pathSegments.slice(0, -1).join('/')}`
        : `/${pathSegments[0] ?? ''}`;

    const grouped = groupBySafe(
      zgjjjcsEntries,
      (zgjjjcsEntry) => zgjjjcsEntry.data.year,
    );

    catalogs = Array.from(grouped, ([year, items]) => ({
      label: `${year} 年`,
      items: items.map((item) => ({
        label: `${item?.data.year}年第${item?.data.issueNo}期`,
        link: `${currentPathPrefix}/${item.id}`,
      })),
    }));
  }

  // console.log(catalogs[0].items);

  context.locals.catalogs = catalogs;

  await next();
});
