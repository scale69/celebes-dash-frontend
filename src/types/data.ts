export interface ArticlesResponse {
  count: number;
  next: string;
  previous: null;
  results: ResultArtilce[];
}

export interface UserResponse {
  next: null;
  previous: null;
  results?: User[];
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  phone_number: number;
}

export interface ResultArtilce {
  id: string;
  editor: string;
  author: Author;
  pewarta: string;
  category: Category;
  tags: Tag[];
  created_at: Date;
  updated_at: Date;
  title: string;
  slug: string;
  content: string;
  status: string;
  image: null | string;
  image_description: string;
}

export interface Author {
  username: string;
  role: string;
}

export interface Category {
  id: string;
  name: string;
  children: ChildrenCategory[];
  color: string;
  slug: string;
}
export interface ChildrenCategory {
  id: string;
  name: string;
  color: string;
  slug: string;
}

export interface Tag {
  id: string;
  created_at: Date;
  updated_at: Date;
  name: string;
  slug: string;
  articles: ResultArtilce[];
}

export type DeletePayload = {
  url: string;
  data?: any;
};

export interface BackendError {
  status?: number;
  data?: {
    detail?: string;
    [key: string]: any;
  };
  message?: string;
}

export interface Ads {
  id: string;
  created_at: Date;
  updated_at: Date;
  name: string;
  placement: string;
  target_url: string;
  start_date: string;
  end_date: string;
  image: string;
  status: boolean;
}

export interface PropsData {
  data: {
    count: number;
    next: string | null;
    previous: string | null;
  };
}
