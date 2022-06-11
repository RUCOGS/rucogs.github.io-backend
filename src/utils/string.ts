export function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function isUpperCase(str: string) {
  return str === str.toUpperCase();
}

export function isLowerCase(str: string) {
  return str === str.toLowerCase();
}

export function spaceToSnakeCase(str: string) {
  let newStr = "";
  for (let i = 0; i < str.length; i++) {
    const char = str.charAt(i);
    if (char === ' ')
      newStr += '_'
    else
      newStr += char;
  }
  return newStr;
}

export function camelCaseToSpace(str: string) {
  let newStr = "";
  for (let i = 0; i < str.length; i++) {
    const char = str.charAt(i);
    if (isUpperCase(char))
      newStr += " ";
    newStr += char;
  }
  return newStr;
}

export function camelCaseToSnakeCase(str: string) {
  return spaceToSnakeCase(camelCaseToSpace(str));
}