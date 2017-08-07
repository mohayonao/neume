export const EXECUTE_CODE = "REPL.EXECUTE_CODE";

export function executeCode(code) {
  return { type: EXECUTE_CODE, payload: { code } };
}
