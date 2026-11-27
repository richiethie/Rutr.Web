"use client";

import { useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  useTransition,
  type DragEvent,
  type FormEvent,
} from "react";
import { DeleteButton } from "@/components/EntityForm";
import {
  createEvidenceUpload,
  deleteEvidence,
  setPhotoVisibility,
  updateEvidenceVisibility,
  type Photo,
} from "@/lib/api";
import { ApiError } from "@/lib/api/errors";

const MAX_BYTES = 12 * 1024 * 1024;

function readFileAsPreview(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Could not read image."));
    reader.readAsDataURL(file);
  });
}

export function EvidenceCreate({ jobId }: { jobId: string }) {
  const router = useRouter();
  const titleId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [companyCamId, setCompanyCamId] = useState("");
  const [customerVisible, setCustomerVisible] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const reset = useCallback(() => {
    setFile(null);
    setPreview(null);
    setCaption("");
    setCompanyCamId("");
    setCustomerVisible(false);
    setError(null);
    setDragging(false);
    if (inputRef.current) inputRef.current.value = "";
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    reset();
  }, [reset]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  async function acceptFile(next: File | null | undefined) {
    setError(null);
    if (!next) return;
    if (!next.type.startsWith("image/")) {
      setError("Choose an image file (JPEG, PNG, WebP, GIF).");
      return;
    }
    if (next.size > MAX_BYTES) {
      setError("Image must be 12 MB or smaller.");
      return;
    }
    setFile(next);
    if (!caption.trim()) {
      setCaption(next.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " "));
    }
    try {
      setPreview(await readFileAsPreview(next));
    } catch {
      setPreview(null);
      setError("Could not preview that image.");
    }
  }

  function onDrop(e: DragEvent) {
    e.preventDefault();
    setDragging(false);
    void acceptFile(e.dataTransfer.files?.[0]);
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!file) {
      setError("Add a photo by clicking the drop zone or dragging a file in.");
      return;
    }
    if (!caption.trim()) {
      setError("Caption is required.");
      return;
    }
    setError(null);
    startTransition(async () => {
      try {
        await createEvidenceUpload({
          jobId,
          caption: caption.trim(),
          file,
          externalCompanyCamId: companyCamId.trim() || null,
          customerVisible,
        });
        close();
        router.refresh();
      } catch (err) {
        setError(
          err instanceof ApiError
            ? err.message
            : err instanceof Error
              ? err.message
              : "Upload failed.",
        );
      }
    });
  }

  return (
    <>
      <button
        type="button"
        className="console-btn console-btn-primary"
        onClick={() => setOpen(true)}
      >
        Add photo
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            aria-label="Close"
            onClick={close}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="relative z-10 w-full max-w-lg overflow-hidden rounded-xl border border-border bg-background shadow-lg"
          >
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <h2 id={titleId} className="text-[15px] font-semibold text-foreground">
                Add photo
              </h2>
              <button
                type="button"
                className="console-btn console-btn-ghost h-8 px-2 text-[12px]"
                onClick={close}
              >
                Close
              </button>
            </div>

            <form onSubmit={onSubmit} className="space-y-4 px-5 py-5 text-left">
              <div
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    inputRef.current?.click();
                  }
                }}
                onClick={() => inputRef.current?.click()}
                onDragEnter={(e) => {
                  e.preventDefault();
                  setDragging(true);
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragging(true);
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  setDragging(false);
                }}
                onDrop={onDrop}
                className={
                  dragging
                    ? "flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-foreground bg-muted px-4 py-10 text-center"
                    : "flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/40 px-4 py-10 text-center transition-colors hover:border-zinc-400 hover:bg-muted"
                }
              >
                {preview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={preview}
                    alt="Preview"
                    className="mb-3 max-h-48 rounded-md object-contain"
                  />
                ) : (
                  <p className="text-[13px] font-medium text-foreground">
                    Drop an image here, or click to browse
                  </p>
                )}
                <p className="mt-1 text-[12px] text-muted-foreground">
                  {file
                    ? `${file.name} · ${(file.size / 1024).toFixed(0)} KB`
                    : "JPEG, PNG, WebP, or GIF · up to 12 MB"}
                </p>
                <input
                  ref={inputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => void acceptFile(e.target.files?.[0])}
                />
              </div>

              <div className="space-y-1.5 text-left">
                <label
                  htmlFor="evidence-caption"
                  className="block text-left text-[12px] font-medium leading-none text-foreground"
                >
                  Caption *
                </label>
                <input
                  id="evidence-caption"
                  className="console-input text-left placeholder:text-left"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  required
                  placeholder="e.g. North slope after tear-off"
                />
              </div>

              <div className="space-y-1.5 text-left">
                <label
                  htmlFor="evidence-cc-id"
                  className="block text-left text-[12px] font-medium leading-none text-foreground"
                >
                  CompanyCam id
                </label>
                <input
                  id="evidence-cc-id"
                  className="console-input text-left placeholder:text-left"
                  value={companyCamId}
                  onChange={(e) => setCompanyCamId(e.target.value)}
                  placeholder="Optional"
                />
              </div>

              <div className="flex items-start gap-2 text-left">
                <input
                  id="evidence-portal-visible"
                  type="checkbox"
                  checked={customerVisible}
                  onChange={(e) => setCustomerVisible(e.target.checked)}
                  className="mt-0.5 h-4 w-4 shrink-0 rounded border-input accent-brand"
                />
                <label
                  htmlFor="evidence-portal-visible"
                  className="text-left text-[13px] leading-snug text-foreground"
                >
                  Show on homeowner portal
                </label>
              </div>

              {error ? <p className="text-[12px] text-destructive">{error}</p> : null}

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  className="console-btn console-btn-ghost"
                  onClick={close}
                  disabled={pending}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="console-btn console-btn-primary"
                  disabled={pending || !file}
                >
                  {pending ? "Uploading…" : "Add photo"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}

export function EvidenceActions({
  jobId,
  photo,
}: {
  jobId: string;
  photo: Photo;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="mt-2 flex flex-wrap items-center gap-2">
      <button
        type="button"
        disabled={pending}
        className="console-btn console-btn-ghost text-[11px]"
        onClick={() => {
          setError(null);
          startTransition(async () => {
            try {
              try {
                await setPhotoVisibility(jobId, photo.id, !photo.customerVisible);
              } catch {
                await updateEvidenceVisibility(photo.id, !photo.customerVisible);
              }
              router.refresh();
            } catch (err) {
              setError(
                err instanceof ApiError
                  ? err.message
                  : err instanceof Error
                    ? err.message
                    : "Update failed",
              );
            }
          });
        }}
      >
        {photo.customerVisible ? "Hide from portal" : "Show on portal"}
      </button>
      <DeleteButton
        label="Soft-delete"
        confirm="Soft-delete this photo?"
        onDelete={async () => {
          await deleteEvidence(photo.id);
          router.refresh();
        }}
      />
      {error ? <p className="w-full text-[11px] text-destructive">{error}</p> : null}
    </div>
  );
}
