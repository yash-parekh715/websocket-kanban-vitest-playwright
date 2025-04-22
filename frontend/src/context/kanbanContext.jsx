// src/context/KanbanContext.jsx
import { createContext, useContext } from "react";
import { useWebSocket } from "../hooks/useWebSocket";

const KanbanContext = createContext(null);

export const KanbanProvider = ({ children }) => {
  const {
    isConnected,
    tasks,
    isLoading,
    createTask,
    updateTask,
    moveTask,
    deleteTask,
  } = useWebSocket();

  return (
    <KanbanContext.Provider
      value={{
        isConnected,
        tasks,
        isLoading,
        createTask,
        updateTask,
        moveTask,
        deleteTask,
      }}
    >
      {children}
    </KanbanContext.Provider>
  );
};

export const useKanban = () => {
  const context = useContext(KanbanContext);
  if (!context) {
    throw new Error("useKanban must be used within a KanbanProvider");
  }
  return context;
};
