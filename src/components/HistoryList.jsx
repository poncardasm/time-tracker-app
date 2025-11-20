import React, { useState, useEffect } from 'react';
import { formatTime } from '../utils';

export function HistoryList({ tasks, onRequestDelete, onEdit }) {
  const [selectedIndices, setSelectedIndices] = useState([]);

  // Reset selection if tasks change (e.g. after delete)
  useEffect(() => {
    setSelectedIndices([]);
  }, [tasks]);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIndices(tasks.map((_, index) => index));
    } else {
      setSelectedIndices([]);
    }
  };

  const handleSelectOne = (index) => {
    setSelectedIndices(prev => {
      if (prev.includes(index)) {
        return prev.filter(i => i !== index);
      } else {
        return [...prev, index];
      }
    });
  };

  const handleDeleteClick = () => {
    onRequestDelete(selectedIndices);
  };

  const exportToCSV = () => {
       if (tasks.length === 0) return;

      const headers = ["Task Name", "Project", "Date", "Start Time", "End Time", "Duration"];
      const rows = tasks.map((task) => {
        const date = new Date(task.startTime).toLocaleDateString(undefined, {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        });
        const startTime = new Date(task.startTime).toLocaleTimeString(undefined, {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        });
        const endTime = new Date(task.endTime).toLocaleTimeString(undefined, {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
          });
        const duration = formatTime(task.durationMs);
        
        const escapedTaskName = `"${task.taskName.replace(/"/g, '""')}"`;
        const escapedProject = `"${(task.project || "").replace(/"/g, '""')}"`;

        return [escapedTaskName, escapedProject, date, startTime, endTime, duration].join(",");
      });

      const csvContent = [headers.join(","), ...rows].join("\n");
      const now = new Date();
      const filename = `time-tracker-export-${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}.csv`;
      
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", filename);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
  };

  if (tasks.length === 0) {
    return (
      <div className="w-full max-w-4xl mt-8 text-center text-gray-500 italic">
        No tasks recorded yet.
      </div>
    );
  }

  return (
    <section className="w-full max-w-4xl">
      <div className="flex items-center justify-between mb-4 px-2">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleDeleteClick}
            disabled={selectedIndices.length === 0}
            className="text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
             {selectedIndices.length > 0 ? `Delete Selected (${selectedIndices.length})` : "Delete Selected"}
          </button>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={exportToCSV}
            className="text-sm text-cyan-600 hover:text-cyan-800 dark:text-cyan-400 dark:hover:text-cyan-300 font-medium transition-colors cursor-pointer"
          >
            Export to CSV
          </button>
          <span className="text-sm text-gray-500 dark:text-gray-400 bg-white dark:bg-slate-800 px-2 py-1 rounded shadow-sm">
            {tasks.length} task{tasks.length !== 1 && 's'}
          </span>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md overflow-hidden transition-colors duration-300">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-cyan-600 dark:bg-cyan-700 border-b border-cyan-700 dark:border-cyan-800">
              <tr>
                <th className="px-6 py-3 w-10">
                  <input
                    type="checkbox"
                    checked={selectedIndices.length === tasks.length && tasks.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-cyan-300 bg-cyan-100 text-cyan-600 focus:ring-cyan-400 cursor-pointer"
                  />
                </th>
                <th className="px-6 py-3 text-xs font-medium text-white uppercase tracking-wider">Task</th>
                <th className="px-6 py-3 text-xs font-medium text-white uppercase tracking-wider">Project</th>
                <th className="px-6 py-3 text-xs font-medium text-white uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-xs font-medium text-white uppercase tracking-wider">Start</th>
                <th className="px-6 py-3 text-xs font-medium text-white uppercase tracking-wider">End</th>
                <th className="px-6 py-3 text-xs font-medium text-white uppercase tracking-wider text-right">Duration</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
              {tasks.map((task, index) => {
                 const isSelected = selectedIndices.includes(index);
                 const dateStr = new Date(task.startTime).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
                 const startTimeStr = new Date(task.startTime).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
                 const endTimeStr = new Date(task.endTime).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });

                 return (
                    <tr key={index} className={`${index % 2 === 0 ? "bg-white dark:bg-slate-800" : "bg-gray-50 dark:bg-slate-700"} hover:bg-gray-50 transition-colors`}>
                        <td className="px-6 py-4">
                            <input 
                                type="checkbox" 
                                checked={isSelected}
                                onChange={() => handleSelectOne(index)}
                                className="rounded border-gray-300 text-cyan-600 focus:ring-cyan-500 cursor-pointer" 
                            />
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100 font-medium">
                            <div className="flex items-center justify-between group">
                                <span>{task.taskName}</span>
                                <button onClick={() => onEdit(index)} className="text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity p-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                    </svg>
                                </button>
                            </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{task.project || "-"}</td>
                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">{dateStr}</td>
                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{startTimeStr}</td>
                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{endTimeStr}</td>
                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100 font-mono text-right">{formatTime(task.durationMs)}</td>
                    </tr>
                 );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

