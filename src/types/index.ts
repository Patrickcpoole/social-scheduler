export type PostType = {
  id: string;
  date: Date;
  title: string;
  content: string;
  imageUrl?: string;
  videoUrl?: string;
  frequency?: "once" | "daily" | "weekly" | "biweekly" | "monthly";
  status?: PostStatus;
};

export type PostStatus =
  | "all"
  | "drafts"
  | "scheduled"
  | "published"
  | "deleted";

export type Tab = {
  label: string;
  value: PostStatus;
};
