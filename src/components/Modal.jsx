function Modal({ open, title, children, onClose }) {
  if (!open) return null;

  return (
    <div
      className="
fixed inset-0
flex items-center
justify-center
bg-black/50
"
    >
      <div
        className="
w-full max-w-md
rounded-xl
bg-white
p-6
"
      >
        <div className="flex justify-between">
          <h2 className="text-xl font-bold">{title}</h2>

          <button onClick={onClose}>✕</button>
        </div>

        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}

export default Modal;
