export const loginAPI = async (email, password, rememberMe = false) => {
  const response = await fetch(
    `${import.meta.env.VITE_BACK_SERVER}/member/login`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, rememberMe }),
    }
  );
  return await response.json();
};

export const logout = (setLoginUser) => {
  setLoginUser(null);
  localStorage.removeItem("loginUser");
  window.location.href = "/login";
};
