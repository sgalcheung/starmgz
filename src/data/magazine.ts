import { z } from 'astro/zod';
import { AuthorSchema } from './author';
import { reference } from 'astro:content';

/**
 * 单篇文章
 */
export const MagazineItemSchema = z.object({
  // 页码
  page: z.number().or(z.string()),

  // 标题
  title: z.string(),

  // 作者（可选）n:n
  // use reference: https://docs.astro.build/en/guides/content-collections/#defining-collection-references
  authors: z.array(reference('authors')).default([]),

  // 跳转链接
  link: z.string().optional(),
});

/**
 * 栏目
 */
export const MagazineSectionSchema = z.object({
  // 栏目标题
  title: z.string(),

  // 栏目副标题（文章总标题）
  subTitle: z.string().optional(),

  // 栏目文章
  items: z.array(MagazineItemSchema),
});

/**
 * 一期杂志
 */
export const MagazineIssueSchema = z.object({
  id: z.string(),
  // 年份
  year: z.number(),

  // 期数
  issueNo: z.number(),

  // 卷号（总期号）
  volumeNo: z.number(),

  // 发布日期
  publishDate: z.coerce.date(),

  // 杂志目录
  sections: z.array(MagazineSectionSchema),
});

/**
 * 整本杂志
 */
export const MagazineSchema = z.array(MagazineIssueSchema);

export type MagazineItem = z.infer<typeof MagazineItemSchema>;

export type MagazineSection = z.infer<typeof MagazineSectionSchema>;

export type MagazineIssue = z.infer<typeof MagazineIssueSchema>;

export type Magazine = z.infer<typeof MagazineSchema>;
