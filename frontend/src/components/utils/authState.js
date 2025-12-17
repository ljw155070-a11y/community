import { atom, selector } from "recoil";

export const loginUserState = atom({
  key: "loginUserState",
  default: null,
  effects: [
    ({ setSelf, onSet }) => {
      const savedUser = localStorage.getItem("loginUser");
      if (savedUser) setSelf(JSON.parse(savedUser));
      onSet((newValue, _, isReset) => {
        isReset || newValue === null
          ? localStorage.removeItem("loginUser")
          : localStorage.setItem("loginUser", JSON.stringify(newValue));
      });
    },
  ],
});

export const isAuthenticatedState = selector({
  key: "isAuthenticatedState",
  get: ({ get }) => get(loginUserState) !== null,
});
