import React, { useState, useEffect, useMemo } from "react";
import { toLocalISOString } from "../utils";

export function TaskModal({
  isOpen,
  onClose,
  mode,
  initialData,
  tasks,
  onSubmit,
}) {
  const [description, setDescription] = useState("");
  const [project, setProject] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [timerMode, setTimerMode] = useState("stopwatch");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const suggestedProjects = useMemo(() => {
    if (!tasks) return [];
    const uniqueProjects = new Set();
    const suggestions = [];
    for (const task of tasks) {
      if (task.project && !uniqueProjects.has(task.project)) {
        uniqueProjects.add(task.project);
        suggestions.push(task.project);
        if (suggestions.length >= 10) break;
      }
    }
    return suggestions;
  }, [tasks]);

  const filteredProjects = useMemo(() => {
    if (!project.trim()) return suggestedProjects;
    return suggestedProjects.filter((p) =>
      p.toLowerCase().includes(project.toLowerCase())
    );
  }, [project, suggestedProjects]);

  useEffect(() => {
    if (isOpen) {
      if (mode === "edit" && initialData) {
        setDescription(initialData.taskName);
        setProject(initialData.project || "");
        setStartTime(toLocalISOString(new Date(initialData.startTime)));
        setEndTime(toLocalISOString(new Date(initialData.endTime)));
      } else if (mode === "manual") {
        setDescription("");
        setProject("");
        const now = new Date();
        const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
        setStartTime(toLocalISOString(oneHourAgo));
        setEndTime(toLocalISOString(now));
      } else {
        // Start mode
        setDescription("");
        setProject("");
        setTimerMode("stopwatch");
      }
    }
  }, [isOpen, mode, initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!description.trim()) return;

    if (mode === "start") {
      onSubmit({ description, project, mode: timerMode });
    } else {
      // Manual or Edit
      const start = new Date(startTime).getTime();
      const end = new Date(endTime).getTime();

      if (isNaN(start) || isNaN(end) || start >= end) {
        alert(
          "Please enter valid start and end times (End time must be after start time)."
        );
        return;
      }

      onSubmit({
        description,
        project,
        startTime: start,
        endTime: end,
        durationMs: end - start,
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 transition-opacity duration-300"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8 w-full max-w-md transform transition-all duration-300 scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
          {mode === "edit" ? "Edit Task" : "What are you working on?"}
        </h3>
        <form onSubmit={handleSubmit}>
          {mode === "start" && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Timer Mode
              </label>
              <div className="flex space-x-4">
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="timer-mode"
                    value="stopwatch"
                    checked={timerMode === "stopwatch"}
                    onChange={(e) => setTimerMode(e.target.value)}
                    className="form-radio text-cyan-600 focus:ring-cyan-500 h-4 w-4"
                  />
                  <span className="ml-2 text-gray-700 dark:text-gray-300">
                    Stopwatch
                  </span>
                </label>
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="timer-mode"
                    value="pomodoro"
                    checked={timerMode === "pomodoro"}
                    onChange={(e) => setTimerMode(e.target.value)}
                    className="form-radio text-cyan-600 focus:ring-cyan-500 h-4 w-4"
                  />
                  <span className="ml-2 text-gray-700 dark:text-gray-300">
                    Pomodoro (25m/5m)
                  </span>
                </label>
              </div>
            </div>
          )}

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Task Description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all"
              placeholder="e.g., Writing Report"
              required
              autoFocus
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Project{" "}
              <span className="text-gray-400 font-normal">(Optional)</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={project}
                onChange={(e) => {
                  setProject(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all"
                placeholder="e.g., Client Work"
              />
              {showSuggestions && filteredProjects.length > 0 && (
                <ul className="absolute z-10 w-full bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg mt-1 max-h-40 overflow-y-auto shadow-lg">
                  {filteredProjects.map((proj) => (
                    <li
                      key={proj}
                      className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-slate-600 cursor-pointer text-gray-800 dark:text-gray-200"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        setProject(proj);
                        setShowSuggestions(false);
                      }}
                    >
                      {proj}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {(mode === "manual" || mode === "edit") && (
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Start Time
                </label>
                <input
                  type="datetime-local"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  End Time
                </label>
                <input
                  type="datetime-local"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all"
                />
              </div>
            </div>
          )}

          <div className="flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 font-medium hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-lg shadow-md transition-colors cursor-pointer"
            >
              {mode === "edit" ? "Save Changes" : "Start Tracking"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
