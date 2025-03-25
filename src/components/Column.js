import React, { useState, useContext, useRef } from "react";
import { Droppable } from "@hello-pangea/dnd";
import { BoardContext } from "../context/BoardContext";
import Card from "./Card";

const Column = ({ column, boardId, dragHandleProps }) => {
  const { renameColumn, addCard, deleteCard, renameCard, deleteColumn } = useContext(BoardContext);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(column.title);
  const [newCardText, setNewCardText] = useState("");
  const inputRef = useRef(null);

  const handleRename = () => {
    if (renameColumn && editedTitle.trim() && editedTitle !== column.title) {
      renameColumn(boardId, column.id, editedTitle);
    }
    setIsEditing(false);
  };

  const handleAddCard = () => {
    if (newCardText.trim() && addCard) {
      addCard(boardId, column.id, newCardText);
      setNewCardText("");
      inputRef.current?.focus();
    }
  };

  const handleDeleteColumn = () => {
    if (deleteColumn) {
      deleteColumn(boardId, column.id);
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-4 w-72 flex flex-col space-y-3 transition-all duration-300" {...dragHandleProps}>
      <div className="flex justify-between items-center">
        {isEditing ? (
          <div className="flex items-center space-x-2 w-full">
            <input
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleRename()}
              autoFocus
              className="font-semibold text-md border-b border-purple-500 focus:outline-none flex-grow text-black"
            />
            <button onClick={handleRename} className="text-green-500 text-xl">✔️</button>
            <button onClick={() => setIsEditing(false)} className="text-gray-500 text-xl">✖️</button>
          </div>
        ) : (
          <h3 className="font-bold text-black text-lg">{column.title}</h3>
        )}

        {!isEditing && (
          <div className="flex space-x-2">
            <button onClick={() => { setIsEditing(true); setEditedTitle(column.title); }} className="text-yellow-500 text-lg">✏️</button>
            <button onClick={handleDeleteColumn} className="text-red-500 text-lg">🗑️</button>
          </div>
        )}
      </div>

      <Droppable droppableId={column.id} type="CARD">
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex flex-col space-y-2 min-h-[50px] p-2 rounded transition-colors duration-300 ${
              snapshot.isDraggingOver ? "bg-purple-100 shadow-inner" : "bg-gray-50"
            }`}
          >
            {column.cards.map((card, index) => (
              <Card
                key={card.id}
                card={card}
                index={index}
                onDelete={() => deleteCard && deleteCard(boardId, column.id, card.id)}
                onRename={(newTitle) => renameCard && renameCard(boardId, column.id, card.id, newTitle)}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      <div className="flex space-x-1 pt-2">
        <input
          ref={inputRef}
          className="border rounded px-2 py-1 flex-grow text-sm text-black focus:outline-purple-500"
          placeholder="Добавить карточку"
          value={newCardText}
          onChange={(e) => setNewCardText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAddCard()}
        />
        <button onClick={handleAddCard} className="bg-purple-500 hover:bg-purple-600 text-white rounded px-2">+</button>
      </div>
    </div>
  );
};

export default Column;
