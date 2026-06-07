export const saveAuthToStorage = (accessToken: string, user: any) => {
  localStorage.setItem("access_token", accessToken);
  localStorage.setItem("user", JSON.stringify(user));
};

export const getAuthFromStorage = () => {
  const accessToken = localStorage.getItem("access_token");
  const userRaw = localStorage.getItem("user");

  return {
    accessToken,
    user: userRaw ? JSON.parse(userRaw) : null,
  };
};

export const clearAuthStorage = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("user");
};