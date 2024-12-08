import React from "react";

const Avatar = ({ name, host }) => {
  const initials = getInitials(name);

  return (
    <div
      className={`flex items-center justify-center rounded-full bg-[#232323] text-white font-medium ${
        host ? "w-12 h-12 text-xl" : "w-8 h-8 text-sm"
      }`}
    >
      {initials}
    </div>
  );
};

function getInitials(name) {
  if (!name) return "";
  return name[0].toUpperCase();
}

export default Avatar;
