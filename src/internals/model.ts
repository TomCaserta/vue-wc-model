import { IModelParseResult } from '../types/vue-compiler.interface';

// Taken from https://github.com/vuejs/vue/blob/dev/src/compiler/directives/model.js
// As vue doesn't expose this method... On a side note, this is a somewhat dodgy way of doing this.

export function genAssignmentCode(
    value: string,
    assignment: string,
): string {
    const res = parseModel(value);
    if (res.key === null) {
      return `${value}=${assignment}`;
    } else {
      return `$set(${res.exp}, ${res.key}, ${assignment})`;
    }
}


let len: number;
let str: string;
let chr: number;
let index: number;
let expressionPos: number;
let expressionEndPos: number;

export function parseModel(val: string): IModelParseResult {
    // Fix https://github.com/vuejs/vue/pull/7730
    // allow v-model="obj.val " (trailing whitespace)
    val = val.trim();
    len = val.length;

    if (val.indexOf('[') < 0 || val.lastIndexOf(']') < len - 1) {
      index = val.lastIndexOf('.');
      if (index > -1) {
        return {
          exp: val.slice(0, index),
          key: '"' + val.slice(index + 1) + '"',
        };
      } else {
        return {
          exp: val,
          key: null,
        };
      }
    }

    str = val;
    index = expressionPos = expressionEndPos = 0;

    while (!eof()) {
      chr = next();
      /* istanbul ignore if */
      if (isStringStart(chr)) {
        parseString();
      } else if (chr === 0x5B) {
        parseBracket();
      }
    }

    return {
      exp: val.slice(0, expressionPos),
      key: val.slice(expressionPos + 1, expressionEndPos),
    };
  }

function next(): number {
  return str.charCodeAt(++index);
}

function eof(): boolean {
  return index >= len;
}

function isStringStart(char: number): boolean {
  return char === 0x22 || char === 0x27;
}

function parseBracket(): void {
  let inBracket = 1;
  expressionPos = index;
  while (!eof()) {
    chr = next();
    if (isStringStart(chr)) {
      parseString();
      continue;
    }
    if (chr === 0x5B) { inBracket++; }
    if (chr === 0x5D) { inBracket--; }
    if (inBracket === 0) {
      expressionEndPos = index;
      break;
    }
  }
}

function parseString(): void {
  const stringQuote = chr;
  while (!eof()) {
    chr = next();
    if (chr === stringQuote) {
      break;
    }
  }
}
