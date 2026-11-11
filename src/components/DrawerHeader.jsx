import { X } from 'lucide-react';

export default function DrawerHeader({ id, title, count, onClose }) {
  return (
    <div className="drawer__header">
      {/* tabIndex -1 lets focus land on the heading when the last item is removed. */}
      <h2 id={id} tabIndex={-1} className="drawer__title">
        {title}
        {count > 0 && <span className="drawer__count"> ({count})</span>}
      </h2>
      <button type="button" className="icon-button" onClick={onClose} aria-label={`Close ${title.toLowerCase()}`}>
        <X size={22} aria-hidden="true" />
      </button>
    </div>
  );
}
