"use client";

import type { ReactNode } from "react";
import { MenuCartStrip } from "@/components/menu-cart-strip";
import { MenuCustomizeModal } from "@/components/menu-customize-modal";
import { OrderProvider } from "@/components/order-context";

export function OrderShell({ children }: { children: ReactNode }) {
  return (
    <OrderProvider>
      {children}
      <MenuCustomizeModal />
      <MenuCartStrip />
    </OrderProvider>
  );
}
