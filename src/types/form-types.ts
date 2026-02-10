export type CategoryFormData = {
  color: string;
};
export type TagFormData = {
  name: string;
};

export interface AdsFormData {
  name: string;
  placement: string;
  target_url: string;
  start_date: string;
  end_date: string;
  image: FileList;
  status: boolean;
}

export interface ArticleFormData {
  title: string;
  content: string;
  category_slug: string;
  image?: FileList;
  status: string;
  pewarta: string;
  image_description: string;
  top_article: boolean;
  popular_article: boolean;
}

export interface AdsUpdateStatusFormData {
  name: string;
  placement: string;
  target_url: string;
  start_date: string;
  end_date: string;
  image: FileList;
  status: string;
}

export interface UserFormData {
  username: string;
  email: string;
  role: string;
  phone_number: number | null;
}
