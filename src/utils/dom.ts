export function qs<T extends Element = Element>(sel: string, root: ParentNode = document): T | null {
  return root.querySelector<T>(sel);
}

export function qsa<T extends Element = Element>(sel: string, root: ParentNode = document): T[] {
  return Array.from(root.querySelectorAll<T>(sel));
}

export function clear(node: Element | null): void {
  if (!node) return;
  while (node.firstChild) node.removeChild(node.firstChild);
}
