export function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function isUpperCase(str: string) {
  return str === str.toUpperCase();
}

export function isLowerCase(str: string) {
  return str === str.toLowerCase();
}

export function camelCaseToSpace(str: string) {
  let newStr = "";
  for (let i = 0; i < str.length; i++) {
    const char = str.charAt(i);
    if (isUpperCase(char))
      newStr += " ";
    newStr += str.charAt(i);
  }
  return newStr;
}