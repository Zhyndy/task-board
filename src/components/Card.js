import React, { useState } from "react";
import { Draggable } from "@hello-pangea/dnd";

const Card = ({ card, index, onDelete, onRename }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(card.title);

  const handleRename = () => {
    if (editedText.trim() !== "") {
      onRename(card.id, editedText);
      setIsEditing(false);
    }
  };

  return (
    <Draggable draggableId={card.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`bg-white rounded shadow px-3 py-2 flex justify-between items-center transition-all duration-300 ${
            snapshot.isDragging ? "bg-purple-100" : ""
          }`}
        >
          {isEditing ? (
            <div className="flex items-center space-x-2 w-full">
              <input
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleRename()}
                autoFocus
                className="border-b border-purple-500 text-black flex-grow focus:outline-none"
              />
              <button
                onClick={handleRename}
                className="text-green-500 text-lg"
              >
                ✔️
              </button>
            </div>
          ) : (
            <>
              <span className="text-black flex-grow">{card.title}</span>
              <div className="flex space-x-2 ml-2">
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-yellow-500 text-lg"
                >
                  ✏️
                </button>
                <button
                  onClick={() => onDelete(card.id)}
                  className="text-red-500 text-lg"
                >
                  🗑️
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </Draggable>
  );
};

export default Card;