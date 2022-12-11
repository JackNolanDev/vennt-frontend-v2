import indefinite from "indefinite";
import pluralize from "pluralize";
import DOMPurify from "dompurify";
import { marked } from "marked";
import type { HTMLString } from "./backendTypes";
import { KeepSyntaxRenderer } from "./MarkedRenderers/KeepSyntaxRenderer";

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

export const pluralizeName = (givenName: string, cleanup = true): string => {
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
};

type MarkDownParams = {
  keepSyntax?: boolean;
  inline?: boolean;
};

export const configurableMarkDown = (
  text: string,
  params: MarkDownParams
): HTMLString => {
  const markedOption: marked.MarkedOptions = {
    smartypants: true,
  };
  if (params.keepSyntax) {
    markedOption.renderer = new KeepSyntaxRenderer();
  }
  let html = "";
  if (params.inline) {
    html = marked.parseInline(text, markedOption);
  } else {
    html = marked.parse(text, markedOption);
  }
  if (!params.inline && params.keepSyntax) {
    html = html.replaceAll(/\n/gm, "<br>");
  }
  if (params.keepSyntax) {
    html = html.replaceAll(/ (?= )/gm, "&nbsp;");
  }
  html = noBreakTrippleDigit(html);
  // console.log(html);
  return DOMPurify.sanitize(html);
};

const noBreakTrippleDigit = (text: string): string => {
  const tripleDigitRegex = /\[\s\+?-?\d+\s\/\s\+?-?\d+\s\/\s\+?-?\d+\s\]/gm;
  return text.replaceAll(tripleDigitRegex, (match) =>
    match.replaceAll(/\s/gim, "&nbsp;")
  );
};
