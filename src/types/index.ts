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

export type PostStatus = "draft" | "published";

export type Tab = {
  label: string;
  value: PostStatus | "all" | "scheduled" | "posted";
};
