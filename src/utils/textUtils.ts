import indefinite from "indefinite";
import pluralize from "pluralize";

export const improveTextForDisplay = (text: string): string => {
  // regex from https://leancrew.com/all-this/2010/11/smart-quotes-in-javascript/
  text = text.replace(/(^|[-\u2014\s(["])'/g, "$1\u2018"); // opening singles
  text = text.replace(/'/g, "\u2019"); // closing singles & apostrophes
  text = text.replace(/(^|[-\u2014/[(\u2018\s])"/g, "$1\u201c"); // opening doubles
  text = text.replace(/"/g, "\u201d"); // closing doubles
  text = text.replace(/--/g, "\u2014"); // em-dashes
  return text;
};

export function prefixName(givenName: string, action = "", cleanup = true) {
  let name = givenName;
  if (action !== "") {
    const commaPos = name.search(/,|\*| \(/gm);
    let word = givenName;
    let rest = "";
    if (commaPos >= 0) {
      word = givenName.substring(0, commaPos);
      rest = givenName.substring(commaPos);
    }
    if (pluralize.isPlural(word) || isSpecialPlural(word)) {
      name = `${action} ${givenName}`;
    } else {
      name = `${action} ${indefinite(word)}${rest}`;
    }
  }
  if (cleanup) {
    name = improveTextForDisplay(name);
  }
  return name;
}

function isSpecialPlural(name: string) {
  const plurals = ["Ammunition", "Ammo", "Armor", "Alcohol", "Rust"];
  return plurals.some((word) => name.includes(word));
}

export function pluralizeName(givenName: string, cleanup = true) {
  let name = givenName;
  const commaPos = name.search(/,|\*| \(/gm);
  let word = givenName;
  let rest = "";
  if (commaPos >= 0) {
    word = givenName.substring(0, commaPos);
    rest = givenName.substring(commaPos);
  }
  if (!(pluralize.isPlural(word) || isSpecialPlural(word))) {
    name = `${pluralize(word)}${rest}`;
  }
  if (cleanup) {
    name = improveTextForDisplay(name);
  }
  return name;
}
