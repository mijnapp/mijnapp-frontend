const lastPageStorageKey = 'mijnApp-lastPage';

export const setLastPage = (lastPage) => {
  var lastPageString = JSON.stringify(lastPage);
  window.sessionStorage.setItem(lastPageStorageKey, lastPageString);
};

export const removeLastPage = () => {
  window.sessionStorage.removeItem(lastPageStorageKey);
};

export const getLastPage = () => {
  const lastPageString = window.sessionStorage.getItem(lastPageStorageKey);
  const lastPage = JSON.parse(lastPageString);
  return lastPage ? lastPage : '';
};
