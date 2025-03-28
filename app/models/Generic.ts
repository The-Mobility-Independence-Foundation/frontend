import { toast } from "sonner";

export interface PostError {
  success: boolean,
  message: string | null,
  data: {
    code: string,
    errors: {
      [key: string]: {
        constraints: string[],
        message: string[],
        value: string
      }
    }
  }
}

export function toastErrors(error: PostError) {
  const errorKeys = Object.keys(error.data.errors);
  errorKeys.forEach(key => {
    const messages = error.data.errors[key].message;
    messages.forEach(message => {
      toast(message);
    });
  })
}