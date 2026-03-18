export type ToastType = "success" | "error";

export interface Toast {
  id: number;
  type: ToastType;
  message: string;
}

export interface ToastMessage {
  type: ToastType;
  message: string;
}

export interface ToastContextType {
  showToast: (toast: ToastMessage) => void;
}
