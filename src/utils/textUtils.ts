import indefinite from "indefinite";
import pluralize from "pluralize";
import DOMPurify from "dompurify";
import { marked } from "marked";
import type { HTMLString, UpdatedEntityAttributes } from "./backendTypes";
import { solveEquation } from "./attributeUtils";

export const improveTextForDisplay = (text: string): string => {
  // regex from https://leancrew.com/all-this/2010/11/smart-quotes-in-javascript/
  text = text.replace(/(^|[-\u2014\s(["])'/g, "$1\u2018"); // opening singles
  text = text.replace(/'/g, "\u2019"); // closing singles & apostrophes
  text = text.replace(/(^|[-\u2014/[(\u2018\s])"/g, "$1\u201c"); // opening doubles
  text = text.replace(/"/g, "\u201d"); // closing doubles
  text = text.replace(/--/g, "\u2014"); // em-dashes
  return text;
};

export const prefixName = (
  givenName: string,
  action = "",
  cleanup = true
): string => {
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
};

const isSpecialPlural = (name: string): boolean => {
  const plurals = ["Ammunition", "Ammo", "Armor", "Alcohol", "Rust"];
  return plurals.some((word) => name.includes(word));
};

export const pluralizeName = (
  givenName: string,
  cleanup = true,
  count = 0,
  action = ""
): string => {
  let name = givenName;
  if (count !== 1) {
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
  }
  if (count === 1 && action) {
    return prefixName(givenName, action, cleanup);
  }
  if (count !== 0) {
    name = `${count} ${name}`;
  }
  if (action) {
    name = `${action} ${name}`;
  }
  if (cleanup) {
    name = improveTextForDisplay(name);
  }
  return name;
};

export const renderMarkdown = (
  text: string,
  attrs?: UpdatedEntityAttributes
): HTMLString => {
  const markedOption: marked.MarkedOptions = {
    smartypants: true,
  };
  let html = marked.parse(text, markedOption);
  html = noBreakTrippleDigit(html);
  html = clearTemplateStrings(html);
  html = solveEquationsInText(html, attrs);
  return DOMPurify.sanitize(html);
};

const noBreakTrippleDigit = (text: string): string => {
  const tripleDigitRegex = /\[\s\+?-?\w+\s\/\s\+?-?\w+\s\/\s\+?-?\w+\s\]/gm;
  return text.replaceAll(tripleDigitRegex, (match) =>
    match.replaceAll(/\s/gim, "&nbsp;")
  );
};

const clearTemplateStrings = (text: string): string => {
  const templateRegex = /\[\[[^\]]+\]\]/gm;
  return text.replaceAll(templateRegex, (match) =>
    match.substring(2, match.length - 2)
  );
};

export const solveEquationsInText = (
  text: string,
  attrs?: UpdatedEntityAttributes
): string => {
  const equationRegex = /{{[^}]+}}/gm;
  return text.replaceAll(equationRegex, (match) => {
    const equation = match.substring(2, match.length - 2);
    if (!attrs) {
      return equation;
    }
    const solvedEquation = solveEquation(equation, attrs);
    if (solvedEquation === undefined) {
      return equation;
    }
    return `${equation} (${solvedEquation})`;
  });
};

export function stringToLinkID(str: string) {
  str = str.replace(/[ (),'":*]/gm, "-");
  str = str.replace(/\./gm, "_");
  str = str.replace(/[^a-zA-Z0-9-_:.]/gm, ""); // remove any invalid characters
  return str;
}

export const editorEmpty = (text: string): boolean =>
  !text || text === "<p></p>";

export const titleText = (text: string): string => {
  return (
    text.charAt(0).toUpperCase() +
    text.slice(1).toLowerCase().replaceAll("_", " ")
  );
};
