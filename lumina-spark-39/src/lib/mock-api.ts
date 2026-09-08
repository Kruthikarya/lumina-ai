/**
 * Tiny mock-API layer backed by localStorage with a simulated network delay.
 * Lets Edit Profile / Skills / Projects / Assignments mutations survive a
 * refresh without needing a real backend, and stay in sync across components
 * via a subscribe hook.
 */
import { useEffect, useState } from "react";

const NS = "lumina:mock-api:v1";
const DELAY = 220; // ms

const isBrowser = () => typeof window !== "undefined";

function eventName(key: string) {
  return `${NS}:${key}`;
}

function read<T>(key: string): T | null {
  if (!isBrowser()) return null;
  try {
    const raw = window.localStorage.getItem(`${NS}:${key}`);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function write<T>(key: string, value: T) {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(`${NS}:${key}`, JSON.stringify(value));
    window.dispatchEvent(new CustomEvent(eventName(key)));
  } catch {
    /* quota / private mode — non-fatal */
  }
}

export function mockGet<T>(key: string, fallback: T): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(read<T>(key) ?? fallback), DELAY);
  });
}

export function mockSet<T>(key: string, value: T): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => {
      write(key, value);
      resolve(value);
    }, DELAY);
  });
}

/** Synchronous read for hydrating initial state without a flash. */
export function mockPeek<T>(key: string, fallback: T): T {
  return read<T>(key) ?? fallback;
}

/** Write immediately (no simulated delay) — for high-frequency UI toggles. */
export function mockSetSync<T>(key: string, value: T): T {
  write(key, value);
  return value;
}

/** Subscribe to changes for a given key. Returns unsubscribe. */
export function mockSubscribe(key: string, cb: () => void): () => void {
  if (!isBrowser()) return () => {};
  const name = eventName(key);
  const storageHandler = (e: StorageEvent) => {
    if (e.key === `${NS}:${key}`) cb();
  };
  window.addEventListener(name, cb);
  window.addEventListener("storage", storageHandler);
  return () => {
    window.removeEventListener(name, cb);
    window.removeEventListener("storage", storageHandler);
  };
}

/** React hook: live view of a mock-api key. */
export function useMockData<T>(key: string, fallback: T): [T, (v: T) => void] {
  const [value, setValue] = useState<T>(() => mockPeek(key, fallback));
  useEffect(() => {
    const refresh = () => setValue(mockPeek(key, fallback));
    refresh();
    return mockSubscribe(key, refresh);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  return [value, (v: T) => { setValue(v); mockSetSync(key, v); }];
}

export const MOCK_KEYS = {
  profile: "profile",
  bookmarks: "project-bookmarks",
  assignments: "assignments",
} as const;
