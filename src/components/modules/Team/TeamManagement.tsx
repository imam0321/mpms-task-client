"use client";

import React, { useState, useTransition, useEffect, useActionState } from "react";
import InputFieldError from "@/components/shared/InputFieldError";
import { useRouter } from "next/navigation";
import {
  Search, Plus, Users, Loader2, Edit2, Trash2, X, Shield, Mail,
  Building2, Briefcase, UserCheck, UserX, ChevronDown, Check
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldContent } from "@/components/ui/field";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose
} from "@/components/ui/dialog";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { IUser, UserRole } from "@/types/api.types";
import { addMember, updateMember, removeMember } from "@/services/user/user.service";

interface TeamManagementProps {
  initialUsers: IUser[];
}

export default function TeamManagement({ initialUsers }: TeamManagementProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const [users, setUsers] = useState<IUser[]>(initialUsers);
  const [isOpen, setIsOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<IUser | null>(null);

  // Form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("Member");
  const [designation, setDesignation] = useState("");
  const [department, setDepartment] = useState("");

  const [userToDelete, setUserToDelete] = useState<IUser | null>(null);

  const [state, formAction, isPendingAction] = useActionState(
    async (prevState: any, formData: FormData) => {
      if (editingUser) {
        return updateMember(prevState, formData);
      } else {
        return addMember(prevState, formData);
      }
    },
    null
  );

  useEffect(() => {
    if (state) {
      if (state.success) {
        toast.success(
          editingUser ? "Member updated successfully!" : "Member added successfully!"
        );
        setIsOpen(false);
        resetForm();
        router.refresh();
      } else {
        if (state.message && state.message !== "Validation failed") {
          toast.error(state.message);
        }
        if (state.formData) {
          setName((state.formData.name as string) || "");
          setEmail((state.formData.email as string) || "");
          setPassword((state.formData.password as string) || "");
          setRole((state.formData.role as UserRole) || "Member");
          setDesignation((state.formData.designation as string) || "");
          setDepartment((state.formData.department as string) || "");
        }
      }
    }
  }, [state, router]);

  // Filter users client-side
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.designation || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const resetForm = () => {
    setEditingUser(null);
    setName("");
    setEmail("");
    setPassword("");
    setRole("Member");
    setDesignation("");
    setDepartment("");
  };

  const handleOpenCreate = () => {
    resetForm();
    setIsOpen(true);
  };

  const handleOpenEdit = (user: IUser) => {
    setEditingUser(user);
    setName(user.name);
    setEmail(user.email);
    setPassword("");
    setRole(user.role);
    setDesignation(user.designation || "");
    setDepartment(user.department || "");
    setIsOpen(true);
  };

  // handleSubmit replaced by formAction action on submit

  const handleDelete = () => {
    if (!userToDelete) return;
    startTransition(async () => {
      try {
        const res = await removeMember(userToDelete._id!);
        if (res?.success) {
          toast.success("Member removed successfully!");
          setUserToDelete(null);
          router.refresh();
        } else {
          toast.error(res?.message || "Failed to remove member");
        }
      } catch (err: any) {
        toast.error(err?.message || "An error occurred during removal");
      }
    });
  };

  const roleBadges: Record<UserRole, string> = {
    Admin: "bg-red-500/10 text-red-400 border-red-500/20",
    Manager: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
    Member: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  };

  const roleIcons: Record<UserRole, React.ReactNode> = {
    Admin: <Shield className="h-3 w-3" />,
    Manager: <Briefcase className="h-3 w-3" />,
    Member: <UserCheck className="h-3 w-3" />,
  };

  return (
    <div className="space-y-6">
      <div className="relative z-20 flex flex-col md:flex-row md:items-center gap-2.5 bg-zinc-950/40 border border-zinc-900 p-3 sm:p-3.5 rounded-2xl backdrop-blur-md">
        {/* Search Input */}
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500 pointer-events-none" />
          <Input
            placeholder="Search members by name, email, or designation..."
            className="pl-10 bg-zinc-900/40 border-zinc-800 text-zinc-200 focus:border-zinc-700 rounded-xl h-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Role Filter Selector */}
        <div className="w-full md:w-52 shrink-0">
          <div className="relative">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full h-9 bg-zinc-900/40 border border-zinc-800 text-zinc-300 rounded-xl px-3 text-xs outline-none focus:border-zinc-700 cursor-pointer appearance-none"
            >
              <option value="all">All Roles</option>
              <option value="Admin">Admin</option>
              <option value="Manager">Manager</option>
              <option value="Member">Member</option>
            </select>
            <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-zinc-500 pointer-events-none" />
          </div>
        </div>

        {/* Add Member Button */}
        <div className="w-full md:w-auto">
          <Button
            type="button"
            onClick={handleOpenCreate}
            className="
              w-full md:w-auto
              flex items-center justify-center gap-1.5
              bg-linear-to-r from-indigo-500 to-violet-600
              hover:from-indigo-600 hover:to-violet-700
              text-white font-medium border-0
              h-9 cursor-pointer rounded-xl
              shadow-md shadow-indigo-500/10
              transition-all duration-200
            "
          >
            <Plus className="h-4 w-4" />
            <span>Add Member</span>
          </Button>
        </div>
      </div>

      {/* Users Table */}
      {filteredUsers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 rounded-2xl border border-dashed border-zinc-800 bg-zinc-950/20 text-center p-6">
          <Users className="h-10 w-10 text-zinc-600 mb-3" />
          <h3 className="text-lg font-semibold text-zinc-300">No Members Found</h3>
          <p className="text-sm text-zinc-500 mt-1 max-w-sm">
            No team members match your current filters. Try a different search or add a new member.
          </p>
          <Button
            onClick={handleOpenCreate}
            variant="outline"
            className="mt-4 border-zinc-800 hover:border-zinc-700 text-zinc-300 cursor-pointer"
          >
            Add First Member
          </Button>
        </div>
      ) : (
        <div className="space-y-4 animate-in fade-in duration-300">
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">
              Team Members
            </h4>
            <span className="text-xs text-zinc-500">
              {filteredUsers.length} member{filteredUsers.length !== 1 ? "s" : ""}
            </span>
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950/20 backdrop-blur-md">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm text-zinc-400">
                <thead>
                  <tr className="border-b border-zinc-800 bg-zinc-950/50 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    <th className="p-4">Member</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Role</th>
                    <th className="p-4">Designation</th>
                    <th className="p-4">Department</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900/60">
                  {filteredUsers.map((user) => (
                    <tr
                      key={user._id}
                      className="hover:bg-zinc-900/20 transition-all duration-150"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          {user.profileImg ? (
                            <img
                              src={user.profileImg}
                              alt={user.name}
                              className="h-9 w-9 rounded-full object-cover border border-zinc-800"
                            />
                          ) : (
                            <div className="h-9 w-9 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-zinc-300 border border-zinc-700/50 text-sm">
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <span className="font-semibold text-zinc-200">{user.name}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                          <Mail className="h-3.5 w-3.5 text-zinc-500 shrink-0" />
                          <span>{user.email}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase border ${roleBadges[user.role]}`}
                        >
                          {roleIcons[user.role]}
                          {user.role}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="text-xs text-zinc-300">
                          {user.designation || "—"}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                          {user.department ? (
                            <>
                              <Building2 className="h-3.5 w-3.5 text-zinc-500 shrink-0" />
                              <span>{user.department}</span>
                            </>
                          ) : (
                            <span className="text-zinc-600">—</span>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        {user.isActive !== false ? (
                          <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase border bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                            <UserCheck className="h-3 w-3" />
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase border bg-zinc-500/10 text-zinc-400 border-zinc-500/20">
                            <UserX className="h-3 w-3" />
                            Inactive
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEdit(user)}
                            className="p-1.5 rounded-lg border border-zinc-800 bg-zinc-900/30 text-zinc-400 hover:text-indigo-400 hover:border-indigo-500/30 hover:bg-indigo-500/5 transition-all duration-150 cursor-pointer"
                            title="Edit"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => setUserToDelete(user)}
                            className="p-1.5 rounded-lg border border-zinc-800 bg-zinc-900/30 text-zinc-400 hover:text-red-400 hover:border-red-500/30 hover:bg-red-500/5 transition-all duration-150 cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Cards */}
          <div className="block md:hidden space-y-3">
            {filteredUsers.map((user) => (
              <div
                key={user._id}
                className="rounded-xl border border-zinc-800 bg-zinc-950/20 p-4 space-y-3"
              >
                <div className="flex items-center gap-3">
                  {user.profileImg ? (
                    <img
                      src={user.profileImg}
                      alt={user.name}
                      className="h-10 w-10 rounded-full object-cover border border-zinc-800"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-zinc-300 border border-zinc-700/50">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h5 className="font-semibold text-zinc-200 truncate text-sm">{user.name}</h5>
                    <span className="text-xs text-zinc-500">{user.email}</span>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 text-[9px] px-2 py-0.5 rounded-full font-bold uppercase border shrink-0 ${roleBadges[user.role]}`}
                  >
                    {roleIcons[user.role]}
                    {user.role}
                  </span>
                </div>

                <div className="flex justify-between items-center text-xs pt-2 border-t border-zinc-900/60">
                  <div className="flex items-center gap-1.5 text-zinc-400">
                    <Briefcase className="h-3.5 w-3.5 text-zinc-500 shrink-0" />
                    <span>{user.designation || "No designation"}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-zinc-400">
                    <Building2 className="h-3.5 w-3.5 text-zinc-500 shrink-0" />
                    <span>{user.department || "No dept"}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2">
                  {user.isActive !== false ? (
                    <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-semibold uppercase">
                      <UserCheck className="h-3 w-3" /> Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] text-zinc-500 font-semibold uppercase">
                      <UserX className="h-3 w-3" /> Inactive
                    </span>
                  )}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenEdit(user)}
                      className="p-1.5 rounded-lg border border-zinc-800 bg-zinc-900/30 text-zinc-400 hover:text-indigo-400 hover:border-indigo-500/30 transition-all cursor-pointer"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => setUserToDelete(user)}
                      className="p-1.5 rounded-lg border border-zinc-800 bg-zinc-900/30 text-zinc-400 hover:text-red-400 hover:border-red-500/30 transition-all cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={isOpen} onOpenChange={(open) => { setIsOpen(open); if (!open) resetForm(); }}>
        <DialogContent className="w-full sm:max-w-lg bg-zinc-950 border border-zinc-900 p-0 flex flex-col max-h-[90vh] shadow-2xl overflow-hidden rounded-2xl">
          <DialogHeader className="p-6 border-b border-zinc-900/80">
            <DialogTitle className="text-zinc-100 font-bold text-lg flex items-center gap-2">
              <Users className="h-5 w-5 text-indigo-400" />
              {editingUser ? "Edit Member" : "Add New Member"}
            </DialogTitle>
            <DialogDescription className="text-zinc-500 text-xs mt-1">
              {editingUser
                ? "Update the member's details, role, or department assignment."
                : "Add a new team member by providing their details and assigning a role."}
            </DialogDescription>
          </DialogHeader>

          <form
            action={formAction}
            className="flex-1 overflow-y-auto p-6 space-y-5 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent scroll-smooth max-h-[55vh]"
          >
            {editingUser && (
              <input type="hidden" name="userId" value={editingUser._id} />
            )}
            <input type="hidden" name="role" value={role} />
            {/* Name */}
            <Field>
              <FieldLabel className="text-xs uppercase tracking-wider text-zinc-500 font-bold flex items-center gap-1">
                Full Name <span className="text-red-500">*</span>
              </FieldLabel>
              <FieldContent>
                <Input
                  type="text"
                  name="name"
                  placeholder="Enter member name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-zinc-900/40 border-zinc-800 text-zinc-200 focus:border-zinc-700 rounded-xl h-9"
                  required
                />
                <InputFieldError field="name" state={state} />
              </FieldContent>
            </Field>

            {/* Email */}
            <Field>
              <FieldLabel className="text-xs uppercase tracking-wider text-zinc-500 font-bold flex items-center gap-1">
                Email Address <span className="text-red-500">*</span>
              </FieldLabel>
              <FieldContent>
                <Input
                  type="email"
                  name="email"
                  placeholder="Enter email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-zinc-900/40 border-zinc-800 text-zinc-200 focus:border-zinc-700 rounded-xl h-9"
                  required
                  disabled={!!editingUser}
                />
                <InputFieldError field="email" state={state} />
              </FieldContent>
            </Field>

            {/* Password (only for new) */}
            {!editingUser && (
              <Field>
                <FieldLabel className="text-xs uppercase tracking-wider text-zinc-500 font-bold flex items-center gap-1">
                  Password <span className="text-red-500">*</span>
                </FieldLabel>
                <FieldContent>
                  <Input
                    type="password"
                    name="password"
                    placeholder="Set a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-zinc-900/40 border-zinc-800 text-zinc-200 focus:border-zinc-700 rounded-xl h-9"
                    required
                  />
                  <InputFieldError field="password" state={state} />
                </FieldContent>
              </Field>
            )}

            {/* Role Selector */}
            <Field>
              <FieldLabel className="text-xs uppercase tracking-wider text-zinc-500 font-bold">
                Role
              </FieldLabel>
              <FieldContent>
                <div className="grid grid-cols-3 gap-2 bg-zinc-900/30 border border-zinc-800 p-1.5 rounded-xl">
                  {(["Admin", "Manager", "Member"] as UserRole[]).map((roleVal) => (
                    <button
                      key={roleVal}
                      type="button"
                      onClick={() => setRole(roleVal)}
                      className={`py-2 rounded-lg text-xs font-semibold uppercase tracking-wider border transition-all duration-150 cursor-pointer flex items-center justify-center gap-1.5 ${role === roleVal
                        ? "bg-indigo-600/10 text-indigo-400 border-indigo-500/30"
                        : "border-transparent text-zinc-500 hover:text-zinc-300"
                        }`}
                    >
                      {roleIcons[roleVal]}
                      {roleVal}
                    </button>
                  ))}
                </div>
                <InputFieldError field="role" state={state} />
              </FieldContent>
            </Field>

            {/* Designation & Department */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field>
                <FieldLabel className="text-xs uppercase tracking-wider text-zinc-500 font-bold">
                  Designation
                </FieldLabel>
                <FieldContent>
                  <Input
                    type="text"
                    name="designation"
                    placeholder="e.g. Senior Developer"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    className="bg-zinc-900/40 border-zinc-800 text-zinc-200 focus:border-zinc-700 rounded-xl h-9"
                  />
                  <InputFieldError field="designation" state={state} />
                </FieldContent>
              </Field>
              <Field>
                <FieldLabel className="text-xs uppercase tracking-wider text-zinc-500 font-bold">
                  Department
                </FieldLabel>
                <FieldContent>
                  <Input
                    type="text"
                    name="department"
                    placeholder="e.g. Engineering"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="bg-zinc-900/40 border-zinc-800 text-zinc-200 focus:border-zinc-700 rounded-xl h-9"
                  />
                  <InputFieldError field="department" state={state} />
                </FieldContent>
              </Field>
            </div>
          </form>

          {/* Footer */}
          <div className="p-4 border-t border-zinc-900/80 bg-zinc-950/80 flex items-center gap-3">
            <DialogClose asChild>
              <Button type="button" variant="outline" className="w-1/2 border-zinc-800 text-zinc-400 hover:text-zinc-200 cursor-pointer h-9 rounded-xl text-xs font-bold">
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={isPendingAction}
              className="w-1/2 bg-linear-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white cursor-pointer h-9 rounded-xl text-xs font-bold shadow-md shadow-indigo-500/10"
            >
              {isPendingAction ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" /> Saving...
                </>
              ) : (
                editingUser ? "Update Member" : "Add Member"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        isOpen={!!userToDelete}
        onClose={() => setUserToDelete(null)}
        onConfirm={handleDelete}
        title="Remove Member"
        description={
          <>
            Are you sure you want to remove <span className="font-semibold text-zinc-200">&quot;{userToDelete?.name}&quot;</span>? This action is irreversible and will revoke their access to all projects and tasks.
          </>
        }
        confirmText="Remove Member"
        confirmVariant="destructive"
        isPending={isPending}
        zIndex={20}
      />
    </div>
  );
}
