"use client";

import { useSyncExternalStore } from "react";

// Persisted stores (cart, wishlist…) only exist in the browser, so anything
// that reads them has to wait until after hydration or React will complain.
const subscribe = () => () => {};
export function useHydrated() {
  return useSyncExternalStore(subscribe, () => true, () => false);
}
