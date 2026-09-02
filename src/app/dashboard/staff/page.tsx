"use client";

import React, { useState, useEffect } from "react";
import { Users, Plus, ShieldCheck, UserCheck, Key, Mail, Trash2, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

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
    setNotification(`Invitation sent and ${newMember.name} added as ${newMember.role.replace("_", " ")}!`);
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
          <h1 className="text-2xl font-black text-stone-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-600" />
            Staff & Role-Based Access Control
          </h1>
          <p className="text-xs text-stone-500 font-medium">
            Configure access roles across Owner, Manager, and Floor Staff with strict tenant data isolation
          </p>
        </div>

        <Button
          onClick={() => setIsInviteOpen(true)}
          className="bg-orange-600 hover:bg-orange-500 text-white rounded-xl font-bold flex items-center gap-1.5 shadow-md shadow-orange-600/20 hover:scale-105 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Invite Team Member</span>
        </Button>
      </div>

      {notification && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-fade-in shadow-xs">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Roles Legend Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-3xl bg-white border border-stone-200/90 shadow-sm space-y-1">
          <div className="flex items-center gap-2 font-black text-xs text-orange-600">
            <ShieldCheck className="w-4 h-4" />
            <span>Restaurant Owner</span>
          </div>
          <p className="text-[11px] text-stone-600 font-medium">
            Full authority: pricing, billing, QR branding, staff permissions, verified replies.
          </p>
        </div>

        <div className="p-4 rounded-3xl bg-white border border-stone-200/90 shadow-sm space-y-1">
          <div className="flex items-center gap-2 font-black text-xs text-blue-600">
            <UserCheck className="w-4 h-4" />
            <span>Restaurant Manager</span>
          </div>
          <p className="text-[11px] text-stone-600 font-medium">
            Menu editing, category arrangement, review reply drafts, analytics viewing.
          </p>
        </div>

        <div className="p-4 rounded-3xl bg-white border border-stone-200/90 shadow-sm space-y-1">
          <div className="flex items-center gap-2 font-black text-xs text-emerald-600">
            <Key className="w-4 h-4" />
            <span>Restaurant Floor Staff</span>
          </div>
          <p className="text-[11px] text-stone-600 font-medium">
            Real-time item 86-ing (marking sold out / in-stock), view live diner feedback.
          </p>
        </div>
      </div>

      {/* Staff Table */}
      <div className="bg-white rounded-3xl border border-stone-200/90 overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="bg-stone-50 text-stone-500 border-b border-stone-200 uppercase font-black text-[10px] tracking-wider">
            <tr>
              <th className="p-4">Name & Email</th>
              <th className="p-4">Assigned Role</th>
              <th className="p-4">Last Active</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {staff.map((member) => (
              <tr key={member.id} className="hover:bg-stone-50/80 transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center font-bold">
                      {member.name.charAt(0)}
                    </div>
                    <div>
                      <span className="font-bold text-stone-900 block">{member.name}</span>
                      <span className="text-stone-500 text-[11px] flex items-center gap-1 font-medium">
                        <Mail className="w-3 h-3 text-stone-400" />
                        {member.email}
                      </span>
                    </div>
                  </div>
                </td>

                <td className="p-4">
                  <span className="px-2.5 py-1 rounded-lg bg-orange-50 text-orange-700 font-bold text-[11px] border border-orange-200">
                    {member.role.replace("_", " ")}
                  </span>
                </td>

                <td className="p-4 text-stone-600 font-medium">
                  {member.lastActive}
                </td>

                <td className="p-4 text-right">
                  {member.role !== "RESTAURANT_OWNER" && (
                    <Button
                      onClick={() => handleRemoveMember(member.id, member.name)}
                      variant="ghost"
                      size="sm"
                      className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl"
                    >
                      <Trash2 className="w-4 h-4" />
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md bg-white text-stone-900 rounded-3xl border border-stone-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                  <Users className="w-5 h-5" />
                </div>
                <h3 className="font-black text-base text-stone-900">Invite Team Member</h3>
              </div>
              <button
                onClick={() => setIsInviteOpen(false)}
                className="p-1.5 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddMember} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700">Full Name</label>
                <Input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Matteo Ferrari"
                  required
                  className="bg-white border-stone-200"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700">Email Address</label>
                <Input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="e.g. matteo@gustotrattoria.example.com"
                  required
                  className="bg-white border-stone-200"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700">Assigned Role</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as any)}
                  className="w-full rounded-xl border border-stone-200 bg-white p-2.5 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="RESTAURANT_MANAGER">Restaurant Manager (Menu & Reviews)</option>
                  <option value="RESTAURANT_STAFF">Restaurant Floor Staff (86-ing & Live View)</option>
                  <option value="RESTAURANT_OWNER">Restaurant Co-Owner (Full Authority)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button type="button" variant="ghost" onClick={() => setIsInviteOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xl shadow-md shadow-orange-600/20">
                  <Check className="w-4 h-4 mr-1.5" />
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
