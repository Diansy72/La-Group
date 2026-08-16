import React from "react";
import Avatar from "@/components/atoms/avatar";

interface UserMenuProps {
  name: string;
  role: string;
  avatarUrl?: string;
}

export default function UserMenu({ name, role, avatarUrl }: UserMenuProps) {
  return (
    <div className="flex items-center gap-3 cursor-pointer group">
      <Avatar src={avatarUrl} name={name} size="md" />
      <div className="hidden md:block text-right">
        <p className="text-sm font-semibold text-gray-900 group-hover:text-blue-900 transition-colors">
          Halo, {name}
        </p>
        <p className="text-xs text-gray-500">{role}</p>
      </div>
    </div>
  );
}
