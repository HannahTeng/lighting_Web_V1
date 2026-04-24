"use client";

import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  type ReactNode,
} from "react";

export type CartItem = {
  slug: string;
  name: string;
  price_jpy: number;
  image: string;
  quantity: number;
};

type CartState = { items: CartItem[] };

type Action =
  | { type: "ADD"; item: Omit<CartItem, "quantity"> }
  | { type: "REMOVE"; slug: string }
  | { type: "SET_QTY"; slug: string; qty: number }
  | { type: "CLEAR" }
  | { type: "HYDRATE"; items: CartItem[] };

function reducer(state: CartState, action: Action): CartState {
  switch (action.type) {
    case "ADD": {
      const existing = state.items.find((i) => i.slug === action.item.slug);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.slug === action.item.slug ? { ...i, quantity: i.quantity + 1 } : i
          ),
        };
      }
      return { items: [...state.items, { ...action.item, quantity: 1 }] };
    }
    case "REMOVE":
      return { items: state.items.filter((i) => i.slug !== action.slug) };
    case "SET_QTY":
      return {
        items: state.items.map((i) =>
          i.slug === action.slug ? { ...i, quantity: Math.max(1, action.qty) } : i
        ),
      };
    case "CLEAR":
      return { items: [] };
    case "HYDRATE":
      return { items: action.items };
    default:
      return state;
  }
}

const CartContext = createContext<{
  items: CartItem[];
  add: (item: Omit<CartItem, "quantity">) => void;
  remove: (slug: string) => void;
  setQty: (slug: string, qty: number) => void;
  clear: () => void;
  total: number;
  count: number;
} | null>(null);

const STORAGE_KEY = "orikami_cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { items: [] });

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) dispatch({ type: "HYDRATE", items: JSON.parse(raw) });
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
  }, [state.items]);

  const total = state.items.reduce(
    (sum, i) => sum + i.price_jpy * i.quantity,
    0
  );
  const count = state.items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        add: (item) => dispatch({ type: "ADD", item }),
        remove: (slug) => dispatch({ type: "REMOVE", slug }),
        setQty: (slug, qty) => dispatch({ type: "SET_QTY", slug, qty }),
        clear: () => dispatch({ type: "CLEAR" }),
        total,
        count,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be inside CartProvider");
  return ctx;
}
