interface CatalogItem {
  label: string;
  link: string;
}

interface CatalogCategory {
  label: string;
  items: CatalogItem[];
}

export type CatalogType = CatalogCategory[];
