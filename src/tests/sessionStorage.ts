
type StoreType = {
  [key: string]: string;
};
// sessionStorageのMock
export const sessionStorageMock = (() => {
  let store: StoreType = {};

  return {
    getItem(key: string) {
      return store[key] || null;
    },
    setItem(key: string, value: string) {
      store[key] = value.toString();
    },
    clear() {
      store = {};
    },
  };
})();



// ユーザー情報の取得
export function getUserInfo() {
  const userInfo = window.sessionStorage.getItem('auth');
  if (userInfo) {
    return JSON.parse(userInfo);
  }
  return {};
}
