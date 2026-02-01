import { z } from 'zod';

export const createPostSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required'),
    content: z.string().optional(),
    published: z.boolean().optional(),
  }),
});

export const updatePostSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required').optional(),
    content: z.string().optional(),
    published: z.boolean().optional(),
  }),
});

export const getPostsSchema = z.object({
  query: z.object({
    published: z.string().optional(),
    page: z.string().optional(),
    limit: z.string().optional(),
  }),
});
