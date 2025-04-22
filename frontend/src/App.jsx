import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { KanbanProvider } from "./context/kanbanContext";
import { KanbanBoard } from "./components/kanban/KanbanBoard";

function App() {
  return (
    <KanbanProvider>
      <DndProvider backend={HTML5Backend}>
        <div className="flex flex-col min-h-screen bg-[#f8fafc]">
          <header className="bg-white border-b border-slate-200 z-30 relative">
            <div className="px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                <div className="flex items-center">
                  <div className="flex-shrink-0 flex items-center">
                    <div className="h-8 w-8 rounded bg-gradient-to-br from-indigo-600 to-violet-500 mr-2 flex items-center justify-center">
                      <svg
                        className="h-5 w-5 text-white"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM14 11a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 110-2h1v-1a1 1 0 011-1z" />
                      </svg>
                    </div>
                    <span className="font-bold text-xl text-slate-800 tracking-tight">
                      Kanban Board
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </header>

          <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <KanbanBoard />
          </main>

          <footer className="bg-white border-t border-slate-200 py-4 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center text-sm text-slate-500">
                <div>© 2025 Real-time Kanban Board</div>
              </div>
            </div>
          </footer>
        </div>
      </DndProvider>
    </KanbanProvider>
  );
}

export default App;
