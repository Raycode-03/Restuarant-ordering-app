import { z } from 'zod';

export const restaurantSettingsSchema = z.object({
  id: z.string(),
  table_count: z.number().int().min(1).optional(),
  order_code: z.number().int().optional(),
  accepting_orders: z.boolean().optional(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export const apiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    data: dataSchema.optional(),
    error: z.string().optional(),
  });

export type RestaurantSettings = z.infer<typeof restaurantSettingsSchema>;
export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};
