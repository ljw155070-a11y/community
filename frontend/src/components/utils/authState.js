import { atom, selector } from "recoil";

// persist 효과 제거 - 수동으로 관리
export const loginUserState = atom({
  key: "loginUserState",
  default: null,
  // effects 제거
});

export const isAuthenticatedState = selector({
  key: "isAuthenticatedState",
  get: ({ get }) => get(loginUserState) !== null,
});
