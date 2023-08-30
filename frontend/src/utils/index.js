export function truncate(str, n) {
  return str.length > n
    ? str.substr(0, n - 1) + '...' + str.substr(str.length - 4, str.length - 1)
    : str;
}

export const contractAddress = "0x292C7D4896f76B7eFFA4471cd7fb8EeEF48E33E6";
