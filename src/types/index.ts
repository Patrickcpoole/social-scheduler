export type PostType = {
  id: string;
  date: Date;
  caption: string;
  referenceTitle: string;
  imageUrl?: string;
  videoUrl?: string;
  frequency?: "once" | "daily" | "weekly" | "biweekly" | "monthly";
  frequencyRange?: Date;
  status: PostStatus;
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
