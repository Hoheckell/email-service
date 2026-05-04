import { PostStatus } from "../../enums/post-status.enum";

export interface IPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string | null;
  coverImage?: string | null;
  status: PostStatus;
  createdAt: Date;
  updatedAt?: Date | null;
  publishedAt?: Date | null;
}