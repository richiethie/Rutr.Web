export class ApiError extends Error {
  status: number;
  path: string;

  constructor(status: number, path: string, message?: string) {
    super(message ?? `API ${status} for ${path}`);
    this.name = "ApiError";
    this.status = status;
    this.path = path;
  }
}

export function isNotFound(err: unknown): boolean {
  return err instanceof ApiError && err.status === 404;
}
