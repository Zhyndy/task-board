import React, { useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { BoardContext } from "../context/BoardContext";
import Column from "./Column";
import BoardSettings from "./BoardSettings";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import Slider from "react-slick";

const Board = () => {
  const { boards, setBoards, addColumn, deleteColumn } = useContext(BoardContext);
  const { boardId } = useParams();
  const activeBoard = boards.find((b) => b.id === boardId);

  const [newColumnTitle, setNewColumnTitle] = useState("");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [boardStyle, setBoardStyle] = useState({
    bgColor: "#f3e8ff",
    privacy: "public",
  });

  useEffect(() => {
    if (activeBoard) {
      setBoardStyle({ bgColor: activeBoard.bgColor || "#f3e8ff" });
    }
  }, [activeBoard]);

  const openSettings = () => setSettingsOpen(true);
  const saveSettings = (settings) => setBoardStyle(settings);

  const handleAddColumn = () => {
    if (!newColumnTitle.trim()) return;
    addColumn(boardId, newColumnTitle);
    setNewColumnTitle("");
  };

  const handleDeleteColumn = (columnId) => {
    deleteColumn(boardId, columnId);
  };

  const onDragEnd = (result) => {
    const { source, destination, type } = result;
    if (!destination) return;

    if (type === "COLUMN") {
      const reorderedColumns = Array.from(activeBoard.columns);
      const [removed] = reorderedColumns.splice(source.index, 1);
      reorderedColumns.splice(destination.index, 0, removed);

      const updatedBoards = boards.map((board) =>
        board.id === boardId ? { ...board, columns: reorderedColumns } : board
      );
      setBoards(updatedBoards);
    }
  };

  if (!activeBoard) return <div className="p-4">Нет активной доски</div>;

  return (
    <div className="min-h-screen p-4 md:p-6 transition-all" style={{ background: boardStyle.bgColor }}>
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-black">
        {activeBoard.title}
      </h2>

      <div className="flex flex-wrap justify-center md:justify-end items-center mb-6 gap-3">
        <input
          className="border px-3 py-2 rounded w-full md:w-64 focus:outline-purple-500 text-black"
          placeholder="Название колонки"
          value={newColumnTitle}
          onChange={(e) => setNewColumnTitle(e.target.value)}
        />
        <button onClick={handleAddColumn} className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded font-semibold transition">
          + Добавить колонку
        </button>
        <button onClick={openSettings} className="bg-white text-purple-600 font-semibold px-4 py-2 rounded hover:bg-gray-100 transition">
          ⚙️ Настройки
        </button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="columns" direction="horizontal" type="COLUMN">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps} className="flex space-x-4 pb-4 min-w-max">
              {activeBoard.columns.map((column, index) => (
                <Draggable key={column.id} draggableId={column.id} index={index}>
                  {(provided) => (
                    <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                      <Column column={column} boardId={activeBoard.id} onDeleteColumn={handleDeleteColumn} />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <BoardSettings isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} onSave={saveSettings} currentSettings={boardStyle} />
    </div>
  );
};

export default Board;
