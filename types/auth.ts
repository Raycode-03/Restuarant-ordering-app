export type LoadingType = 'form' | 'google' | 'github' | null;

export interface AuthLoadingContextType {
  loadingType: LoadingType;
  setLoadingType: (type: LoadingType) => void;
}