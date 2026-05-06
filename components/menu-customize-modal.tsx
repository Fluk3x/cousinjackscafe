"use client";

import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from "react";
import { X } from "lucide-react";
import { useOrderCart } from "@/components/order-context";
import { cafe } from "@/lib/content";
import {
  audFromCents,
  STANDARD_BUILD_VARIANT_ID,
  type BoardMenuItem,
  type RollAddOn,
  type RollVariantChoice,
} from "@/lib/menu-data";

const NO_COMBO_ADDONS: RollAddOn[] = [];

function bundledAddonIdsForVariant(variantId: string, rows: RollAddOn[]): Set<string> {
  const s = new Set<string>();
  for (const a of rows) {
    if (a.excludeForVariantIds?.includes(variantId)) s.add(a.id);
  }
  return s;
}

/** Set equality for exact toastie filling ↔ bundle matching. */
function setsEqualSets(a: Set<string>, b: Set<string>): boolean {
  if (a.size !== b.size) return false;
  for (const x of a) if (!b.has(x)) return false;
  return true;
}

/**
 * Used for toastie: selected filling checkboxes must exactly match a named combo, else `customVariantId`.
 */
function inferPrimaryIndexExactFillings(
  primaryChoices: RollVariantChoice[],
  allAddOnRows: RollAddOn[],
  addOnIds: Set<string>,
  customVariantId: string,
): number {
  const fillingRowIds = new Set(
    allAddOnRows.filter((a) => (a.excludeForVariantIds?.length ?? 0) > 0).map((a) => a.id),
  );
  const selectedFill = new Set([...addOnIds].filter((id) => fillingRowIds.has(id)));

  const customIdx = primaryChoices.findIndex((p) => p.id === customVariantId);

  for (let i = 0; i < primaryChoices.length; i++) {
    const p = primaryChoices[i];
    if (p.id === customVariantId) continue;
    const bundle = bundledAddonIdsForVariant(p.id, allAddOnRows);
    if (setsEqualSets(bundle, selectedFill)) return i;
  }

  return customIdx >= 0 ? customIdx : 0;
}

/** Bacon & egg style: largest bundled subset of selected add-ons (ties: earlier index). */
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
  ingredientAddOns: RollAddOn[],
  regularAddOns: RollAddOn[],
  addOnIds: Set<string>,
  variantId: string,
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
  const addOnOrder = [...comboAddOns, ...ingredientAddOns, ...regularAddOns];
  for (const a of addOnOrder) {
    const bundled = !!(a.excludeForVariantIds?.includes(variantId));
    const selected = addOnIds.has(a.id);
    if (bundled) {
      if (selected) parts.push(a.name);
      else if (a.priceCents > 0) parts.push(`${a.name} credit -${audFromCents(a.priceCents)}`);
      else parts.push(`Without ${a.name}`);
    } else if (selected) {
      parts.push(`${a.name} +${audFromCents(a.priceCents)}`);
    }
  }
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

function sumAddOnRowsCents(rows: RollAddOn[], variantId: string, ids: Set<string>): number {
  let n = 0;
  for (const a of rows) n += addOnContributionCents(a, variantId, ids.has(a.id));
  return n;
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
  const ingredientAddOns = custom?.ingredientAddOns ?? NO_COMBO_ADDONS;
  const addOns = custom?.addOns ?? [];
  const allAddOnRows = useMemo<RollAddOn[]>(
    () =>
      !custom
        ? []
        : [
            ...(custom.comboAddOns ?? NO_COMBO_ADDONS),
            ...(custom.ingredientAddOns ?? NO_COMBO_ADDONS),
            ...(custom.addOns ?? NO_COMBO_ADDONS),
          ],
    [custom],
  );

  const [selectedPrimary, setSelectedPrimary] = useState(0);
  const [selectedSecondary, setSelectedSecondary] = useState(0);
  const [selectedToast, setSelectedToast] = useState(0);
  const [selectedSauce, setSelectedSauce] = useState(0);
  const [selectedMilk, setSelectedMilk] = useState(0);
  const [instructions, setInstructions] = useState("");
  const [addOnIds, setAddOnIds] = useState<Set<string>>(() => new Set());

  const open = item !== null && !!custom;

  const [mealHold, setMealHold] = useState<{ snapshotIds: Set<string> } | null>(null);

  /** Reset picker state synchronously before paint so variant add-on sync sees the correct primary. */
  useLayoutEffect(() => {
    if (!item?.id || !custom) return;
    setSelectedPrimary(0);
    setSelectedSecondary(0);
    setSelectedToast(0);
    setSelectedSauce(0);
    setSelectedMilk(0);
    setInstructions("");
    setAddOnIds(new Set());
    setMealHold(null);
    variantIdPrevRef.current = undefined;
  }, [item?.id, customizeOpenSeq, custom]);

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
    const inferred =
      custom?.primaryInferExactFillings && custom.primaryCustomFillVariantId
        ? inferPrimaryIndexExactFillings(primaryChoices, allAddOnRows, addOnIds, custom.primaryCustomFillVariantId)
        : inferVariantIndexFromAddons(primaryChoices, allAddOnRows, addOnIds);
    if (inferred !== selectedPrimary) {
      suppressPrimaryBundleSyncRef.current = true;
      setSelectedPrimary(inferred);
    }
  }, [
    open,
    item,
    custom?.primaryInferExactFillings,
    custom?.primaryCustomFillVariantId,
    primaryBundlesAddOnPricing,
    primaryChoices,
    allAddOnRows,
    addOnIds,
    selectedPrimary,
  ]);

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

    const customFillId = custom?.primaryCustomFillVariantId;
    const skipStripPrevBundles = !!(customFillId && variantId === customFillId);

    setAddOnIds((prev) => {
      const next = new Set(prev);
      if (!skipStripPrevBundles && prevVid !== undefined && prevVid !== variantId) {
        for (const a of allAddOnRows) {
          if (a.excludeForVariantIds?.includes(prevVid)) next.delete(a.id);
        }
      }
      for (const a of allAddOnRows) {
        if (a.excludeForVariantIds?.includes(variantId)) next.add(a.id);
      }
      return next;
    });
  }, [open, item, variantId, allAddOnRows, custom?.primaryCustomFillVariantId]);

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

  const toggleAddOn = (id: string) => {
    setAddOnIds((prev) => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  };

  const renderAddonCheckbox = (a: RollAddOn, keyPrefix: string) => {
    const selected = addOnIds.has(a.id);
    const aid = `${headingId}-${keyPrefix}-${a.id}`;
    return (
      <label
        key={aid}
        htmlFor={aid}
        className="flex w-full cursor-pointer flex-row items-start gap-3 rounded-xl border border-[rgba(255,122,0,0.18)] bg-[rgba(0,0,0,0.22)] px-3 py-2.5 text-left transition hover:border-[rgba(255,122,0,0.45)] has-[:checked]:border-[var(--cj-orange)]/55 has-[:checked]:bg-[rgba(255,122,0,0.08)]"
      >
        <input
          id={aid}
          type="checkbox"
          checked={selected}
          onChange={() => toggleAddOn(a.id)}
          className="mt-0.5 size-4 shrink-0 accent-[var(--cj-orange)]"
        />
        <span className="min-w-0 flex-1 text-sm font-semibold">{a.name}</span>
        <span
          className={`shrink-0 pt-0.5 font-display text-sm text-[var(--cj-orange)] ${selected ? "" : "opacity-[0.72]"}`}
        >
          {a.priceCents > 0 ? `+${audFromCents(a.priceCents)}` : ""}
        </span>
      </label>
    );
  };

  const commitCustomizeToCart = (checkoutAddOnIds: Set<string>) => {
    if (!item) return;

    const addOnsCheckoutCents = sumAddOnRowsCents(allAddOnRows, variantId, checkoutAddOnIds);
    const checkoutLineTotalCents =
      baseCoreCents +
      toastDeltaCents +
      secondaryExtraCents +
      sauceExtraCents +
      milkExtraCents +
      addOnsCheckoutCents;

    const showPrimaryPriceLine =
      primaryChoices.length > 1 ||
      (primaryChoices.length === 1 && primaryChoices[0]?.id !== STANDARD_BUILD_VARIANT_ID);
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
      ingredientAddOns,
      addOns,
      checkoutAddOnIds,
      variantId,
      toastDetailPick,
      showToastDetail,
      instructions,
    );
    addToCart({
      label: item.name,
      detail: detail || "As listed",
      quantity: 1,
      lineTotalCents: checkoutLineTotalCents,
    });
  };

  const handleAddBasket = () => {
    if (!item) return;
    const comboOffer = comboAddOns.length > 0;
    const comboAlreadyOn = comboAddOns.some((a) => addOnIds.has(a.id));
    if (comboOffer && !comboAlreadyOn) {
      setMealHold({ snapshotIds: new Set(addOnIds) });
      return;
    }
    commitCustomizeToCart(addOnIds);
  };

  const resolveMealHold = (includeCombo: boolean) => {
    if (!mealHold) return;
    const checkoutAddOnIds = new Set(mealHold.snapshotIds);
    if (includeCombo) comboAddOns.forEach((a) => checkoutAddOnIds.add(a.id));
    setMealHold(null);
    commitCustomizeToCart(checkoutAddOnIds);
  };

  const mealPromptHeadingId = `${headingId}-meal-prompt-title`;
  const comboExtraCentsPreview = comboAddOns.filter((a) => a.priceCents > 0).reduce((s, a) => s + a.priceCents, 0);

  const primaryTitle = custom?.primarySectionTitle ?? "Choose Options";
  const secondaryTitle = custom?.secondarySectionTitle ?? "Options";
  const toastTitle = custom?.toastSectionTitle ?? "Toast Level";
  const sauceTitle = custom?.sauceSectionTitle ?? "Sauce";
  const blockBeforeMilk = showPrimaryUi;
  const blockBeforeCombo = blockBeforeMilk || milkOptions.length > 0;
  const showComboUi = comboAddOns.length > 0;
  const blockBeforeIngredients = blockBeforeCombo || showComboUi;
  const showIngredientAddonsUi = ingredientAddOns.length > 0;
  const blockBeforeRegularAddons = blockBeforeIngredients || showIngredientAddonsUi;
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
      className="cj-roll-dialog mx-auto w-[min(100vw-1.5rem,26rem)] max-h-[min(92vh,40rem)] max-w-[calc(100vw-1.5rem)] overflow-hidden rounded-[1.35rem] border border-[rgba(255,122,0,0.35)] bg-[var(--cj-charcoal)] p-0 text-[var(--cj-cream)] shadow-2xl shadow-black/50"
    >
      {open && item && custom ? (
        <div className="relative flex min-h-0 max-h-[inherit] flex-col">
          {mealHold && comboAddOns.length > 0 ? (
            <div
              role="presentation"
              className="absolute inset-0 z-30 flex items-end justify-center bg-black/75 p-3 backdrop-blur-sm sm:items-center sm:p-6"
              onClick={(e) => {
                if (e.target === e.currentTarget) resolveMealHold(false);
              }}
            >
              <div
                role="dialog"
                aria-modal="true"
                aria-labelledby={mealPromptHeadingId}
                className="w-full max-w-[22rem] rounded-[1.25rem] border border-[rgba(255,122,0,0.4)] bg-[linear-gradient(160deg,rgba(42,27,20,0.98),rgba(8,6,5,0.98))] p-6 py-7 text-center shadow-[0_28px_64px_rgba(0,0,0,0.55)]"
                onClick={(e) => e.stopPropagation()}
              >
                <p className="text-[0.65rem] font-bold uppercase tracking-[0.28em] text-[var(--cj-orange)]">Meal upgrade</p>
                <h3 id={mealPromptHeadingId} className="font-display mt-2 text-xl font-semibold tracking-tight text-[var(--cj-cream)]">
                  Make it a meal?
                </h3>
                <div className="mt-4 space-y-2 rounded-xl border border-[rgba(255,122,0,0.15)] bg-[rgba(0,0,0,0.35)] px-4 py-3 text-left">
                  {comboAddOns.map((a) => (
                    <div key={a.id} className="flex justify-between gap-3 text-sm">
                      <span className="min-w-0 font-semibold text-[var(--cj-cream)]/92">{a.name}</span>
                      <span className="shrink-0 font-display text-[var(--cj-orange)]">
                        {a.priceCents > 0 ? audFromCents(a.priceCents) : ""}
                      </span>
                    </div>
                  ))}
                </div>
                <p className="mt-3 text-sm leading-relaxed text-[var(--cj-cream)]/72">
                  {comboExtraCentsPreview > 0 ? (
                    <>
                      Combo adds{" "}
                      <span className="font-display font-semibold text-[var(--cj-gold)]">{audFromCents(comboExtraCentsPreview)}</span>{" "}
                      all up.
                    </>
                  ) : (
                    <>Includes combo sides at listed prices.</>
                  )}
                </p>
                <p className="mt-2 text-xs text-[var(--cj-cream)]/55">
                  Continue without keeps your burger only — still added to basket.
                </p>
                <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center sm:gap-3">
                  <button
                    type="button"
                    onClick={() => resolveMealHold(false)}
                    className="min-h-[2.85rem] w-full shrink-0 rounded-full border border-[rgba(255,243,214,0.22)] px-4 text-sm font-bold text-[var(--cj-cream)] transition hover:border-[var(--cj-orange)]/45 sm:flex-1"
                  >
                    No thanks — add burger only
                  </button>
                  <button
                    type="button"
                    onClick={() => resolveMealHold(true)}
                    className="min-h-[2.85rem] w-full shrink-0 rounded-full bg-[var(--cj-orange)] px-4 text-sm font-bold text-[var(--cj-charcoal)] shadow-md transition hover:brightness-110 sm:flex-1"
                  >
                    Yes — make it a meal
                  </button>
                </div>
              </div>
            </div>
          ) : null}

          <button
            type="button"
            onClick={close}
            className="absolute right-3 top-3 z-40 grid size-9 place-items-center rounded-xl border border-[rgba(255,243,214,0.12)] text-[var(--cj-cream)] transition hover:border-[var(--cj-orange)]/40 hover:text-[var(--cj-gold)]"
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

          <div ref={scrollAreaRef} className="cj-customize-scroll min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-4 text-left">
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
                        <span className="shrink-0 min-w-[3rem] text-right font-display text-sm tabular-nums text-[var(--cj-orange)]">
                          {m.priceCents > 0 ? `+${audFromCents(m.priceCents)}` : ""}
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
                    Make it a meal
                  </legend>
                  {comboAddOns.map((a) => renderAddonCheckbox(a, "combo"))}
                </fieldset>
              </div>
            ) : null}

            {showIngredientAddonsUi ? (
              <div className={blockBeforeIngredients ? "mt-6" : "mt-4"}>
                <fieldset className="space-y-2">
                  <legend className="mb-2 w-full px-1 text-center text-xs font-bold uppercase tracking-[0.2em] text-[var(--cj-orange)]">
                    Ingredients
                  </legend>
                  {ingredientAddOns.map((a) => renderAddonCheckbox(a, "fill"))}
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
                      <span className="shrink-0 min-w-[3rem] text-right font-display text-sm tabular-nums text-[var(--cj-orange)]">
                        {s.priceCents > 0 ? `+${audFromCents(s.priceCents)}` : ""}
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
                      <span className="shrink-0 min-w-[3rem] text-right font-display text-sm tabular-nums text-[var(--cj-orange)]">
                        {c.priceCents > 0 ? `+${audFromCents(c.priceCents)}` : ""}
                      </span>
                    </label>
                  );
                })}
              </fieldset>
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
            </div>

            <label className="mt-6 block text-left">
              <span className="block text-center text-xs font-bold uppercase tracking-[0.2em] text-[var(--cj-orange)]">Special instructions</span>
              <textarea
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                rows={3}
                placeholder="No Sauce, Extra Crispy, Cut In Half…"
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
