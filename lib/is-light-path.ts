/** Home and /progetti use the light chrome; other routes stay on the dark theme. */
export function isLightPath(pathname: string): boolean {
  return pathname === "/" || pathname === "/progetti";
}
