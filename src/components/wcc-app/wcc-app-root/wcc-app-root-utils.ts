import { AppError } from '../../../interfaces';

export function subscribeToErrors() {
  window.onerror = function (msg, url, lineNo, columnNo, error) {
    var string = typeof msg === "string" ? msg.toLowerCase() : "";
    var substring = "script error";
    let appError: AppError;
    if (string.indexOf(substring) > -1) {
      appError = {
        message: "script error",
        isScriptError: true,
      };
    } else {
      appError = {
        message: typeof msg === "string" ? msg : JSON.stringify(msg),
        url,
        lineNo,
        columnNo,
        error,
      };
    }

    window.dispatchEvent(new CustomEvent("wccAppError", { detail: appError }));

    return false;
  };
}

export function subscribeToWarnings() {
  const originalWarn = console.warn;
  console.warn = function () {
    window.dispatchEvent(
      new CustomEvent("wccAppWarning", { detail: arguments })
    );
    return originalWarn.apply(console, arguments);
  };
}