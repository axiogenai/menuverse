"use client";

import React, { useState, useEffect } from "react";
import { Users, Plus, ShieldCheck, UserCheck, Key, Mail, Trash2, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: "RESTAURANT_OWNER" | "RESTAURANT_MANAGER" | "RESTAURANT_STAFF";
  lastActive: string;
}

const DEFAULT_STAFF: StaffMember[] = [
  {
    id: "usr-01",
    name: "Restaurant Owner (You)",
    email: "owner@myrestaurant.com",
    role: "RESTAURANT_OWNER",
    lastActive: "Active now",
  },
];

export default function StaffManagementPage() {
  const [staff, setStaff] = useState<StaffMember[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("menuverse_staff");
        if (stored) return JSON.parse(stored);
      } catch (e) {}
    }
    return DEFAULT_STAFF;
  });

  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState<StaffMember["role"]>("RESTAURANT_STAFF");
  const [notification, setNotification] = useState<string | null>(null);

  const saveStaff = (updated: StaffMember[]) => {
    setStaff(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("menuverse_staff", JSON.stringify(updated));
    }
  };

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim()) return;

    const newMember: StaffMember = {
      id: `usr-${Date.now()}`,
      name: newName.trim(),
      email: newEmail.trim(),
      role: newRole,
      lastActive: "Just invited",
    };

    saveStaff([...staff, newMember]);
    setNewName("");
    setNewEmail("");
    setIsInviteOpen(false);
    setNotification(`Invitation sent and ${newMember.name} added as ${newMember.role.replace("_", " ")}.`);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleRemoveMember = (id: string, name: string) => {
    if (confirm(`Are you sure you want to revoke access for ${name}?`)) {
      const updated = staff.filter((m) => m.id !== id);
      saveStaff(updated);
      setNotification(`Revoked access for ${name}.`);
      setTimeout(() => setNotification(null), 3000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-slate-700" />
            Staff & Access Control
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage team roles and permissions across Owner, Manager, and Floor Staff.
          </p>
        </div>

        <Button
          onClick={() => setIsInviteOpen(true)}
          className="bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg h-9 px-3.5 text-xs shadow-xs flex items-center gap-1.5 cursor-pointer transition-colors"
        >
          <Plus className="w-3.5 h-3.5 text-slate-300" />
          <span>Invite Team Member</span>
        </Button>
      </div>

      {notification && (
        <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2 shadow-2xs">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Roles Legend Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-1">
          <div className="flex items-center gap-2 font-semibold text-xs text-slate-900">
            <ShieldCheck className="w-4 h-4 text-slate-700" />
            <span>Restaurant Owner</span>
          </div>
          <p className="text-[11px] text-slate-500">
            Full authority: pricing, billing, QR branding, staff permissions, verified replies.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-1">
          <div className="flex items-center gap-2 font-semibold text-xs text-blue-700">
            <UserCheck className="w-4 h-4 text-blue-600" />
            <span>Restaurant Manager</span>
          </div>
          <p className="text-[11px] text-slate-500">
            Menu editing, category arrangement, review reply drafts, analytics viewing.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-1">
          <div className="flex items-center gap-2 font-semibold text-xs text-emerald-700">
            <Key className="w-4 h-4 text-emerald-600" />
            <span>Floor Staff</span>
          </div>
          <p className="text-[11px] text-slate-500">
            Real-time item 86-ing (marking sold out / in-stock), view live diner feedback.
          </p>
        </div>
      </div>

      {/* Staff Table */}
      <div className="bg-white rounded-xl border border-slate-200/90 overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 uppercase font-semibold text-[10px] tracking-wider">
            <tr>
              <th className="px-4 py-3">Name & Email</th>
              <th className="px-4 py-3">Assigned Role</th>
              <th className="px-4 py-3">Last Active</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {staff.map((member) => (
              <tr key={member.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs">
                      {member.name.charAt(0)}
                    </div>
                    <div>
                      <span className="font-semibold text-slate-900 block">{member.name}</span>
                      <span className="text-slate-400 text-[11px] flex items-center gap-1">
                        <Mail className="w-3 h-3 text-slate-400" />
                        {member.email}
                      </span>
                    </div>
                  </div>
                </td>

                <td className="px-4 py-3">
                  <span className={cn(
                    "px-2 py-0.5 rounded text-[10px] font-semibold border",
                    member.role === "RESTAURANT_OWNER"
                      ? "bg-slate-900 text-white border-slate-900"
                      : member.role === "RESTAURANT_MANAGER"
                      ? "bg-blue-50 text-blue-700 border-blue-200"
                      : "bg-slate-100 text-slate-700 border-slate-200"
                  )}>
                    {member.role.replace("_", " ")}
                  </span>
                </td>

                <td className="px-4 py-3 text-slate-500">
                  {member.lastActive}
                </td>

                <td className="px-4 py-3 text-right">
                  {member.role !== "RESTAURANT_OWNER" && (
                    <Button
                      onClick={() => handleRemoveMember(member.id, member.name)}
                      variant="ghost"
                      size="sm"
                      className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg h-7 px-2 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Invite Modal */}
      {isInviteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="relative w-full max-w-md bg-white text-slate-900 rounded-xl border border-slate-200 shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                  <Users className="w-4 h-4" />
                </div>
                <h3 className="font-semibold text-sm text-slate-900">Invite Team Member</h3>
              </div>
              <button
                onClick={() => setIsInviteOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddMember} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Full Name</label>
                <Input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Matteo Ferrari"
                  required
                  className="bg-white border-slate-200 text-xs h-8.5"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Email Address</label>
                <Input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="e.g. matteo@gustotrattoria.example.com"
                  required
                  className="bg-white border-slate-200 text-xs h-8.5"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Assigned Role</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as any)}
                  className="w-full rounded-lg border border-slate-200 bg-white p-2 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 h-8.5"
                >
                  <option value="RESTAURANT_MANAGER">Restaurant Manager (Menu & Reviews)</option>
                  <option value="RESTAURANT_STAFF">Restaurant Floor Staff (86-ing & Live View)</option>
                  <option value="RESTAURANT_OWNER">Restaurant Co-Owner (Full Authority)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <Button type="button" variant="ghost" onClick={() => setIsInviteOpen(false)} className="text-xs h-8.5 rounded-lg">
                  Cancel
                </Button>
                <Button type="submit" className="bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg text-xs h-8.5 px-4 shadow-xs cursor-pointer">
                  <Check className="w-3.5 h-3.5 mr-1" />
                  Send Invitation
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
