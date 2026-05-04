export interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  created_at: string;
}

export interface ContentPiece {
  id: string;
  title: string;
  description?: string;
  content_type: 'video' | 'post' | 'story' | 'article';
  status: 'draft' | 'scheduled' | 'published' | 'archived';
  generated_content?: {
    variants?: ContentVariant[];
  };
  scheduled_for?: string;
  platforms: string[];
  performance_score?: number;
  created_at: string;
  updated_at: string;
}

export interface ContentVariant {
  variant_id: number;
  script: string;
  outline?: string;
  captions?: string;
  hashtags: string[];
}

export interface Trend {
  id: string;
  topic: string;
  platform: string;
  volume_score: number;
  velocity: 'rising' | 'stable' | 'declining';
  captured_at: string;
  metadata: Record<string, unknown>;
}

export interface CreatorInstruction {
  id: string;
  instruction_text: string;
  content_type?: string;
  context: Record<string, unknown>;
  urgency: 'low' | 'medium' | 'high' | 'urgent';
  read: boolean;
  created_at: string;
}

export interface Post {
  id: string;
  content_piece_id: string;
  platform: string;
  status: 'pending' | 'published' | 'failed';
  scheduled_at?: string;
  published_at?: string;
  engagement: {
    views?: number;
    likes?: number;
    shares?: number;
    comments?: number;
  };
}

export interface AnalyticsOverview {
  total_content_pieces: number;
  published: number;
  scheduled: number;
  drafts: number;
  total_posts: number;
  total_views: number;
  total_likes: number;
  total_shares: number;
  average_performance_score: number;
  ai_insights: string;
}

export interface PlatformStats {
  platforms: Record<string, {
    total_posts: number;
    published: number;
    pending: number;
    failed: number;
    total_views: number;
    total_likes: number;
    total_shares: number;
  }>;
}