import type { z } from "zod";

export const fieldValidator = <T extends z.ZodTypeAny>(
  parser: T,
  any: any,
  base?: any
): string | false => {
  if (any === base) {
    return false;
  }
  const valid = parser.safeParse(any);
  if (valid.success) {
    return false;
  }
  return valid.error.issues.length === 0
    ? valid.error.message
    : valid.error.issues[0].message;
};
