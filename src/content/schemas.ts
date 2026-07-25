export interface CatalogType extends Array<{
  label: string;
  items: Array<{
    label: string;
    link: string;
  }>;
}> {}
