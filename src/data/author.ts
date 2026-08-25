import { z } from 'astro/zod';

/**
 * 作者对象 Schema
 * 用于缓存和校验作者的基本信息
 */
export const AuthorSchema = z.object({
  // 作者唯一标识（推荐，用于缓存键值）
  id: z.string(),

  // 作者姓名（基本信息）
  name: z.string().min(1, "作者姓名不能为空"),

  // 性别 (可选)
  gender: z.enum(['male', 'female', 'other', 'unknown']).optional(),

  // 年龄 (可选，限制为正整数)
  age: z.number().int().min(0).max(150).optional(),

  // 电子邮箱 (可选，使用 zod 内置的 email 格式校验)
  email: z.email("无效的邮箱格式").optional(),

  // 个人简介 URL (可选，使用 zod 内置的 url 格式校验)
  bioUrl: z.url("无效的个人简介 URL").optional(),

  // 头像 URL (可选，补充常用字段)
  avatarUrl: z.url("无效的头像 URL").optional(),
});

export type Author = z.infer<typeof AuthorSchema>;


// ==========================================
// 作者信息缓存机制
// ==========================================

/**
 * 作者缓存类
 * 用于在运行时缓存作者信息，避免重复创建或请求
 */
export class AuthorCache {
  private cache: Map<string, Author> = new Map();

  /**
   * 保存或更新作者信息
   */
  set(authorId: string, authorInfo: Author) {
    this.cache.set(authorId, authorInfo);
  }

  /**
   * 根据 ID 获取作者信息
   */
  get(authorId: string): Author | undefined {
    return this.cache.get(authorId);
  }

  /**
   * 根据姓名获取或创建作者（常用于快速构建并缓存）
   * @param name 作者姓名
   * @param partialInfo 其他可选的作者信息
   */
  getOrCreateByName(name: string, partialInfo: Omit<Partial<Author>, 'name'> = {}): Author {
    // 如果没有提供 id，则根据名称生成一个标准化的 id
    const id = partialInfo.id || `author_${name.replace(/\s+/g, '_').toLowerCase()}`;
    
    const existing = this.cache.get(id);
    if (existing) {
      return existing;
    }

    // 合并信息并进行 Zod 校验
    const newAuthorData: Author = { id, name, ...partialInfo };
    const validatedAuthor = AuthorSchema.parse(newAuthorData);
    
    this.cache.set(id, validatedAuthor);
    return validatedAuthor;
  }

  /**
   * 清空缓存
   */
  clear() {
    this.cache.clear();
  }

  /**
   * 获取所有已缓存的作者
   */
  getAll(): Author[] {
    return Array.from(this.cache.values());
  }
}

// 导出一个全局单例缓存实例（在 Astro 的同一 Node 进程中共享）
export const authorCache = new AuthorCache();
