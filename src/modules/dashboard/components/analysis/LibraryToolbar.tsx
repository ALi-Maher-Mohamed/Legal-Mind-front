'use client';

import { Grid, List, Search } from 'lucide-react';
import { analysisCopy as c } from '../../data/analysisCopy';
import { dashPanel } from '../../lib/panelStyles';

type Props = {
  searchQuery: string;
  onSearch: (value: string) => void;
  filterType: string;
  onFilter: (value: string) => void;
  isListView: boolean;
  onToggleView: (list: boolean) => void;
};

export default function LibraryToolbar({
  searchQuery,
  onSearch,
  filterType,
  onFilter,
  isListView,
  onToggleView,
}: Props) {
  return (
    <div
      className={`${dashPanel} flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between`}
    >
      <div className="relative w-full sm:max-w-xs">
        <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearch(e.target.value)}
          placeholder={c.searchPlaceholder}
          className="w-full rounded-lg border border-brand/15 bg-[#f0f4ff] py-2 ps-9 pe-3 text-xs text-foreground placeholder:text-muted focus:border-brand focus:outline-none dark:border-white/10 dark:bg-white/5"
        />
      </div>

      <div className="flex w-full items-center justify-between gap-3 sm:w-auto sm:justify-end">
        <select
          value={filterType}
          onChange={(e) => onFilter(e.target.value)}
          className="rounded-lg border border-brand/15 bg-white px-3 py-2 text-xs text-foreground focus:border-brand focus:outline-none dark:border-white/10 dark:bg-white/5"
        >
          <option value="ALL">{c.allTypes}</option>
          <option value="NDA">{c.typeNda}</option>
          <option value="Employment">{c.typeEmployment}</option>
          <option value="Service Agreement">{c.typeService}</option>
          <option value="Brief">{c.typeBrief}</option>
        </select>

        <div className="flex shrink-0 overflow-hidden rounded-lg border border-brand/15 dark:border-white/10">
          <button
            type="button"
            onClick={() => onToggleView(false)}
            className={`p-2 cursor-pointer ${!isListView ? 'bg-brand text-on-brand' : 'bg-white text-muted dark:bg-white/5'}`}
            aria-label="شبكة"
          >
            <Grid className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => onToggleView(true)}
            className={`p-2 cursor-pointer ${isListView ? 'bg-brand text-on-brand' : 'bg-white text-muted dark:bg-white/5'}`}
            aria-label="قائمة"
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
