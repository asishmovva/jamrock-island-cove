"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { calculateOrderTotals } from "@/lib/order-pricing";
import type { CartLineItem, FulfillmentType } from "@/lib/order-types";

type CartState = {
  items: CartLineItem[];
  tipCents: number;
  fulfillmentType: FulfillmentType;
};

type CartContextValue = CartState & {
  subtotalCents: number;
  taxCents: number;
  deliveryFeeCents: number;
  totalCents: number;
  addItem: (item: Omit<CartLineItem, "qty">, qty?: number) => void;
  setItemQuantity: (menuItemId: string, qty: number) => void;
  setItemInstructions: (menuItemId: string, specialInstructions: string) => void;
  removeItem: (menuItemId: string) => void;
  setTipCents: (tipCents: number) => void;
  setFulfillmentType: (type: FulfillmentType) => void;
  clearCart: () => void;
};

const STORAGE_KEY = "jamrock.cart.v1";

const CartContext = createContext<CartContextValue | null>(null);

const initialState: CartState = {
  items: [],
  tipCents: 0,
  fulfillmentType: "PICKUP",
};

function sanitizeCartState(value: unknown): CartState {
  if (!value || typeof value !== "object") {
    return initialState;
  }

  const candidate = value as Partial<CartState>;
  const items = Array.isArray(candidate.items)
    ? candidate.items
        .filter((item): item is CartLineItem =>
          Boolean(
            item &&
            typeof item === "object" &&
            typeof item.menuItemId === "string" &&
            typeof item.name === "string" &&
            typeof item.priceCents === "number" &&
            typeof item.qty === "number" &&
            typeof item.type === "string",
          ),
        )
        .map((item) => ({
          ...item,
          qty: Math.min(50, Math.max(1, Math.floor(item.qty))),
          specialInstructions: item.specialInstructions?.trim() || "",
        }))
    : [];

  const tipCents =
    typeof candidate.tipCents === "number" && Number.isFinite(candidate.tipCents)
      ? Math.max(0, Math.floor(candidate.tipCents))
      : 0;
  const fulfillmentType = candidate.fulfillmentType === "DELIVERY" ? "DELIVERY" : "PICKUP";

  return { items, tipCents, fulfillmentType };
}

type CartProviderProps = {
  children: React.ReactNode;
};

export function CartProvider({ children }: CartProviderProps) {
  const [state, setState] = useState<CartState>(() => {
    if (typeof window === "undefined") {
      return initialState;
    }

    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return initialState;
    }

    try {
      return sanitizeCartState(JSON.parse(raw));
    } catch {
      localStorage.removeItem(STORAGE_KEY);
      return initialState;
    }
  });

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const totals = useMemo(
    () =>
      calculateOrderTotals({
        items: state.items.map((item) => ({ priceCents: item.priceCents, qty: item.qty })),
        tipCents: state.tipCents,
        fulfillmentType: state.fulfillmentType,
      }),
    [state.fulfillmentType, state.items, state.tipCents],
  );

  const value = useMemo<CartContextValue>(
    () => ({
      ...state,
      ...totals,
      addItem: (item, qty = 1) => {
        setState((current) => {
          const nextQty = Math.max(1, Math.floor(qty));
          const found = current.items.find((existing) => existing.menuItemId === item.menuItemId);

          if (!found) {
            return {
              ...current,
              items: [...current.items, { ...item, qty: nextQty }],
            };
          }

          return {
            ...current,
            items: current.items.map((existing) =>
              existing.menuItemId === item.menuItemId
                ? { ...existing, qty: Math.min(50, existing.qty + nextQty) }
                : existing,
            ),
          };
        });
      },
      setItemQuantity: (menuItemId, qty) => {
        const nextQty = Math.floor(qty);

        setState((current) => ({
          ...current,
          items:
            nextQty <= 0
              ? current.items.filter((item) => item.menuItemId !== menuItemId)
              : current.items.map((item) =>
                  item.menuItemId === menuItemId
                    ? { ...item, qty: Math.min(50, Math.max(1, nextQty)) }
                    : item,
                ),
        }));
      },
      setItemInstructions: (menuItemId, specialInstructions) => {
        setState((current) => ({
          ...current,
          items: current.items.map((item) =>
            item.menuItemId === menuItemId ? { ...item, specialInstructions } : item,
          ),
        }));
      },
      removeItem: (menuItemId) => {
        setState((current) => ({
          ...current,
          items: current.items.filter((item) => item.menuItemId !== menuItemId),
        }));
      },
      setTipCents: (tipCents) => {
        setState((current) => ({ ...current, tipCents: Math.max(0, Math.floor(tipCents)) }));
      },
      setFulfillmentType: (fulfillmentType) => {
        setState((current) => ({ ...current, fulfillmentType }));
      },
      clearCart: () => {
        setState(initialState);
      },
    }),
    [state, totals],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }

  return context;
}
