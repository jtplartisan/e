function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-xl w-96">
        <button
          onClick={onClose}
          className="text-red-500 float-right"
        >
          X
        </button>

        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}

export default Modal;