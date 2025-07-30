import { z } from 'zod';

export const uploadFileRequestSchema = z.object({
  body: z.object({}),
  query: z.object({}),
  params: z.object({}),
});

export const getFileRequestSchema = z.object({
  body: z.object({}),
  query: z.object({}),
  params: z.object({
    fileName: z.string().min(1, 'fileName is required'),
  }),
});
