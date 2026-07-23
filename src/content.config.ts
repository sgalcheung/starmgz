import { defineCollection } from 'astro:content';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';
import { z } from 'astro/zod';

export const collections = {
  docs: defineCollection({
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
  }),
};
