export function generatePassword(): string {
  let charSet =
    "1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!";
  let result = "";
  for (let idx = 0; idx < 8; idx++) {
    result += charSet.charAt(Math.floor(Math.random() * charSet.length));
  }
  return result;
}
