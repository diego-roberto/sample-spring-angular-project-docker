const key = '@project';
const checklistSavedOnWebKey = `${key}/checklistSavedOnWeb`;

export const setChecklistSavedOnWeb = (companyId: number, constructionId: number, answerId: number): void => {
  localStorage.setItem(`${checklistSavedOnWebKey}/${companyId}/${constructionId}/${answerId}`, JSON.stringify(true));
};

export const getChecklistSavedOnWeb = (companyId: number, constructionId: number, answerId: number): boolean => {
  return !!localStorage.getItem(`${checklistSavedOnWebKey}/${companyId}/${constructionId}/${answerId}`);
};
