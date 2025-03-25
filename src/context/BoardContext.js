import React, { createContext, useEffect, useState } from "react";
import axios from "axios";

export const BoardContext = createContext();

export const BoardProvider = ({ children }) => {
  const [boards, setBoards] = useState([]);
  const [activeBoardId, setActiveBoardId] = useState(null);

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const response = await axios.get("http://localhost:5002/boards");
        setBoards(response.data);
        setActiveBoardId(response.data[0]?.id || null);
      } catch (error) {
        console.error("Ошибка загрузки досок:", error);
      }
    };

    fetchBoards();
  }, []);

  const createBoard = async (title, image = "") => {
    try {
      const newBoard = {
        title,
        columns: [],
        bgColor: "#7c3aed",
        backgroundImage: image,
        privacy: "public",
      };

      const response = await axios.post("http://localhost:5002/boards", newBoard);
      setBoards((prevBoards) => [...prevBoards, response.data]);
    } catch (error) {
      console.error("Ошибка создания доски:", error);
    }
  };

  const deleteBoard = async (id) => {
    try {
      await axios.delete(`http://localhost:5002/boards/${id}`);
      setBoards((prevBoards) => prevBoards.filter((b) => b.id !== id));
      setActiveBoardId((prevBoards.length > 1) ? prevBoards[0].id : null);
    } catch (error) {
      console.error("Ошибка удаления доски:", error);
    }
  };

  const renameBoard = async (id, newTitle) => {
    try {
      const updatedBoard = boards.find((b) => b.id === id);
      if (!updatedBoard) return;

      const response = await axios.put(`http://localhost:5002/boards/${id}`, {
        ...updatedBoard,
        title: newTitle,
      });

      setBoards((prevBoards) =>
        prevBoards.map((b) => (b.id === id ? response.data : b))
      );
    } catch (error) {
      console.error("Ошибка переименования доски:", error);
    }
  };

  // Добавляем функцию для добавления колонки
  const addColumn = async (boardId, columnTitle) => {
    try {
      const board = boards.find((b) => b.id === boardId);
      if (!board) return;

      const newColumn = {
        id: Date.now().toString(),
        title: columnTitle,
        cards: [],
      };

      const updatedBoard = {
        ...board,
        columns: [...board.columns, newColumn],
      };

      const response = await axios.put(`http://localhost:5002/boards/${boardId}`, updatedBoard);
      setBoards((prevBoards) => prevBoards.map((b) => (b.id === boardId ? response.data : b)));
    } catch (error) {
      console.error("Ошибка добавления колонки:", error);
    }
  };

  return (
    <BoardContext.Provider
      value={{
        boards,
        setBoards,
        activeBoardId,
        setActiveBoardId,
        createBoard,
        deleteBoard,
        renameBoard,
        addColumn, // ✅ Теперь addColumn доступен в контексте
      }}
    >
      {children}
    </BoardContext.Provider>
  );
};
