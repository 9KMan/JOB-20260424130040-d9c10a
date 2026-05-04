'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { CreatorInstruction } from '@/types';
import { formatDate, getUrgencyColor } from '@/lib/utils';
import { Sparkles, Loader2, CheckCircle, XCircle, Bell } from 'lucide-react';
import InstructionCard from '@/components/InstructionCard';

export default function InstructionsPage() {
  const [instructions, setInstructions] = useState<CreatorInstruction[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    loadInstructions();
  }, []);

  const loadInstructions = async () => {
    try {
      const data = await api.instructions.list();
      setInstructions(data);
    } catch (error) {
      console.error('Failed to load instructions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      await api.instructions.generate();
      await loadInstructions();
    } catch (error) {
      console.error('Failed to generate instructions:', error);
    } finally {
      setGenerating(false);
    }
  };

  const handleMarkRead = async (id: string) => {
    try {
      await api.instructions.markRead(id);
      setInstructions((prev) =>
        prev.map((inst) => (inst.id === id ? { ...inst, read: true } : inst))
      );
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const handleMarkDone = async (id: string) => {
    try {
      await api.instructions.markDone(id);
      setInstructions((prev) => prev.filter((inst) => inst.id !== id));
    } catch (error) {
      console.error('Failed to mark as done:', error);
    }
  };

  const filteredInstructions = instructions.filter((inst) => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !inst.read;
    return inst.urgency === filter;
  });

  const urgencyOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
  const sortedInstructions = [...filteredInstructions].sort(
    (a, b) => urgencyOrder[a.urgency] - urgencyOrder[b.urgency]
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Creator Instructions</h1>
          <p className="text-text-secondary mt-1">AI-generated daily tasks based on your niche</p>
        </div>
        <button
          onClick={handleGenerate}
          disabled={generating}
          className="btn-primary flex items-center gap-2"
        >
          {generating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Generate New
            </>
          )}
        </button>
      </div>

      <div className="flex gap-2">
        {(['all', 'unread', 'urgent', 'high', 'medium', 'low'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === f
                ? 'bg-primary text-white'
                : 'bg-surface text-text-secondary hover:text-text'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="card animate-pulse">
              <div className="h-4 w-3/4 bg-surface rounded mb-3"></div>
              <div className="h-3 w-1/2 bg-surface rounded"></div>
            </div>
          ))}
        </div>
      ) : sortedInstructions.length === 0 ? (
        <div className="card text-center py-12">
          <Bell className="w-12 h-12 text-muted mx-auto mb-4" />
          <p className="text-text-secondary mb-4">No instructions found</p>
          <button onClick={handleGenerate} className="btn-primary">
            Generate Your First Instructions
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedInstructions.map((instruction) => (
            <InstructionCard
              key={instruction.id}
              instruction={instruction}
              onMarkRead={handleMarkRead}
              onMarkDone={handleMarkDone}
            />
          ))}
        </div>
      )}
    </div>
  );
}