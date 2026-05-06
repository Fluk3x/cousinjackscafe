"use client";

import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from "react";
import { X } from "lucide-react";
import { useOrderCart } from "@/components/order-context";
import { cafe } from "@/lib/content";
import { audFromCents, type BoardMenuItem, type RollAddOn, type RollVariantChoice } from "@/lib/menu-data";

const NO_COMBO_ADDONS: RollAddOn[] = [];

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
    if (!addOnIds.has(a.id)) continue;
    const bundled = !!(a.excludeForVariantIds?.includes(variantId));
    if (bundled) parts.push(a.name);
    else parts.push(`${a.name} +${audFromCents(a.priceCents)}`);
  }
  for (const n of removalNames) parts.push(n);
  if (instructions.trim()) parts.push(`Note: ${instructions.trim()}`);
  return parts.join(" · ");
}

function addOnLinePrice(a: RollAddOn, variantId: string): number {
  if (!a.excludeForVariantIds?.includes(variantId)) return a.priceCents;
  return 0;
}

export function MenuCustomizeModal() {
  const { customizeTarget: item, closeCustomize, addToCart } = useOrderCart();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const variantIdPrevRef = useRef<string | undefined>(undefined);
  const headingId = useId();
  const custom = item?.customization;
  const primaryChoices = custom?.primaryChoices ?? [];
  const secondaryChoices = custom?.secondaryChoices ?? [];
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
  }, [item, custom]);
  const variant = primaryChoices[selectedPrimary];
  const variantId = variant?.id ?? "";
  const showPrimaryUi = primaryChoices.length > 1;
  const secondaryPick = secondaryChoices[selectedSecondary];
  const showSecondaryUi = secondaryChoices.length > 0;
  const saucePick = sauceChoices[selectedSauce];
  const showSauceUi = sauceChoices.length > 0;

  /** Turn off bundled add-ons for the previous variant, then apply this variant (+$0 on bundled lines). */
  useEffect(() => {
    if (!open || !item || allAddOnRows.length === 0) return;

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
    if (!addOnIds.has(a.id)) continue;
    addOnsTotalCents += addOnLinePrice(a, variantId);
  }

  const baseCoreCents =
    variant?.priceCents ?? item?.basePriceCents ?? (primaryChoices[0]?.priceCents ?? 0);
  const secondaryExtraCents = showSecondaryUi ? (secondaryChoices[selectedSecondary]?.priceCents ?? 0) : 0;
  const sauceExtraCents = showSauceUi ? (sauceChoices[selectedSauce]?.priceCents ?? 0) : 0;
  const milkExtraCents = milkOptions.length > 0 ? (milkOptions[selectedMilk]?.priceCents ?? 0) : 0;
  const totalCents = baseCoreCents + secondaryExtraCents + sauceExtraCents + milkExtraCents + addOnsTotalCents;

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
    const aid = `${headingId}-${keyPrefix}-${a.id}`;
    const priceLabel =
      bundled && addOnIds.has(a.id) ? (
        <span className="max-w-[5.25rem] shrink-0 pt-0.5 text-right text-[0.7rem] font-semibold uppercase tracking-[0.08em] text-[var(--cj-cream)]/48">
          In bundle
        </span>
      ) : bundled && !addOnIds.has(a.id) ? (
        <span className="shrink-0 pt-0.5 text-right font-display text-sm text-[var(--cj-cream)]/42">Off</span>
      ) : (
        <span className="shrink-0 font-display text-sm text-[var(--cj-orange)] pt-0.5">+{audFromCents(a.priceCents)}</span>
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
  const sauceTitle = custom?.sauceSectionTitle ?? "Sauce";
  const blockBeforeMilk = showPrimaryUi || showSecondaryUi;
  const blockBeforeCombo = blockBeforeMilk || milkOptions.length > 0;
  const showComboUi = comboAddOns.length > 0;
  const blockBeforeRegularAddons = blockBeforeCombo || showComboUi;
  const blockBeforeSauceAfterExtras = blockBeforeRegularAddons || addOns.length > 0;

  useLayoutEffect(() => {
    if (open && scrollAreaRef.current) scrollAreaRef.current.scrollTop = 0;
  }, [open, item?.id]);

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
              <span>{audFromCents(baseCoreCents)}</span>
              {milkExtraCents > 0 ? <span>{` · +${audFromCents(milkExtraCents)} milk`}</span> : null}
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
                          name="primary-variant"
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

            {showSecondaryUi ? (
              <fieldset className={`space-y-2 ${showPrimaryUi ? "mt-6" : "mt-4"}`}>
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
                  <p className="mx-auto mb-3 max-w-[22rem] text-center text-[0.7rem] leading-relaxed text-[var(--cj-cream)]/50">
                    Chips and drink together.
                  </p>
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
                  <p className="mx-auto mb-3 max-w-[22rem] text-center text-[0.7rem] leading-relaxed text-[var(--cj-cream)]/50">
                    Draft modifier prices for the builder. Confirm at the counter.
                  </p>
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

            {removals.length > 0 ? (
              <div className="mt-6">
                <fieldset className="space-y-2">
                  <legend className="mb-2 w-full px-1 text-center text-xs font-bold uppercase tracking-[0.2em] text-[var(--cj-orange)]">
                    Remove
                  </legend>
                  <p className="mx-auto mb-3 max-w-[22rem] text-center text-[0.7rem] text-[var(--cj-cream)]/50">
                    No charge. Tell the kitchen when you pick up.
                  </p>
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

          <div className="flex flex-col items-center gap-2 border-t border-[rgba(255,122,0,0.12)] px-5 py-4 sm:flex-row sm:flex-wrap sm:justify-center">
            <button
              type="button"
              onClick={close}
              className="w-full min-w-[8rem] rounded-full border border-[rgba(255,243,214,0.2)] px-5 py-3 text-sm font-bold text-[var(--cj-cream)] transition hover:border-[var(--cj-orange)]/45 sm:w-auto"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleAddBasket}
              className="w-full min-w-[8rem] rounded-full bg-[var(--cj-orange)] px-5 py-3 text-sm font-bold text-[var(--cj-charcoal)] shadow-lg transition hover:brightness-110 sm:w-auto"
            >
              Add to basket
            </button>
            <a
              href={cafe.orderUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex w-full min-w-[8rem] justify-center rounded-full border border-[rgba(255,243,214,0.22)] px-5 py-3 text-sm font-bold text-[var(--cj-cream)] transition hover:border-[var(--cj-orange)]/45 sm:w-auto"
            >
              Live order website
            </a>
          </div>
        </div>
      ) : null}
    </dialog>
  );
}
