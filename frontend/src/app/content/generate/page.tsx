'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';
import { Sparkles, Loader2 } from 'lucide-react';

const CONTENT_TYPES = [
  { value: 'video', label: 'Video', description: 'YouTube, TikTok, Reels' },
  { value: 'post', label: 'Post', description: 'Twitter, Instagram, LinkedIn' },
  { value: 'story', label: 'Story', description: 'Instagram, Snapchat' },
  { value: 'article', label: 'Article', description: 'Blog posts, Medium' },
];

const PLATFORMS = [
  { value: 'youtube', label: 'YouTube' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'twitter', label: 'Twitter' },
];

export default function GeneratePage() {
  const router = useRouter();
  const [topic, setTopic] = useState('');
  const [contentType, setContentType] = useState('video');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['youtube']);
  const [niche, setNiche] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const togglePlatform = (platform: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platform)
        ? prev.filter((p) => p !== platform)
        : [...prev, platform]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) {
      setError('Please enter a topic');
      return;
    }
    if (selectedPlatforms.length === 0) {
      setError('Please select at least one platform');
      return;
    }

    setError('');
    setLoading(true);

    try {
      await api.content.generate(topic, contentType, selectedPlatforms, niche || undefined);
      router.push('/content');
    } catch (err) {
      setError('Failed to generate content. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Generate Content</h1>
        <p className="text-text-secondary mt-1">Let AI create content variants for you</p>
      </div>

      <form onSubmit={handleSubmit} className="card space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Topic</label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g., Morning routine tips for productivity"
            className="input-field"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-3">Content Type</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {CONTENT_TYPES.map((type) => (
              <button
                key={type.value}
                type="button"
                onClick={() => setContentType(type.value)}
                className={cn(
                  'p-4 rounded-lg border text-left transition-all',
                  contentType === type.value
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-primary/50'
                )}
              >
                <p className="font-medium text-sm">{type.label}</p>
                <p className="text-xs text-muted mt-1">{type.description}</p>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-3">Platforms</label>
          <div className="flex flex-wrap gap-3">
            {PLATFORMS.map((platform) => (
              <button
                key={platform.value}
                type="button"
                onClick={() => togglePlatform(platform.value)}
                className={cn(
                  'px-4 py-2 rounded-lg border text-sm font-medium transition-all',
                  selectedPlatforms.includes(platform.value)
                    ? 'border-accent bg-accent/10 text-accent'
                    : 'border-border hover:border-accent/50'
                )}
              >
                {platform.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Your Niche (Optional)
          </label>
          <input
            type="text"
            value={niche}
            onChange={(e) => setNiche(e.target.value)}
            placeholder="e.g., Tech reviews, Lifestyle, Fitness"
            className="input-field"
          />
          <p className="text-xs text-muted mt-1">
            Helps AI personalize content for your audience
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full btn-primary py-3 flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Generate Content Variants
            </>
          )}
        </button>
      </form>
    </div>
  );
}