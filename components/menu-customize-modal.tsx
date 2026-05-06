"use client";

import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from "react";
import { X } from "lucide-react";
import { useOrderCart } from "@/components/order-context";
import { cafe } from "@/lib/content";
import { audFromCents, type BoardMenuItem, type RollAddOn, type RollVariantChoice } from "@/lib/menu-data";

const NO_COMBO_ADDONS: RollAddOn[] = [];

function bundledAddonIdsForVariant(variantId: string, rows: RollAddOn[]): Set<string> {
  const s = new Set<string>();
  for (const a of rows) {
    if (a.excludeForVariantIds?.includes(variantId)) s.add(a.id);
  }
  return s;
}

/**
 * Highest-specificity version whose bundled extras are all selected (ties: lower index wins).
 */
function inferVariantIndexFromAddons(
  primaryChoices: RollVariantChoice[],
  allAddOnRows: RollAddOn[],
  addOnIds: Set<string>,
): number {
  const rows = primaryChoices.map((c, idx) => ({
    idx,
    bundle: bundledAddonIdsForVariant(c.id, allAddOnRows),
  }));
  rows.sort((a, b) => {
    const dz = b.bundle.size - a.bundle.size;
    if (dz !== 0) return dz;
    return a.idx - b.idx;
  });

  for (const { idx, bundle } of rows) {
    if (bundle.size === 0) continue;
    let ok = true;
    for (const id of bundle) {
      if (!addOnIds.has(id)) {
        ok = false;
        break;
      }
    }
    if (ok) return idx;
  }

  return rows.find((r) => r.bundle.size === 0)?.idx ?? 0;
}

function buildLineDetail(
  primaryVariant: RollVariantChoice | undefined,
  showPrimaryPriceLine: boolean,
  secondaryVariant: RollVariantChoice | undefined,
  showSecondaryLine: boolean,
  saucePick: RollVariantChoice | undefined,
  showSauceLine: boolean,
  milkLabel: string | undefined,
  comboAddOns: RollAddOn[],
  regularAddOns: RollAddOn[],
  addOnIds: Set<string>,
  variantId: string,
  removalNames: string[],
  toastVariant: RollVariantChoice | undefined,
  showToastLine: boolean,
  instructions: string,
): string {
  const parts: string[] = [];
  if (showPrimaryPriceLine && primaryVariant) {
    let line = `${primaryVariant.label} (${primaryVariant.price})`;
    if (primaryVariant.detail) line += ` - ${primaryVariant.detail}`;
    parts.push(line);
  }
  if (showSecondaryLine && secondaryVariant) parts.push(secondaryVariant.label);
  if (showSauceLine && saucePick) parts.push(saucePick.label);
  if (milkLabel) parts.push(milkLabel);
  const addOnOrder = [...comboAddOns, ...regularAddOns];
  for (const a of addOnOrder) {
    const bundled = !!(a.excludeForVariantIds?.includes(variantId));
    const selected = addOnIds.has(a.id);
    if (bundled) {
      if (selected) parts.push(`${a.name}`);
      else parts.push(`${a.name} credit -${audFromCents(a.priceCents)}`);
    } else if (selected) {
      parts.push(`${a.name} +${audFromCents(a.priceCents)}`);
    }
  }
  for (const n of removalNames) parts.push(n);
  if (showToastLine && toastVariant) parts.push(toastVariant.label);
  if (instructions.trim()) parts.push(`Note: ${instructions.trim()}`);
  return parts.join(" · ");
}

/** Selected à la carte add-on adds price; bundled line is included at $0 extra; opting out credits its list price against the variant. */
function addOnContributionCents(a: RollAddOn, variantId: string, selected: boolean): number {
  const bundled = a.excludeForVariantIds?.includes(variantId) ?? false;
  if (bundled) return selected ? 0 : -a.priceCents;
  return selected ? a.priceCents : 0;
}

export function MenuCustomizeModal() {
  const { customizeTarget: item, customizeOpenSeq, closeCustomize, addToCart } = useOrderCart();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const variantIdPrevRef = useRef<string | undefined>(undefined);
  const suppressPrimaryBundleSyncRef = useRef(false);
  const headingId = useId();
  const custom = item?.customization;
  const primaryChoices = custom?.primaryChoices ?? [];
  const secondaryChoices = custom?.secondaryChoices ?? [];
  const toastChoices = custom?.toastChoices ?? [];
  const sauceChoices = custom?.sauceChoices ?? [];
  const comboAddOns = custom?.comboAddOns ?? NO_COMBO_ADDONS;
  const milkOptions = custom?.milkOptions ?? [];
  const addOns = custom?.addOns ?? [];
  const removals = custom?.removals ?? [];
  const allAddOnRows = useMemo<RollAddOn[]>(
    () => (!custom ? [] : [...(custom.comboAddOns ?? NO_COMBO_ADDONS), ...(custom.addOns ?? [])]),
    [custom],
  );

  const [selectedPrimary, setSelectedPrimary] = useState(0);
  const [selectedSecondary, setSelectedSecondary] = useState(0);
  const [selectedToast, setSelectedToast] = useState(0);
  const [selectedSauce, setSelectedSauce] = useState(0);
  const [selectedMilk, setSelectedMilk] = useState(0);
  const [instructions, setInstructions] = useState("");
  const [addOnIds, setAddOnIds] = useState<Set<string>>(() => new Set());
  const [removalIds, setRemovalIds] = useState<Set<string>>(() => new Set());

  const open = item !== null && !!custom;

  /** Reset picker state synchronously before paint so variant add-on sync sees the correct primary. */
  useLayoutEffect(() => {
    if (!item?.id || !custom) return;
    setSelectedPrimary(0);
    setSelectedSecondary(0);
    setSelectedToast(0);
    setSelectedSauce(0);
    setSelectedMilk(0);
    setInstructions("");
    setRemovalIds(new Set());
    setAddOnIds(new Set());
    variantIdPrevRef.current = undefined;
  }, [item?.id, custom]);

  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    if (!item || !custom) {
      el.close();
      return;
    }
    el.showModal();
    const resetScroll = () => {
      if (scrollAreaRef.current) scrollAreaRef.current.scrollTop = 0;
      try {
        el.scrollTop = 0;
      } catch {
        /* no-op */
      }
    };
    resetScroll();
    requestAnimationFrame(resetScroll);
  }, [item, custom, customizeOpenSeq]);
  const variant = primaryChoices[selectedPrimary];
  const variantId = variant?.id ?? "";
  const showPrimaryUi = primaryChoices.length > 1;
  const secondaryPick = secondaryChoices[selectedSecondary];
  const showSecondaryUi = secondaryChoices.length > 0;
  const saucePick = sauceChoices[selectedSauce];
  const showSauceUi = sauceChoices.length > 0;
  const toastPick = toastChoices[selectedToast];
  const showToastUi = toastChoices.length > 0;

  const primaryBundlesAddOnPricing =
    primaryChoices.length > 1 &&
    allAddOnRows.some((a) => a.excludeForVariantIds?.some((id) => primaryChoices.some((p) => p.id === id)));

  /**
   * When the customer picks bacon / egg / cheese / hash to match a named version,
   * move the radio to that version without wiping their checkbox selections.
   */
  useEffect(() => {
    if (!open || !item || !primaryBundlesAddOnPricing) return;
    const inferred = inferVariantIndexFromAddons(primaryChoices, allAddOnRows, addOnIds);
    if (inferred !== selectedPrimary) {
      suppressPrimaryBundleSyncRef.current = true;
      setSelectedPrimary(inferred);
    }
  }, [open, item, primaryBundlesAddOnPricing, primaryChoices, allAddOnRows, addOnIds, selectedPrimary]);

  /** Turn off bundled add-ons for the previous variant, then apply this variant (+$0 on bundled lines). */
  useLayoutEffect(() => {
    if (!open || !item || allAddOnRows.length === 0) return;
    if (suppressPrimaryBundleSyncRef.current) {
      suppressPrimaryBundleSyncRef.current = false;
      variantIdPrevRef.current = variantId;
      return;
    }

    const prevVid = variantIdPrevRef.current;
    variantIdPrevRef.current = variantId;

    setAddOnIds((prev) => {
      const next = new Set(prev);
      if (prevVid !== undefined && prevVid !== variantId) {
        for (const a of allAddOnRows) {
          if (a.excludeForVariantIds?.includes(prevVid)) next.delete(a.id);
        }
      }
      for (const a of allAddOnRows) {
        if (a.excludeForVariantIds?.includes(variantId)) next.add(a.id);
      }
      return next;
    });
  }, [open, item, variantId, allAddOnRows]);

  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    const onDialogClose = () => closeCustomize();
    el.addEventListener("close", onDialogClose);
    return () => el.removeEventListener("close", onDialogClose);
  }, [closeCustomize]);

  const close = () => {
    dialogRef.current?.close();
  };

  let addOnsTotalCents = 0;
  for (const a of allAddOnRows) {
    addOnsTotalCents += addOnContributionCents(a, variantId, addOnIds.has(a.id));
  }

  const baseCoreCents =
    variant?.priceCents ?? item?.basePriceCents ?? (primaryChoices[0]?.priceCents ?? 0);
  const toastDeltaCents = showToastUi
    ? (toastChoices[selectedToast]?.priceCents ?? 0) - (toastChoices[0]?.priceCents ?? 0)
    : 0;
  const secondaryExtraCents = showSecondaryUi ? (secondaryChoices[selectedSecondary]?.priceCents ?? 0) : 0;
  const sauceExtraCents = showSauceUi ? (sauceChoices[selectedSauce]?.priceCents ?? 0) : 0;
  const milkExtraCents = milkOptions.length > 0 ? (milkOptions[selectedMilk]?.priceCents ?? 0) : 0;
  const totalCents =
    baseCoreCents +
    toastDeltaCents +
    secondaryExtraCents +
    sauceExtraCents +
    milkExtraCents +
    addOnsTotalCents;

  const milkLabelSel = milkOptions.length > 0 ? milkOptions[selectedMilk]?.label : undefined;
  const removalNames = removals.filter((r) => removalIds.has(r.id)).map((r) => r.name);

  const toggleAddOn = (id: string) => {
    setAddOnIds((prev) => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  };

  const toggleRemoval = (id: string) => {
    setRemovalIds((prev) => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  };

  const renderAddonCheckbox = (a: RollAddOn, keyPrefix: string) => {
    const bundled = a.excludeForVariantIds?.includes(variantId) ?? false;
    const selected = addOnIds.has(a.id);
    const aid = `${headingId}-${keyPrefix}-${a.id}`;
    const priceLabel = !bundled ? (
      <span
        className={`shrink-0 pt-0.5 font-display text-sm text-[var(--cj-orange)] ${selected ? "" : "opacity-[0.72]"}`}
      >
        +{audFromCents(a.priceCents)}
      </span>
    ) : selected ? (
      <span className="shrink-0 pt-0.5 text-right text-[0.7rem] font-semibold text-[var(--cj-cream)]/48">No extra</span>
    ) : (
      <span className="shrink-0 pt-0.5 text-right font-display text-sm text-[var(--cj-orange)]">-{audFromCents(a.priceCents)}</span>
    );
    return (
      <label
        key={aid}
        htmlFor={aid}
        className="flex w-full cursor-pointer flex-row items-start gap-3 rounded-xl border border-[rgba(255,122,0,0.18)] bg-[rgba(0,0,0,0.22)] px-3 py-2.5 text-left transition hover:border-[rgba(255,122,0,0.4)]"
      >
        <input
          id={aid}
          type="checkbox"
          checked={addOnIds.has(a.id)}
          onChange={() => toggleAddOn(a.id)}
          className="mt-0.5 size-4 shrink-0 accent-[var(--cj-orange)]"
        />
        <span className="min-w-0 flex-1 text-sm font-semibold">{a.name}</span>
        {priceLabel}
      </label>
    );
  };

  const handleAddBasket = () => {
    if (!item) return;
    const showPrimaryPriceLine = primaryChoices.length > 0;
    const primaryForDetail = variant ?? primaryChoices[0];
    const showSecondaryLine = secondaryChoices.length > 0;
    const secondaryForDetail = secondaryPick ?? secondaryChoices[0];
    const showSauceLine = sauceChoices.length > 0;
    const sauceForDetail = saucePick ?? sauceChoices[0];
    const showToastDetail = toastChoices.length > 0;
    const toastDetailPick = toastPick ?? toastChoices[0];
    const detail = buildLineDetail(
      primaryForDetail,
      showPrimaryPriceLine,
      secondaryForDetail,
      showSecondaryLine,
      sauceForDetail,
      showSauceLine,
      milkLabelSel,
      comboAddOns,
      addOns,
      addOnIds,
      variantId,
      removalNames,
      toastDetailPick,
      showToastDetail,
      instructions,
    );
    addToCart({
      label: item.name,
      detail: detail || "As listed",
      quantity: 1,
      lineTotalCents: totalCents,
    });
  };

  const primaryTitle = custom?.primarySectionTitle ?? "Choose options";
  const secondaryTitle = custom?.secondarySectionTitle ?? "Options";
  const toastTitle = custom?.toastSectionTitle ?? "Toast level";
  const sauceTitle = custom?.sauceSectionTitle ?? "Sauce";
  const blockBeforeMilk = showPrimaryUi;
  const blockBeforeCombo = blockBeforeMilk || milkOptions.length > 0;
  const showComboUi = comboAddOns.length > 0;
  const blockBeforeRegularAddons = blockBeforeCombo || showComboUi;
  const blockBeforeSauceAfterExtras = blockBeforeRegularAddons || addOns.length > 0;
  const blockBeforeSecondaryAfterSauce = blockBeforeSauceAfterExtras || showSauceUi;

  useLayoutEffect(() => {
    if (!open) return;
    const el = scrollAreaRef.current;
    const dlg = dialogRef.current;
    if (el) el.scrollTop = 0;
    if (dlg)
      try {
        dlg.scrollTop = 0;
      } catch {
        /* no-op */
      }
  }, [open, customizeOpenSeq, item?.id]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={open ? headingId : undefined}
      className="cj-roll-dialog w-[min(100vw-1.5rem,26rem)] max-h-[min(92vh,40rem)] overflow-hidden rounded-[1.35rem] border border-[rgba(255,122,0,0.35)] bg-[var(--cj-charcoal)] p-0 text-[var(--cj-cream)] shadow-2xl shadow-black/50"
    >
      {open && item && custom ? (
        <div className="relative flex max-h-[inherit] flex-col">
          <button
            type="button"
            onClick={close}
            className="absolute right-3 top-3 z-10 grid size-9 place-items-center rounded-xl border border-[rgba(255,243,214,0.12)] text-[var(--cj-cream)] transition hover:border-[var(--cj-orange)]/40 hover:text-[var(--cj-gold)]"
            aria-label="Close"
          >
            <X className="size-4" aria-hidden />
          </button>

          <div className="border-b border-[rgba(255,122,0,0.15)] px-6 pb-4 pt-5 text-center">
            <h2 id={headingId} className="font-display text-xl font-semibold tracking-tight text-[var(--cj-cream)]">
              {item.name}
            </h2>
            {item.description ? (
              <p className="mx-auto mt-2 max-w-[22rem] text-sm leading-relaxed text-[var(--cj-cream)]/72">{item.description}</p>
            ) : null}
            <p className="mt-3 font-display text-lg font-semibold text-[var(--cj-orange)]">
              <span>{audFromCents(totalCents)}</span>
              {milkExtraCents > 0 ? <span className="font-sans text-sm font-semibold">{` · +${audFromCents(milkExtraCents)} milk`}</span> : null}
            </p>
          </div>

          <div ref={scrollAreaRef} className="overflow-y-auto px-5 py-4 text-left">
            {showPrimaryUi ? (
              <fieldset className="mt-4 space-y-2">
                <legend className="mb-3 w-full px-1 text-center text-xs font-bold uppercase tracking-[0.2em] text-[var(--cj-orange)]">
                  {primaryTitle}
                </legend>
                {primaryChoices.map((c, i) => {
                    const fid = `${headingId}-primary-${c.id}`;
                    return (
                      <label
                        key={c.id}
                        htmlFor={fid}
                        className="flex w-full cursor-pointer flex-row items-center gap-3 rounded-xl border border-[rgba(255,122,0,0.18)] bg-[rgba(0,0,0,0.28)] px-3 py-3 text-left transition hover:border-[rgba(255,122,0,0.45)] has-[:checked]:border-[var(--cj-orange)]/55 has-[:checked]:bg-[rgba(255,122,0,0.08)]"
                      >
                        <input
                          id={fid}
                          type="radio"
                          name={`${headingId}-primary-variant`}
                          checked={selectedPrimary === i}
                          onChange={() => setSelectedPrimary(i)}
                          className="size-4 shrink-0 accent-[var(--cj-orange)]"
                        />
                        <span className="min-w-0 flex-1 text-sm font-semibold leading-snug">
                          <span className="block">{c.label}</span>
                          {c.detail ? (
                            <span className="mt-0.5 block text-[0.7rem] font-normal leading-snug text-[var(--cj-cream)]/55">{c.detail}</span>
                          ) : null}
                        </span>
                        <span className="shrink-0 font-display text-[var(--cj-orange)]">{c.price}</span>
                      </label>
                    );
                })}
              </fieldset>
            ) : null}

            {milkOptions.length > 0 ? (
              <div className={blockBeforeMilk ? "mt-6" : "mt-0"}>
                <fieldset className="space-y-2">
                  <legend className="mb-3 w-full px-1 text-center text-xs font-bold uppercase tracking-[0.2em] text-[var(--cj-orange)]">
                    Milk
                  </legend>
                  {milkOptions.map((m, i) => {
                    const mid = `${headingId}-milk-${m.id}`;
                    return (
                      <label
                        key={m.id}
                        htmlFor={mid}
                        className="flex w-full cursor-pointer flex-row items-center gap-3 rounded-xl border border-[rgba(255,122,0,0.18)] bg-[rgba(0,0,0,0.28)] px-3 py-3 text-left transition hover:border-[rgba(255,122,0,0.45)] has-[:checked]:border-[var(--cj-orange)]/55 has-[:checked]:bg-[rgba(255,122,0,0.08)]"
                      >
                        <input
                          id={mid}
                          type="radio"
                          name="milk-opt"
                          checked={selectedMilk === i}
                          onChange={() => setSelectedMilk(i)}
                          className="size-4 shrink-0 accent-[var(--cj-orange)]"
                        />
                        <span className="min-w-0 flex-1 text-sm font-semibold">{m.label}</span>
                        <span className="shrink-0 font-display text-sm text-[var(--cj-orange)]">
                          {m.priceCents > 0 ? `+${audFromCents(m.priceCents)}` : "Included"}
                        </span>
                      </label>
                    );
                  })}
                </fieldset>
              </div>
            ) : null}

            {showComboUi ? (
              <div className={blockBeforeCombo ? "mt-6" : "mt-4"}>
                <fieldset className="space-y-2">
                  <legend className="mb-2 w-full px-1 text-center text-xs font-bold uppercase tracking-[0.2em] text-[var(--cj-orange)]">
                    Combo
                  </legend>
                  {comboAddOns.map((a) => renderAddonCheckbox(a, "combo"))}
                </fieldset>
              </div>
            ) : null}

            {addOns.length > 0 ? (
              <div className={blockBeforeRegularAddons ? "mt-6" : "mt-4"}>
                <fieldset className="space-y-2">
                  <legend className="mb-2 w-full px-1 text-center text-xs font-bold uppercase tracking-[0.2em] text-[var(--cj-orange)]">
                    Add extras
                  </legend>
                  {addOns.map((a) => renderAddonCheckbox(a, "addon"))}
                </fieldset>
              </div>
            ) : null}

            {showSauceUi ? (
              <fieldset className={blockBeforeSauceAfterExtras ? "mt-6 space-y-2" : "mt-4 space-y-2"}>
                <legend className="mb-3 w-full px-1 text-center text-xs font-bold uppercase tracking-[0.2em] text-[var(--cj-orange)]">
                  {sauceTitle}
                </legend>
                {sauceChoices.map((s, i) => {
                  const sid = `${headingId}-sauce-${s.id}`;
                  return (
                    <label
                      key={s.id}
                      htmlFor={sid}
                      className="flex w-full cursor-pointer flex-row items-center gap-3 rounded-xl border border-[rgba(255,122,0,0.18)] bg-[rgba(0,0,0,0.28)] px-3 py-3 text-left transition hover:border-[rgba(255,122,0,0.45)] has-[:checked]:border-[var(--cj-orange)]/55 has-[:checked]:bg-[rgba(255,122,0,0.08)]"
                    >
                      <input
                        id={sid}
                        type="radio"
                        name={`${headingId}-sauce-variant`}
                        checked={selectedSauce === i}
                        onChange={() => setSelectedSauce(i)}
                        className="size-4 shrink-0 accent-[var(--cj-orange)]"
                      />
                      <span className="min-w-0 flex-1 text-sm font-semibold leading-snug">{s.label}</span>
                      <span className="shrink-0 font-display text-sm text-[var(--cj-orange)]">
                        {s.priceCents > 0 ? `+${audFromCents(s.priceCents)}` : s.price}
                      </span>
                    </label>
                  );
                })}
              </fieldset>
            ) : null}

            {showSecondaryUi ? (
              <fieldset className={blockBeforeSecondaryAfterSauce ? "mt-6 space-y-2" : "mt-4 space-y-2"}>
                <legend className="mb-3 w-full px-1 text-center text-xs font-bold uppercase tracking-[0.2em] text-[var(--cj-orange)]">
                  {secondaryTitle}
                </legend>
                {secondaryChoices.map((c, i) => {
                  const fid = `${headingId}-secondary-${c.id}`;
                  return (
                    <label
                      key={c.id}
                      htmlFor={fid}
                      className="flex w-full cursor-pointer flex-row items-center gap-3 rounded-xl border border-[rgba(255,122,0,0.18)] bg-[rgba(0,0,0,0.28)] px-3 py-3 text-left transition hover:border-[rgba(255,122,0,0.45)] has-[:checked]:border-[var(--cj-orange)]/55 has-[:checked]:bg-[rgba(255,122,0,0.08)]"
                    >
                      <input
                        id={fid}
                        type="radio"
                        name={`${headingId}-secondary-variant`}
                        checked={selectedSecondary === i}
                        onChange={() => setSelectedSecondary(i)}
                        className="size-4 shrink-0 accent-[var(--cj-orange)]"
                      />
                      <span className="min-w-0 flex-1 text-sm font-semibold leading-snug">{c.label}</span>
                      <span className="shrink-0 font-display text-sm text-[var(--cj-orange)]">
                        {c.priceCents > 0 ? `+${audFromCents(c.priceCents)}` : c.price}
                      </span>
                    </label>
                  );
                })}
              </fieldset>
            ) : null}

            {removals.length > 0 ? (
              <div className="mt-6">
                <fieldset className="space-y-2">
                  <legend className="mb-2 w-full px-1 text-center text-xs font-bold uppercase tracking-[0.2em] text-[var(--cj-orange)]">
                    Remove
                  </legend>
                  {removals.map((r) => {
                    const rid = `${headingId}-rem-${r.id}`;
                    return (
                      <label
                        key={r.id}
                        htmlFor={rid}
                        className="flex w-full cursor-pointer flex-row items-center gap-3 rounded-xl border border-[rgba(255,122,0,0.14)] bg-[rgba(0,0,0,0.18)] px-3 py-2 text-left"
                      >
                        <input
                          id={rid}
                          type="checkbox"
                          checked={removalIds.has(r.id)}
                          onChange={() => toggleRemoval(r.id)}
                          className="size-4 shrink-0 accent-[var(--cj-orange)]"
                        />
                        <span className="min-w-0 flex-1 text-sm font-semibold">{r.name}</span>
                      </label>
                    );
                  })}
                </fieldset>
              </div>
            ) : null}

            {showToastUi ? (
              <fieldset className="mt-6 space-y-2">
                <legend className="mb-3 w-full px-1 text-center text-xs font-bold uppercase tracking-[0.2em] text-[var(--cj-orange)]">
                  {toastTitle}
                </legend>
                {toastChoices.map((c, i) => {
                  const tid = `${headingId}-toast-${c.id}`;
                  return (
                    <label
                      key={c.id}
                      htmlFor={tid}
                      className="flex w-full cursor-pointer flex-row items-center gap-3 rounded-xl border border-[rgba(255,122,0,0.18)] bg-[rgba(0,0,0,0.28)] px-3 py-3 text-left transition hover:border-[rgba(255,122,0,0.45)] has-[:checked]:border-[var(--cj-orange)]/55 has-[:checked]:bg-[rgba(255,122,0,0.08)]"
                    >
                      <input
                        id={tid}
                        type="radio"
                        name={`${headingId}-toast`}
                        checked={selectedToast === i}
                        onChange={() => setSelectedToast(i)}
                        className="size-4 shrink-0 accent-[var(--cj-orange)]"
                      />
                      <span className="min-w-0 flex-1 text-sm font-semibold leading-snug">{c.label}</span>
                      <span className="shrink-0 font-display text-sm text-[var(--cj-orange)]">{c.price}</span>
                    </label>
                  );
                })}
              </fieldset>
            ) : null}

            <div className="mt-6 rounded-xl border border-[rgba(255,122,0,0.2)] bg-[rgba(0,0,0,0.28)] px-4 py-3 text-left">
              <p className="font-display text-lg font-semibold text-[var(--cj-gold)]">Total {audFromCents(totalCents)}</p>
              <p className="mt-1 text-[0.7rem] leading-relaxed text-[var(--cj-cream)]/45">Guide only. Confirm the final price when you order.</p>
            </div>

            <label className="mt-6 block text-left">
              <span className="block text-center text-xs font-bold uppercase tracking-[0.2em] text-[var(--cj-orange)]">Special instructions</span>
              <textarea
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                rows={3}
                placeholder="No sauce, extra crispy, cut in half…"
                className="mt-2 w-full resize-none rounded-xl border border-[rgba(255,122,0,0.2)] bg-[var(--cj-brown)]/90 px-3 py-2.5 text-left text-sm text-[var(--cj-soft)] outline-none ring-[var(--cj-orange)]/20 placeholder:text-[var(--cj-cream)]/35 focus:border-[var(--cj-orange)]/45 focus:ring-2"
              />
            </label>
          </div>

          <div className="flex shrink-0 flex-row items-stretch gap-1.5 border-t border-[rgba(255,122,0,0.12)] px-3 py-2 sm:gap-2 sm:px-4 sm:py-2.5">
            <button
              type="button"
              onClick={close}
              className="flex min-h-9 min-w-0 flex-1 items-center justify-center rounded-full border border-[rgba(255,243,214,0.2)] px-2 py-1.5 text-center text-[0.68rem] font-bold leading-snug text-[var(--cj-cream)] transition hover:border-[var(--cj-orange)]/45 sm:min-h-10 sm:px-3 sm:text-xs"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleAddBasket}
              className="flex min-h-9 min-w-0 flex-1 items-center justify-center rounded-full bg-[var(--cj-orange)] px-2 py-1.5 text-center text-[0.68rem] font-bold leading-tight text-[var(--cj-charcoal)] shadow-md transition hover:brightness-110 sm:min-h-10 sm:px-3 sm:text-xs"
            >
              <span className="max-sm:hidden">Add to basket</span>
              <span className="truncate sm:hidden">Add basket</span>
            </button>
            <a
              href={cafe.orderUrl}
              target="_blank"
              rel="noreferrer"
              title="Live order website"
              className="flex min-h-9 min-w-0 flex-1 items-center justify-center rounded-full border border-[rgba(255,243,214,0.22)] px-2 py-1.5 text-center text-[0.68rem] font-bold leading-tight text-[var(--cj-cream)] transition hover:border-[var(--cj-orange)]/45 sm:min-h-10 sm:px-3 sm:text-xs"
            >
              <span className="max-sm:hidden">Live order website</span>
              <span className="truncate sm:hidden">Order online</span>
            </a>
          </div>
        </div>
      ) : null}
    </dialog>
  );
}
