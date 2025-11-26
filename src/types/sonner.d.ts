// Type declarations for sonner library used in the project
declare module 'sonner' {
    interface ToastOptions {
        description?: string;
        duration?: number;
        // Add other options as needed
    }

    interface Toast {
        (message: string, options?: ToastOptions): string | number;
        success(message: string, options?: ToastOptions): string | number;
        error(message: string, options?: ToastOptions): string | number;
        info(message: string, options?: ToastOptions): string | number;
        warning(message: string, options?: ToastOptions): string | number;
    }

    export const toast: Toast;
}
