export interface Author {
  id: number;
  full_name: string;
}

export interface Review {
  id: number;
  user_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

export interface NoteListResponse {
  id: number;
  title: string;
  description: string;
  price: number;
  discounted_price: number | null;
  preview_pdf: string | null;
  author: Author | null;
  average_rating: number;
  total_reviews: number;
  created_at: string;
}

export interface NoteDetailResponse extends NoteListResponse {
  main_pdf: string | null;
  is_unlocked: boolean;
  syllabus: any; // Or specific interface if structured
  reviews: Review[];
}
