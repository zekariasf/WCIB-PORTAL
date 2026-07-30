function Modal({ isOpen, title, children, onClose }) {
  if (!isOpen) return null

  return (
    <div className="modal" role="dialog" aria-modal="true">
      <div className="modal__content">
        {title && <h2 className="modal__title">{title}</h2>}
        <div className="modal__body">{children}</div>
        {onClose && (
          <button type="button" className="modal__close" onClick={onClose}>
            Close
          </button>
        )}
      </div>
    </div>
  )
}

export default Modal
