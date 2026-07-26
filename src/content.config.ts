import { defineCollection } from 'astro:content';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';
import { file } from 'astro/loaders';
import { z } from 'astro/zod';

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
      sections: z
        .array(
          z.object({
            // 栏目标题
            title: z.string(),

            // 栏目文章
            items: z.array(
              z.object({
                // 页码
                page: z.number(),

                // 标题
                title: z.string(),

                // 作者
                author: z.string().optional(),

                // 跳转链接
                link: z.string().optional(),
              }),
            ),
          }),
        )
        .optional(),
    }),
  }),
});

const magazineSchema = z.object({
  // 年份
  year: z.number(),

  // 期数
  issueNo: z.number(),

  // 卷号（总期号）
  volumeNo: z.number(),

  // 发布日期
  publishDate: z.coerce.date(),

  // 杂志目录
  sections: z
    .array(
      z.object({
        // 栏目标题
        title: z.string(),

        // 栏目副标题（文章总标题）
        subTitle: z.string().optional(),

        // 栏目文章
        items: z.array(
          z.object({
            // 页码
            page: z.number().or(z.string()),

            // 标题
            title: z.string(),

            // 作者
            author: z.string().optional(),

            // 跳转链接
            link: z.string().optional(),
          }),
        ),
      }),
    )
    .optional(),
});

const zgjjjcs = defineCollection({
  loader: file('./src/data/zgjjjcs.json'),
  schema: magazineSchema,
});

const cpajs = defineCollection({
  loader: file('./src/data/cpajs.json'),
  schema: magazineSchema,
});

export const collections = {
  docs,
  zgjjjcs,
  cpajs,
};
