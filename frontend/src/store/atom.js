import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist({
  key: 'recoil-persist-invoice',
  storage: localStorage,
});

export const viewAtom = atom({
  key: 'viewAtom',
  default: {},
  effects_UNSTABLE: [persistAtom],
});

export const invoiceAtom = atom({
  key: 'invoiceAtom',
  default: {},
  effects_UNSTABLE: [persistAtom],
});

// Stores full company config fetched from /company/config
// Persisted so the app works across page refreshes without re-fetching
export const companyAtom = atom({
  key: 'companyAtom',
  default: null,   // null = not yet loaded
  effects_UNSTABLE: [persistAtom],
});

export const userAtom = atom({
  key: 'userAtom',
  default: null,
  effects_UNSTABLE: [persistAtom],
});
