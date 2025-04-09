import { toast } from "sonner";

export interface ErrorCallback {
  success: boolean;
  message: string | null;
  data: {
    code: string;
    errors: {
      [key: string]: {
        constraints: string[];
        message: string[];
        value: string;
      };
    };
  } | null;
  error: string | null;
}

export function toastErrors(error: ErrorCallback) {
  if (error.data) {
    const errorKeys = Object.keys(error.data.errors);
    errorKeys.forEach((key) => {
      const messages = error.data?.errors[key].message;
      messages?.forEach((message) => {
        toast(message);
      });
    });
  } else {
    toast("An error occurred");
  }
}

export interface PaginationData {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  nextCursor: string | null;
  previousCursor: string | null;
}
