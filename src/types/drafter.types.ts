export type DraftOutputLang = 'Arabic' | 'English' | 'Bilingual';

export type TemplateVariable = {
  name: string;
  label: string;
  type: 'text' | 'select';
  placeholder?: string;
  options?: string[];
};

export type ContractTemplate = {
  id: string;
  name: string;
  description: string;
  category: string;
  language: DraftOutputLang;
  variables: TemplateVariable[];
};

export type PromptExample = {
  label: string;
  text: string;
};

export type ApprovedClause = {
  title: string;
  type: string;
  text: string;
};

export type DraftVersion = {
  v: string;
  date: string;
  content: string;
};

export type DrafterViewMode = 'library' | 'wizard' | 'editor';
