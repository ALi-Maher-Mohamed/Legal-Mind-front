'use client';

import { Suspense } from 'react';
import { ArrowRight, Save, Send } from 'lucide-react';
import { gazetteCopy as c } from '../data/gazetteCopy';
import { dashPageBg } from '../lib/panelStyles';
import { useCreateBlogForm } from '../hooks/useCreateBlogForm';
import CreateBlogHeader from '../components/gazette/create/CreateBlogHeader';
import CreateBlogContentPanel from '../components/gazette/create/CreateBlogContentPanel';
import CreateBlogMetaPanel from '../components/gazette/create/CreateBlogMetaPanel';
import CreateBlogCoverPanel from '../components/gazette/create/CreateBlogCoverPanel';

function CreateBlogForm() {
  const form = useCreateBlogForm();

  if (form.isLoading) {
    return (
      <div className={`min-h-screen ${dashPageBg} px-4 py-10`} dir="rtl">
        <div className="mx-auto h-[28rem] max-w-6xl animate-pulse rounded-2xl bg-white dark:bg-card" />
      </div>
    );
  }

  const submitLabel = form.isSubmitting
    ? c.saving
    : form.editId
      ? c.saveChanges
      : form.status === 'published'
        ? c.publishNow
        : c.saveDraft;

  return (
    <div className={`min-h-screen ${dashPageBg} px-4 py-6 sm:px-6 sm:py-8`} dir="rtl">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <button
          type="button"
          onClick={form.goBack}
          className="inline-flex w-fit items-center gap-2 text-sm font-medium text-muted transition hover:text-[#002045] cursor-pointer dark:hover:text-foreground"
        >
          <ArrowRight className="h-4 w-4" />
          {c.cancel}
        </button>

        <CreateBlogHeader title={form.pageTitle} subtitle={form.pageSubtitle} />

        {form.error ? (
          <div className="rounded-xl border border-danger/20 bg-danger/5 px-4 py-3 text-sm text-danger">
            {form.error}
          </div>
        ) : null}

        <form
          onSubmit={(e) => void form.submit(e)}
          className="grid grid-cols-1 gap-6 lg:grid-cols-12"
        >
          <div className="space-y-5 lg:col-span-8">
            <CreateBlogContentPanel
              title={form.title}
              content={form.content}
              onTitleChange={form.setTitle}
              onContentChange={form.setContent}
            />
          </div>

          <aside className="space-y-5 lg:col-span-4">
            <CreateBlogMetaPanel
              category={form.category}
              status={form.status}
              tags={form.tags}
              categories={form.categories}
              onCategoryChange={form.setCategory}
              onStatusChange={form.setStatus}
              onTagsChange={form.setTags}
            />

            <CreateBlogCoverPanel
              coverImage={form.coverImage}
              showCover={form.showCover}
              isUploading={form.isUploadingCover}
              onCoverChange={(value) => {
                form.setCoverImage(value);
                form.setCoverBroken(false);
              }}
              onCoverBroken={() => form.setCoverBroken(true)}
              onUploadFile={(file) => void form.uploadCover(file)}
              onClearCover={form.clearCover}
            />

            <div className="sticky bottom-4 lg:bottom-6">
              <button
                type="submit"
                disabled={form.isSubmitting}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#002045] py-3.5 text-sm font-bold text-white transition hover:opacity-90 disabled:opacity-50 cursor-pointer"
              >
                {form.status === 'published' ? (
                  <Send className="h-4 w-4" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                {submitLabel}
              </button>
            </div>
          </aside>
        </form>
      </div>
    </div>
  );
}

export default function CreateBlogScreen() {
  return (
    <Suspense
      fallback={
        <div className={`min-h-screen ${dashPageBg} px-4 py-10`} dir="rtl">
          <div className="mx-auto h-[28rem] max-w-6xl animate-pulse rounded-2xl bg-white dark:bg-card" />
        </div>
      }
    >
      <CreateBlogForm />
    </Suspense>
  );
}
