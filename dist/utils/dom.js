export function qs(sel, root = document) {
    return root.querySelector(sel);
}
export function qsa(sel, root = document) {
    return Array.from(root.querySelectorAll(sel));
}
export function clear(node) {
    if (!node)
        return;
    while (node.firstChild)
        node.removeChild(node.firstChild);
}
