import { z } from "zod";

export const achievementSchema = z.object({
  title: z.string().min(3, "Введите название"),
  description: z.string().min(10, "Описание должно быть подробнее"),
  event_id: z.string().uuid().optional().or(z.literal(""))
});

export const eventSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  event_type: z.enum(["олимпиада", "хакатон", "спорт", "конкурс", "другое"]),
  event_date: z.string().min(1),
  event_time: z.string().optional(),
  location: z.string().optional(),
  image_url: z.string().url().optional().or(z.literal(""))
});

export const newsSchema = z.object({
  title: z.string().min(3),
  content: z.string().min(10),
  image_url: z.string().url().optional().or(z.literal(""))
});
