"use client";

import React, { useState } from "react";
import {
  CalendarClock, ChevronDown, ChevronUp, Plus, Edit2, Trash2, ArrowUp, ArrowDown,
  Layers, CheckSquare, Play, RefreshCw, CheckCircle2
} from "lucide-react";
import { ISprint, ITask, TaskStatus } from "@/types/api.types";
import { formatDate } from "@/lib/formatDate";
import TaskCard from "../Task/TaskCard";
import { Button } from "@/components/ui/button";

interface SprintSectionProps {
  sprint: ISprint;
  tasks: ITask[];
  index: number;
  totalSprints: number;
  onEditSprint?: (sprint: ISprint) => void;
  onDeleteSprint?: (sprint: ISprint) => void;
  onReorderSprint?: (sprint: ISprint, direction: "up" | "down") => void;
  onAddTask?: (sprintId: string) => void;
  onTaskClick: (task: ITask) => void;
  onEditTask?: (task: ITask) => void;
  onDeleteTask?: (task: ITask) => void;
}

export default function SprintSection({
  sprint,
  tasks,
  index,
  totalSprints,
  onEditSprint,
  onDeleteSprint,
  onReorderSprint,
  onAddTask,
  onTaskClick,
  onEditTask,
  onDeleteTask,
}: SprintSectionProps) {
  const [isExpanded, setIsExpanded] = useState(index === 0); 

  // Group tasks by status
  const columns: { label: string; status: TaskStatus; icon: React.ReactNode; color: string }[] = [
    {
      label: "To Do",
      status: "To Do",
      icon: <CheckSquare className="h-3.5 w-3.5" />,
      color: "text-blue-400 border-blue-500/20 bg-blue-500/5"
    },
    {
      label: "In Progress",
      status: "In Progress",
      icon: <Play className="h-3.5 w-3.5" />,
      color: "text-indigo-400 border-indigo-500/20 bg-indigo-500/5"
    },
    {
      label: "In Review",
      status: "Review",
      icon: <RefreshCw className="h-3.5 w-3.5" />,
      color: "text-amber-400 border-amber-500/20 bg-amber-500/5"
    },
    {
      label: "Completed",
      status: "Done",
      icon: <CheckCircle2 className="h-3.5 w-3.5" />,
      color: "text-emerald-400 border-emerald-500/20 bg-emerald-500/5"
    },
  ];

  const getTasksByStatus = (status: TaskStatus) => {
    return tasks.filter((t) => t.status === status);
  };

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950/20 backdrop-blur-md transition-all duration-200 hover:border-zinc-700/60">

      {/* Accent border on hover/expansion */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 transition-all duration-200 ${isExpanded ? "bg-indigo-500" : "bg-transparent group-hover:bg-indigo-500/40"
        }`} />

      {/* Header Container */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer select-none"
      >
        <div className="flex items-start gap-4">
          <div className="h-11 w-11 rounded-xl bg-zinc-900/80 border border-zinc-800 flex flex-col items-center justify-center shrink-0">
            <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest leading-none">Sp</span>
            <span className="text-lg font-extrabold text-zinc-100 mt-0.5 leading-none">{sprint.sprintNumber}</span>
          </div>
          <div>
            <h3 className="font-bold text-zinc-100 text-base flex items-center gap-2">
              {sprint.title}
              <span className="text-xs font-normal text-zinc-500 px-2 py-0.5 rounded-full bg-zinc-900 border border-zinc-800">
                {tasks.length} task{tasks.length !== 1 ? "s" : ""}
              </span>
            </h3>
            <div className="flex items-center gap-4 mt-1.5 flex-wrap">
              <span className="flex items-center gap-1.5 text-xs text-zinc-400 font-medium">
                <CalendarClock className="h-3.5 w-3.5 text-zinc-500 shrink-0" />
                {sprint.startDate || sprint.endDate ? (
                  <>
                    {sprint.startDate ? formatDate(sprint.startDate) : "No Start"}
                    <span className="text-zinc-600">—</span>
                    {sprint.endDate ? formatDate(sprint.endDate) : "No End"}
                  </>
                ) : (
                  "Dates not set"
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Reordering + Action Controls */}
        <div className="flex items-center justify-end sm:justify-start gap-4 pt-2 sm:pt-0 border-t border-zinc-900/60 sm:border-t-0" onClick={(e) => e.stopPropagation()}>

          {/* Add Task Button */}
          {onAddTask && (
            <Button
              onClick={() => onAddTask(sprint._id)}
              className="bg-zinc-900 hover:bg-zinc-850 text-indigo-400 hover:text-indigo-300 border border-zinc-800 cursor-pointer h-8 rounded-lg text-xs font-bold flex items-center gap-1.5 px-3"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Task</span>
            </Button>
          )}

          {/* Reordering arrows */}
          {onReorderSprint && (
            <div className="flex items-center bg-zinc-900/30 border border-zinc-800/80 rounded-xl p-1 gap-1">
              <button
                onClick={() => onReorderSprint(sprint, "up")}
                disabled={index === 0}
                className="p-1.5 rounded-lg text-zinc-500 hover:text-indigo-400 hover:bg-zinc-800/40 disabled:opacity-30 disabled:hover:text-zinc-500 disabled:hover:bg-transparent transition-all duration-150 cursor-pointer"
                title="Move Up"
              >
                <ArrowUp className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => onReorderSprint(sprint, "down")}
                disabled={index === totalSprints - 1}
                className="p-1.5 rounded-lg text-zinc-500 hover:text-indigo-400 hover:bg-zinc-800/40 disabled:opacity-30 disabled:hover:text-zinc-500 disabled:hover:bg-transparent transition-all duration-150 cursor-pointer"
                title="Move Down"
              >
                <ArrowDown className="h-3.5 w-3.5" />
              </button>
            </div>
          )}

          {/* Actions (Edit/Delete) */}
          {(onEditSprint || onDeleteSprint) && (
            <div className="flex items-center gap-2">
              {onEditSprint && (
                <button
                  onClick={() => onEditSprint(sprint)}
                  className="p-2 rounded-xl border border-zinc-800 bg-zinc-900/30 text-zinc-400 hover:text-indigo-400 hover:border-indigo-500/30 hover:bg-indigo-500/5 transition-all duration-150 cursor-pointer"
                  title="Edit Sprint"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                </button>
              )}
              {onDeleteSprint && (
                <button
                  onClick={() => onDeleteSprint(sprint)}
                  className="p-2 rounded-xl border border-zinc-800 bg-zinc-900/30 text-zinc-400 hover:text-red-400 hover:border-red-500/30 hover:bg-red-500/5 transition-all duration-150 cursor-pointer"
                  title="Delete Sprint"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          )}

          {/* Expansion Chevron */}
          <button className="text-zinc-500 hover:text-zinc-300 p-1" onClick={() => setIsExpanded(!isExpanded)}>
            {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Expanded Kanban Board Container */}
      {isExpanded && (
        <div className="border-t border-zinc-900/80 p-5 bg-zinc-950/40">
          {tasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <Layers className="h-8 w-8 text-zinc-700 mb-2" />
              <h4 className="text-sm font-semibold text-zinc-400">No Tasks in this Sprint</h4>
              <p className="text-xs text-zinc-600 mt-0.5">Start by adding a task to this sprint.</p>
              {onAddTask && (
                <Button
                  onClick={(e) => { e.stopPropagation(); onAddTask(sprint._id); }}
                  variant="outline"
                  className="mt-3.5 h-8 border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-zinc-300 text-xs rounded-xl"
                >
                  Create Task
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
              {columns.map((col) => {
                const columnTasks = getTasksByStatus(col.status);
                return (
                  <div
                    key={col.status}
                    className="flex flex-col rounded-xl border border-zinc-900/80 bg-zinc-950/20 p-3 h-full min-h-62.5"
                  >
                    {/* Column Header */}
                    <div className={`flex items-center justify-between border px-2.5 py-1.5 rounded-lg mb-3 ${col.color}`}>
                      <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider">
                        {col.icon}
                        <span>{col.label}</span>
                      </div>
                      <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-md bg-zinc-900/50 border border-zinc-800/40">
                        {columnTasks.length}
                      </span>
                    </div>

                    {/* Column Tasks List */}
                    <div className="flex-1 space-y-3 max-h-112.5 overflow-y-auto pr-1">
                      {columnTasks.length === 0 ? (
                        <div className="h-full flex items-center justify-center py-8 border border-dashed border-zinc-900/40 rounded-xl text-[11px] text-zinc-600 italic">
                          Empty
                        </div>
                      ) : (
                        columnTasks.map((task) => (
                          <TaskCard
                            key={task._id}
                            task={task}
                            onClick={() => onTaskClick(task)}
                            onEdit={onEditTask}
                            onDelete={onDeleteTask}
                          />
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
