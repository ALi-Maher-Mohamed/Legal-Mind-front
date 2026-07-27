import type { RegisterDraft } from '@/types/auth.types';

export function buildRegisterFormData(draft: RegisterDraft): FormData {
  const formData = new FormData();
  formData.append('fullName', draft.name.trim());
  formData.append('email', draft.email.trim());
  formData.append('password', draft.password);
  formData.append('officeName', draft.firmName.trim());
  formData.append('barAssociationNumber', draft.barId.trim());
  formData.append('teamSize', draft.teamSize);
  formData.append('phone', draft.phone.trim());

  if (draft.lawyerIdDocument) {
    formData.append('lawyerIdDocument', draft.lawyerIdDocument);
  }

  return formData;
}
