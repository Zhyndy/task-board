import React, { useState, useEffect } from "react";

const CardModal = ({ isOpen, onClose, onSave, initialText = "" }) => {
  const [text, setText] = useState(initialText);

  useEffect(() => {
    if (isOpen) {
      setText(initialText);
    }
  }, [isOpen, initialText]);

  const handleSave = () => {
    if (text.trim()) {
      onSave(text);
      onClose();
      setText("");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg w-96 p-6 space-y-4">
        <h2 className="text-xl font-bold text-purple-600">
          {initialText ? "Редактировать карточку" : "Добавить карточку"}
        </h2>
        <textarea
          className="w-full p-2 border rounded focus:outline-purple-500"
          rows="4"
          placeholder="Введите текст карточки"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className="flex justify-end space-x-2">
          <button
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-4 py-2 rounded"
            onClick={onClose}
          >
            Отмена
          </button>
          <button
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-4 py-2 rounded"
            onClick={handleSave}
          >
            Сохранить
          </button>
        </div>
      </div>
    </div>
  );
};

export default CardModal;
