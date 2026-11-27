"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  useTransition,
} from "react";
import {
  fetchPlacesAutocomplete,
  fetchPlacesDetails,
  type PlacesDetailsResult,
  type PlacesSuggestion,
} from "@/lib/api";
import { ApiError } from "@/lib/api/errors";

const controlClass =
  "flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-left text-[13px] text-foreground outline-none placeholder:text-left placeholder:text-muted-foreground focus-visible:border-brand focus-visible:shadow-[0_0_0_3px_var(--brand-ring)] disabled:cursor-not-allowed disabled:opacity-50";

function newSessionToken() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `sess-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function AddressAutocomplete({
  value,
  onChange,
  onResolved,
  required,
  placeholder = "Start typing an address…",
  disabled,
}: {
  value: string;
  onChange: (value: string) => void;
  onResolved: (details: PlacesDetailsResult) => void;
  required?: boolean;
  placeholder?: string;
  disabled?: boolean;
}) {
  const listId = useId();
  const inputId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const sessionRef = useRef(newSessionToken());
  const [open, setOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<PlacesSuggestion[]>([]);
  const [active, setActive] = useState(0);
  const [provider, setProvider] = useState<string | null>(null);
  const [hint, setHint] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [picking, setPicking] = useState(false);

  const runAutocomplete = useCallback((q: string) => {
    const trimmed = q.trim();
    if (trimmed.length < 3) {
      setSuggestions([]);
      setOpen(false);
      setHint(null);
      return;
    }
    startTransition(async () => {
      try {
        const res = await fetchPlacesAutocomplete(trimmed, sessionRef.current);
        setProvider(res.provider);
        setSuggestions(res.suggestions ?? []);
        setActive(0);
        setOpen((res.suggestions?.length ?? 0) > 0);
        setHint(
          res.provider === "mock"
            ? "Demo suggestions (mock Places) — or type the address manually."
            : null,
        );
      } catch (err) {
        setSuggestions([]);
        setOpen(false);
        setHint(
          err instanceof ApiError && (err.status === 0 || err.status >= 500)
            ? "Address lookup unavailable — enter street, city, state, ZIP manually."
            : "Could not load suggestions — enter the address manually.",
        );
      }
    });
  }, []);

  useEffect(() => {
    const t = window.setTimeout(() => runAutocomplete(value), 280);
    return () => window.clearTimeout(t);
  }, [value, runAutocomplete]);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  function pick(suggestion: PlacesSuggestion) {
    setPicking(true);
    setOpen(false);
    onChange(suggestion.primaryText || suggestion.description || value);
    startTransition(async () => {
      try {
        const details = await fetchPlacesDetails(
          suggestion.placeId,
          sessionRef.current,
        );
        onResolved(details);
        sessionRef.current = newSessionToken();
        setHint(null);
      } catch {
        setHint("Could not fill from suggestion — finish the fields manually.");
      } finally {
        setPicking(false);
      }
    });
  }

  return (
    <div ref={rootRef} className="relative space-y-1.5 text-left">
      <label
        htmlFor={inputId}
        className="block text-left text-[12px] font-medium leading-none text-foreground"
      >
        Address
        {required ? (
          <span className="text-destructive" aria-hidden>
            {" "}
            *
          </span>
        ) : null}
      </label>
      <input
        id={inputId}
        type="text"
        autoComplete="street-address"
        required={required}
        disabled={disabled || picking}
        value={value}
        placeholder={placeholder}
        className={controlClass}
        role="combobox"
        aria-expanded={open}
        aria-controls={listId}
        aria-autocomplete="list"
        onChange={(e) => {
          onChange(e.target.value);
          setOpen(true);
        }}
        onFocus={() => {
          if (suggestions.length > 0) setOpen(true);
        }}
        onKeyDown={(e) => {
          if (!open || suggestions.length === 0) return;
          if (e.key === "ArrowDown") {
            e.preventDefault();
            setActive((i) => Math.min(i + 1, suggestions.length - 1));
          } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setActive((i) => Math.max(i - 1, 0));
          } else if (e.key === "Enter") {
            const hit = suggestions[active];
            if (hit) {
              e.preventDefault();
              pick(hit);
            }
          } else if (e.key === "Escape") {
            setOpen(false);
          }
        }}
      />
      {open && suggestions.length > 0 ? (
        <ul
          id={listId}
          role="listbox"
          className="absolute z-20 mt-1 max-h-56 w-full overflow-y-auto rounded-md border border-border bg-popover py-1 shadow-lg"
        >
          {suggestions.map((s, i) => (
            <li key={s.placeId}>
              <button
                type="button"
                role="option"
                aria-selected={i === active}
                className={
                  i === active
                    ? "flex w-full flex-col px-3 py-2 text-left bg-brand-soft text-foreground"
                    : "flex w-full flex-col px-3 py-2 text-left text-foreground hover:bg-muted"
                }
                onMouseEnter={() => setActive(i)}
                onClick={() => pick(s)}
              >
                <span className="text-[13px] font-medium">{s.primaryText}</span>
                {s.secondaryText ? (
                  <span className="mt-0.5 text-[12px] text-muted-foreground">
                    {s.secondaryText}
                  </span>
                ) : null}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
      <p className="text-left text-[11px] text-muted-foreground">
        {picking || pending
          ? "Looking up address…"
          : hint
            ? hint
            : provider
              ? `Suggestions via ${provider} · Tab/arrows then Enter, or type manually.`
              : "Type at least 3 characters for suggestions, or enter manually."}
      </p>
    </div>
  );
}
