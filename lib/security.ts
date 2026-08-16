/**
 * Security utility functions to prevent XSS and other injection attacks.
 */

/**
 * Sanitizes a string by escaping HTML special characters.
 * This is a basic server-side protection against XSS.
 * @param str The string to sanitize
 * @returns The sanitized string
 */
export function sanitize(str: string): string {
  if (!str || typeof str !== "string") return str;

  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Sanitizes an object by recursively sanitizing all string properties.
 * @param obj The object to sanitize
 * @returns The sanitized object
 */
export function sanitizeObject<T>(obj: T): T {
  if (!obj || typeof obj !== "object") return obj;

  const sanitized = (Array.isArray(obj) ? [] : {}) as Record<string, unknown>;
  const source = obj as Record<string, unknown>;

  for (const key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      const value = source[key];
      if (typeof value === "string") {
        sanitized[key] = sanitize(value);
      } else if (typeof value === "object" && value !== null) {
        sanitized[key] = sanitizeObject(value);
      } else {
        sanitized[key] = value;
      }
    }
  }

  return sanitized as unknown as T;
}

/**
 * Basic SQL injection prevention for strings (though Prisma handle this automatically).
 * This is more for extra layer of safety if using raw queries.
 */
export function escapeSql(str: string): string {
  if (!str || typeof str !== "string") return str;
  return str.replace(/[\0\x08\x09\x1a\n\r"'\\%]/g, (char) => {
    switch (char) {
      case "\0": return "\\0";
      case "\x08": return "\\b";
      case "\x09": return "\\t";
      case "\x1a": return "\\z";
      case "\n": return "\\n";
      case "\r": return "\\r";
      case "\"":
      case "'":
      case "\\":
      case "%":
        return "\\" + char;
      default:
        return char;
    }
  });
}
