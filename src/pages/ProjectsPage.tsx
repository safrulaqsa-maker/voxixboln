import { useState } from "react";
import { motion } from "framer-motion";
import { FolderOpen, Plus, Trash2, Clock, Tag } from "lucide-react";
import { trpc } from "@/providers/trpc";
import { format } from "date-fns";

export default function ProjectsPage() {
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDesc, setNewProjectDesc] = useState("");
  const [showCreate, setShowCreate] = useState(false);

  const { data: projects, refetch } = trpc.project.list.useQuery();
  const createProject = trpc.project.create.useMutation({
    onSuccess: () => {
      refetch();
      setNewProjectName("");
      setNewProjectDesc("");
      setShowCreate(false);
    },
  });
  const deleteProject = trpc.project.delete.useMutation({
    onSuccess: () => refetch(),
  });

  const handleCreate = () => {
    if (!newProjectName.trim()) return;
    createProject.mutate({
      name: newProjectName.trim(),
      description: newProjectDesc.trim() || undefined,
    });
  };

  return (
    <div className="h-full overflow-y-auto scrollbar-thin p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-heading text-3xl font-semibold gold-text">
              Projects
            </h1>
            <p className="text-sm text-[#8A8A95] mt-1">
              Kelola proyek dan organisasi chat Anda
            </p>
          </div>
          <button
            onClick={() => setShowCreate(!showCreate)}
            className="flex items-center gap-2 px-4 py-2 gold-gradient rounded-xl text-[#0A0A0F] text-sm font-semibold hover:shadow-[0_0_20px_rgba(212,175,55,0.3)] transition-all"
          >
            <Plus className="w-4 h-4" />
            New Project
          </button>
        </div>

        {showCreate && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="liquid-glass rounded-2xl p-6 mb-6"
          >
            <h3 className="text-sm font-medium text-[#EAE0C8] mb-4">
              Create New Project
            </h3>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Project name"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#13131A] border border-[#2A2A35] rounded-xl text-sm text-[#EAE0C8] placeholder-[#8A8A95] focus:outline-none focus:border-[#D4AF37]/50"
              />
              <textarea
                placeholder="Description (optional)"
                value={newProjectDesc}
                onChange={(e) => setNewProjectDesc(e.target.value)}
                rows={2}
                className="w-full px-4 py-2.5 bg-[#13131A] border border-[#2A2A35] rounded-xl text-sm text-[#EAE0C8] placeholder-[#8A8A95] focus:outline-none focus:border-[#D4AF37]/50 resize-none"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleCreate}
                  disabled={createProject.isPending || !newProjectName.trim()}
                  className="px-4 py-2 gold-gradient rounded-xl text-[#0A0A0F] text-sm font-semibold disabled:opacity-50"
                >
                  {createProject.isPending ? "Creating..." : "Create"}
                </button>
                <button
                  onClick={() => setShowCreate(false)}
                  className="px-4 py-2 bg-[#13131A] border border-[#2A2A35] rounded-xl text-sm text-[#8A8A95] hover:border-[#D4AF37]/30"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects?.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="liquid-glass rounded-2xl p-5 group hover:border-[#D4AF37]/20 transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl gold-gradient/20 bg-[#D4AF37]/10 flex items-center justify-center">
                    <FolderOpen className="w-5 h-5 text-[#D4AF37]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-[#EAE0C8]">
                      {project.name}
                    </h3>
                    <div className="flex items-center gap-2 text-[10px] text-[#8A8A95]">
                      <Clock className="w-3 h-3" />
                      {format(new Date(project.createdAt), "MMM d, yyyy")}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => deleteProject.mutate({ id: project.id })}
                  className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-[#C0392B]/20 transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5 text-[#C0392B]" />
                </button>
              </div>
              {project.description && (
                <p className="text-xs text-[#8A8A95] mb-3 line-clamp-2">
                  {project.description}
                </p>
              )}
              {project.tags && (
                <div className="flex items-center gap-1 flex-wrap">
                  <Tag className="w-3 h-3 text-[#8A8A95]" />
                  {project.tags.split(",").map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 bg-[#13131A] rounded-md text-[10px] text-[#8A8A95]"
                    >
                      {tag.trim()}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {(!projects || projects.length === 0) && (
          <div className="text-center py-16">
            <FolderOpen className="w-12 h-12 text-[#2A2A35] mx-auto mb-4" />
            <p className="text-sm text-[#8A8A95]">No projects yet</p>
            <p className="text-xs text-[#8A8A95]/60 mt-1">
              Create your first project to organize your chats
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
