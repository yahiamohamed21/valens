import { toast } from 'sonner';

export type ToastType = 'success' | 'error' | 'info';

export function showToast(message: string, type: ToastType = 'info'): void {
  switch (type) {
    case 'success':
      toast.success(message);
      break;
    case 'error':
      toast.error(message);
      break;
    default:
      toast(message);
  }
}

export function showConfirmToast(message: string, onConfirm: () => void): void {
  toast(message, {
    action: {
      label: 'Confirm',
      onClick: onConfirm,
    },
    cancel: {
      label: 'Cancel',
      onClick: () => {},
    },
    duration: 5000,
  });
}
