'use client';

import Link from 'next/link';
import {
  Bookmark,
  Pencil,
  Share2,
  Trash2,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { gazetteCopy as c } from '../../../data/gazetteCopy';

type Props = {
  blogId: string;
  bookmarked: boolean;
  isBookmarking: boolean;
  isSpeaking: boolean;
  isDeleting: boolean;
  canManage: boolean;
  onBookmark: () => void;
  onShare: () => void;
  onSpeech: () => void;
  onDelete: () => void;
};

export default function BlogDetailsActions({
  blogId,
  bookmarked,
  isBookmarking,
  isSpeaking,
  isDeleting,
  canManage,
  onBookmark,
  onShare,
  onSpeech,
  onDelete,
}: Props) {
  return (
    <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-[#e5e8ee] pt-6 dark:border-white/10">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={onBookmark}
          disabled={isBookmarking}
          className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-bold transition cursor-pointer ${
            bookmarked
              ? 'border-[#002045] bg-[#002045] text-white'
              : 'border-[#c4c6cf] bg-white text-[#002045] hover:border-[#002045] dark:border-white/15 dark:bg-white/5 dark:text-foreground'
          }`}
        >
          <Bookmark className={`h-3.5 w-3.5 ${bookmarked ? 'fill-current' : ''}`} />
          {bookmarked ? c.saved : c.save}
        </button>
        <button
          type="button"
          onClick={onShare}
          className="inline-flex items-center gap-2 rounded-full border border-[#c4c6cf] px-4 py-2 text-xs font-bold text-[#002045] hover:border-[#002045] dark:border-white/15 dark:text-foreground cursor-pointer"
        >
          <Share2 className="h-3.5 w-3.5" />
          {c.share}
        </button>
        <button
          type="button"
          onClick={onSpeech}
          className="inline-flex items-center gap-2 rounded-full border border-[#c4c6cf] px-4 py-2 text-xs font-bold text-[#002045] hover:border-[#002045] dark:border-white/15 dark:text-foreground cursor-pointer"
        >
          {isSpeaking ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
          {isSpeaking ? c.stopListen : c.listen}
        </button>
      </div>

      {canManage ? (
        <div className="flex items-center gap-2">
          <Link
            href={`/dashboard/gazette/create?edit=${blogId}`}
            className="inline-flex items-center gap-2 rounded-lg border border-[#c4c6cf] px-4 py-2 text-xs font-bold text-[#002045] dark:border-white/15 dark:text-foreground"
          >
            <Pencil className="h-3.5 w-3.5" />
            {c.edit}
          </Link>
          <button
            type="button"
            onClick={onDelete}
            disabled={isDeleting}
            className="inline-flex items-center gap-2 rounded-lg border border-danger/30 px-4 py-2 text-xs font-bold text-danger hover:bg-danger/5 disabled:opacity-50 cursor-pointer"
          >
            <Trash2 className="h-3.5 w-3.5" />
            {isDeleting ? c.deleting : c.delete}
          </button>
        </div>
      ) : null}
    </div>
  );
}
