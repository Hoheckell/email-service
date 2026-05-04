import { PostStatus } from "../../enums/post-status.enum";

export interface IPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string | null;
  coverImage?: string | null;
  status: PostStatus;
  created_at: Date;
  updated_at?: Date | null;
  published_at?: Date | null;
}