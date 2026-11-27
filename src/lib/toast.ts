"use client";

import { toast } from "sonner";
import { ApiError } from "@/lib/api/errors";

export function toastSuccess(message: string) {
  toast.success(message);
}

export function toastError(message: string, err?: unknown) {
  const detail =
    err instanceof ApiError
      ? err.message
      : err instanceof Error
        ? err.message
        : null;
  toast.error(detail && detail !== message ? `${message}: ${detail}` : message);
}

export function toastFromCatch(fallback: string, err: unknown) {
  toastError(fallback, err);
}
