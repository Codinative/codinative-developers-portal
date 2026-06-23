"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  LINK_TYPES,
  LinkTypeBadge,
  getLinkType,
  type LinkTypeId,
} from "./link-types";

/**
 * A branded, keyboard-accessible dropdown for picking a link's type
 * (GitHub, BigCommerce, App marketplace, …). A native <select> can't render the
 * icons we want, so this is a custom listbox: button + popover, with arrow-key
 * navigation, Enter/Space to choose, Escape and outside-click to dismiss.
 */
export function LinkTypeSelect({
  value,
  onChange,
  disabled,
}: {
  value: LinkTypeId;
  onChange: (id: LinkTypeId) => void;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const listboxId = useId();
  const selected = getLinkType(value);

  // Close on outside click.
  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: PointerEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  // When opening, focus the current selection and scroll it into view.
  useEffect(() => {
    if (!open) return;
    const idx = Math.max(
      0,
      LINK_TYPES.findIndex((t) => t.id === value),
    );
    setActiveIndex(idx);
  }, [open, value]);

  useEffect(() => {
    if (!open) return;
    const el = listRef.current?.children[activeIndex] as
      | HTMLElement
      | undefined;
    el?.scrollIntoView({ block: "nearest" });
  }, [open, activeIndex]);

  function choose(index: number) {
    const t = LINK_TYPES[index];
    if (t) onChange(t.id);
    setOpen(false);
  }

  function onButtonKeyDown(e: React.KeyboardEvent) {
    if (["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) {
      e.preventDefault();
      setOpen(true);
    }
  }

  function onListKeyDown(e: React.KeyboardEvent) {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((i) => (i + 1) % LINK_TYPES.length);
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((i) => (i - 1 + LINK_TYPES.length) % LINK_TYPES.length);
        break;
      case "Home":
        e.preventDefault();
        setActiveIndex(0);
        break;
      case "End":
        e.preventDefault();
        setActiveIndex(LINK_TYPES.length - 1);
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        choose(activeIndex);
        break;
      case "Escape":
        e.preventDefault();
        setOpen(false);
        break;
      case "Tab":
        setOpen(false);
        break;
    }
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={onButtonKeyDown}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex w-full items-center gap-2.5 rounded-lg border border-gray-200 bg-white px-2.5 py-2 text-left text-sm text-gray-900 transition hover:border-gray-300 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none disabled:opacity-50 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:hover:border-gray-600"
      >
        <LinkTypeBadge type={selected} size="sm" />
        <span className="min-w-0 flex-1 truncate font-medium">{selected.label}</span>
        <ChevronsUpDown className="h-4 w-4 shrink-0 text-gray-400 dark:text-gray-500" />
      </button>

      {open && (
        <ul
          ref={listRef}
          role="listbox"
          id={listboxId}
          aria-activedescendant={`${listboxId}-${activeIndex}`}
          tabIndex={-1}
          onKeyDown={onListKeyDown}
          autoFocus
          className="absolute z-30 mt-1.5 max-h-72 w-full min-w-[15rem] overflow-y-auto rounded-xl border border-gray-200 bg-white p-1.5 shadow-lg shadow-black/5 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:shadow-black/40"
        >
          {LINK_TYPES.map((t, i) => {
            const isSelected = t.id === value;
            const isActive = i === activeIndex;
            return (
              <li
                key={t.id}
                id={`${listboxId}-${i}`}
                role="option"
                aria-selected={isSelected}
                onClick={() => choose(i)}
                onMouseEnter={() => setActiveIndex(i)}
                className={`flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 transition ${
                  isActive
                    ? "bg-indigo-50 dark:bg-indigo-500/10"
                    : "bg-transparent"
                }`}
              >
                <LinkTypeBadge type={t} size="sm" />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">
                    {t.label}
                  </div>
                  <div className="truncate text-xs text-gray-500 dark:text-gray-400">
                    {t.hint}
                  </div>
                </div>
                {isSelected && (
                  <Check className="h-4 w-4 shrink-0 text-indigo-600 dark:text-indigo-400" />
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
