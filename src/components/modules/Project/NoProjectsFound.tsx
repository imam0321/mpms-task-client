import { Briefcase } from "lucide-react";


export default function NoProjectsFound() {
  return (
    <div className="flex flex-col items-center justify-center py-20 rounded-2xl border border-dashed border-zinc-800 bg-zinc-950/20 text-center p-6">
      <Briefcase className="h-10 w-10 text-zinc-600 mb-3" />
      <h3 className="text-lg font-semibold text-zinc-300">No Projects Found</h3>
      <p className="text-sm text-zinc-500 mt-1 max-w-sm">
        We couldn't find any projects matching your current filters. Try adjusting your query or create a new project.
      </p>
    </div>
  )
}
