"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import type { BoardMenuItem } from "@/lib/menu-data";

export type CartLine = {
  id: string;
  label: string;
  detail: string;
  quantity: number;
  lineTotalCents: number;
};

type OrderContextValue = {
  cart: CartLine[];
  addToCart: (line: Omit<CartLine, "id">) => void;
  removeLine: (lineId: string) => void;
  subtotalCents: number;
  customizeTarget: BoardMenuItem | null;
  openCustomize: (item: BoardMenuItem) => void;
  closeCustomize: () => void;
};

const OrderContext = createContext<OrderContextValue | null>(null);

function newLineId() {
  return `line-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function useOrderCart() {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error("useOrderCart must be used within OrderProvider");
  return ctx;
}

export function OrderProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartLine[]>([]);
  const [customizeTarget, setCustomizeTarget] = useState<BoardMenuItem | null>(null);

  const openCustomize = useCallback((item: BoardMenuItem) => {
    if (item.customization) setCustomizeTarget(item);
  }, []);

  const closeCustomize = useCallback(() => setCustomizeTarget(null), []);

  const addToCart = useCallback((line: Omit<CartLine, "id">) => {
    setCart((prev) => [...prev, { ...line, id: newLineId() }]);
    setCustomizeTarget(null);
  }, []);

  const removeLine = useCallback((lineId: string) => {
    setCart((prev) => prev.filter((l) => l.id !== lineId));
  }, []);

  const subtotalCents = useMemo(() => cart.reduce((s, l) => s + l.lineTotalCents * l.quantity, 0), [cart]);

  const value = useMemo<OrderContextValue>(
    () => ({
      cart,
      addToCart,
      removeLine,
      subtotalCents,
      customizeTarget,
      openCustomize,
      closeCustomize,
    }),
    [cart, addToCart, removeLine, subtotalCents, customizeTarget, openCustomize, closeCustomize],
  );

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
}
