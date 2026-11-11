/**
 * After a line is removed its button disappears, which would drop keyboard
 * focus to the page. Move focus to the next line's remove button, the
 * previous one if it was the last, or the drawer heading when nothing is left.
 */
export function focusAfterRemoval(panel, removedIndex) {
  requestAnimationFrame(() => {
    if (!panel?.isConnected) return;
    const removeButtons = panel.querySelectorAll('[data-remove-button]');
    const next = removeButtons[Math.min(removedIndex, removeButtons.length - 1)];
    (next ?? panel.querySelector('.drawer__empty .btn') ?? panel.querySelector('.drawer__title'))?.focus();
  });
}
