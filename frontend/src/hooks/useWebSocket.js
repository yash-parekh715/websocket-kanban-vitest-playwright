// src/hooks/useWebSocket.js
import { useEffect, useRef, useState, useCallback } from "react";
import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_WS_URL || "http://localhost:5000";

export const useWebSocket = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [tasks, setTasks] = useState({ todo: [], inProgress: [], done: [] });
  const [isLoading, setIsLoading] = useState(true);
  const socketRef = useRef(null);

  useEffect(() => {
    // Create socket connection
    socketRef.current = io(SOCKET_URL);

    // Set up event listeners
    socketRef.current.on("connect", () => {
      setIsConnected(true);
    });

    socketRef.current.on("disconnect", () => {
      setIsConnected(false);
    });

    socketRef.current.on("sync:tasks", (syncedTasks) => {
      setTasks(syncedTasks);
      setIsLoading(false);
    });

    // Clean up on unmount
    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  // Task operations with WebSocket
  const createTask = useCallback((taskData) => {
    setIsLoading(true);
    socketRef.current.emit("task:create", taskData);
  }, []);

  const updateTask = useCallback((taskData) => {
    setIsLoading(true);
    socketRef.current.emit("task:update", taskData);
  }, []);

  const moveTask = useCallback((id, source, destination) => {
    setIsLoading(true);
    socketRef.current.emit("task:move", { id, source, destination });
  }, []);

  const deleteTask = useCallback((id, status) => {
    setIsLoading(true);
    socketRef.current.emit("task:delete", { id, status });
  }, []);

  return {
    isConnected,
    tasks,
    isLoading,
    createTask,
    updateTask,
    moveTask,
    deleteTask,
  };
};
