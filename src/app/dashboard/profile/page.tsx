"use client";

import { useSession, signOut } from "next-auth/react";

function ProfilePage() {
  const { data: session, status } = useSession();
  
  return (
    <div className="justify-center h-[calc(100vh-4rem)] flex flex-col items-center gap-y-5">
      <h1 className="text-3xl font-bold mb-7">Perfil</h1>

      <pre
      className="bg-zinc-800 p-4"
      >{JSON.stringify({ session, status }, null, 2)}</pre>

      <button
      className="bg-indigo-500 px-4 py-2 block mb-2"
        onClick={() => {
          signOut();
        }}
      >
        Logout
      </button>
    </div>
  );
}

export default ProfilePage;
