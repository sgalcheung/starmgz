import { defineCollection } from 'astro:content';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';
import { file } from 'astro/loaders';
import { z } from 'astro/zod';
import { MagazineIssueSchema, MagazineSectionSchema } from './data/magazine';
import { AuthorSchema } from './data/author';

const docs = defineCollection({
  loader: docsLoader(),
  schema: docsSchema({
    extend: z.object({
      // 期数
      issueNo: z.number().optional(),

      // 卷号（总期号）
      volumeNo: z.number().optional(),

      // 发布日期
      publishDate: z.date().optional(),

      // 杂志目录
      sections: z.array(MagazineSectionSchema).optional(),
    }),
  }),
});

const zgjjjcs = defineCollection({
  loader: file('./src/data/zgjjjcs.json'),
  schema: MagazineIssueSchema,
});

const cpajs = defineCollection({
  loader: file('./src/data/cpajs.json'),
  schema: MagazineIssueSchema,
});

const authors = defineCollection({
  loader: file('./src/data/authors.json'),
  schema: AuthorSchema,
})

export const collections = {
  docs,
  authors,
  zgjjjcs,
  cpajs,
};
