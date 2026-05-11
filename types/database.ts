export type UserRole = "admin" | "moderator" | "teacher" | "student";
export type AchievementStatus = "pending" | "approved" | "rejected";
export type EventType = "олимпиада" | "хакатон" | "спорт" | "конкурс" | "другое";

export type Profile = {
  id: string;
  full_name: string | null;
  group_name: string | null;
  role: UserRole;
  avatar_url: string | null;
  created_at: string;
};

export type Event = {
  id: string;
  title: string;
  description: string;
  event_type: EventType;
  event_date: string;
  event_time: string | null;
  location: string | null;
  image_url: string | null;
  created_by: string | null;
  created_at: string;
};

export type Achievement = {
  id: string;
  student_id: string;
  event_id: string | null;
  title: string;
  description: string;
  file_url: string | null;
  status: AchievementStatus;
  rejection_reason: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  created_at: string;
  profiles?: Pick<Profile, "full_name" | "group_name"> | null;
  events?: Pick<Event, "title"> | null;
};

export type News = {
  id: string;
  title: string;
  content: string;
  image_url: string | null;
  created_by: string | null;
  created_at: string;
};

export type GalleryItem = {
  id: string;
  title: string;
  image_url: string;
  event_id: string | null;
  created_at: string;
  events?: Pick<Event, "title"> | null;
};
