import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BoardContext } from "../context/BoardContext";

const BoardList = () => {
  const { boards, createBoard, deleteBoard, renameBoard } = useContext(BoardContext);
  const [newBoardTitle, setNewBoardTitle] = useState("");
  const [newBoardImage, setNewBoardImage] = useState("");
  const navigate = useNavigate();

  const handleAddBoard = () => {
    if (newBoardTitle.trim()) {
      createBoard(newBoardTitle, newBoardImage.trim());
      setNewBoardTitle("");
      setNewBoardImage("");
    }
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-xl mb-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">📌 Task Board</h1>
      <div className="flex gap-3 mb-6 justify-center">
        <input
          type="text"
          placeholder="Название доски"
          value={newBoardTitle}
          onChange={(e) => setNewBoardTitle(e.target.value)}
          className="border px-3 py-2 rounded-lg w-72 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="text"
          placeholder="Ссылка на изображение"
          value={newBoardImage}
          onChange={(e) => setNewBoardImage(e.target.value)}
          className="border px-3 py-2 rounded-lg w-72 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={handleAddBoard}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition-all"
        >
          ➕ Добавить
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-center">
        {boards.map((board) => (
          <div
            key={board.id}
            className="relative group rounded-xl overflow-hidden shadow-md cursor-pointer transition-transform transform hover:scale-105 w-full h-64"
            style={{
              backgroundColor: board.bgColor || "#8A2BE2",
              backgroundImage: board.backgroundImage?.startsWith("http") ? `url(${board.backgroundImage})` : "",
              backgroundSize: "cover",
              backgroundPosition: "center",
              minHeight: "200px",
            }}
            onClick={() => navigate(`/board/${board.id}`)}
          >
            <div className="absolute top-0 left-0 w-full bg-black bg-opacity-50 text-white text-lg font-semibold p-3 text-center">
              {board.title}
            </div>
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const newTitle = prompt("Новое название:", board.title);
                  if (newTitle) renameBoard(board.id, newTitle);
                }}
                className="bg-white p-2 rounded-full shadow hover:bg-gray-100"
              >
                ✏️
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteBoard(board.id);
                }}
                className="bg-white p-2 rounded-full shadow hover:bg-gray-100"
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BoardList;