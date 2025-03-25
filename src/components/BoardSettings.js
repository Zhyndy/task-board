import React, { useState, useEffect } from "react";

const BoardSettings = ({ isOpen, onClose, onSave, currentSettings, board }) => {
  const [bgColor, setBgColor] = useState("#f3e8ff");
  const [privacy, setPrivacy] = useState("public");
  const [selectedImages, setSelectedImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);

  useEffect(() => {
    if (currentSettings) {
      setBgColor(currentSettings.bgColor || "#f3e8ff");
      setPrivacy(currentSettings.privacy || "public");
      setSelectedImages(currentSettings.images || []);
      setPreviewImages(currentSettings.images || []);
    }
  }, [currentSettings]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => {
      const reader = new FileReader();
      return new Promise((resolve) => {
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(newImages).then((images) => {
      setSelectedImages((prevImages) => [...prevImages, ...images]);
      setPreviewImages((prevImages) => [...prevImages, ...images]);
    });
  };

  const handleSave = () => {
    const updatedSettings = {
      bgColor,
      privacy,
      images: [...selectedImages],
    };

    onSave(updatedSettings);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <h3 className="text-2xl font-bold text-purple-600 mb-4">
          Настройки доски
        </h3>

        <div className="mb-4">
          <label className="block text-sm mb-2">Цвет фона</label>
          <input
            type="color"
            value={bgColor}
            onChange={(e) => setBgColor(e.target.value)}
            className="w-full h-10 rounded border"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm mb-2">Фоновое изображение</label>
          <input
            type="file"
            multiple
            onChange={handleImageChange}
            accept="image/*"
            className="w-full"
          />
          {previewImages.length > 0 && (
            <div className="mt-2 flex space-x-2">
              {previewImages.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Preview ${index}`}
                  className="rounded h-24 object-cover w-24"
                />
              ))}
            </div>
          )}
        </div>

        <div className="mb-6">
          <label className="block text-sm mb-2">Конфиденциальность</label>
          <select
            value={privacy}
            onChange={(e) => setPrivacy(e.target.value)}
            className="w-full border rounded p-2"
          >
            <option value="public">Публичная</option>
            <option value="private">Приватная</option>
          </select>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Отмена
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            Сохранить
          </button>
        </div>
      </div>
    </div>
  );
};

export default BoardSettings;
