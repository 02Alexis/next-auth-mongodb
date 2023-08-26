"use client";
import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

function LoginPage() {
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const res = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
    });
    if (res?.error) return setError(res.error as string);

    if (res?.ok) return router.push("/dashboard/profile");

    console.log(res);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        {error && <div className="bg-red-500 text-white p-2 mb-2">{error}</div>}
        <h1>Iniciar Sesión</h1>
        <input
          type="email"
          placeholder="example01@gmail.com"
          name="email"
          className="bg-zinc-800 px-4 py-2 block mb-2"
        />
        <input
          type="password"
          placeholder="********"
          name="password"
          className="bg-zinc-800 px-4 py-2 block mb-2"
        />

        <button className="bg-indigo-500 px-4 py-2">Login</button>
      </form>
    </div>
  );
}

export default LoginPage;
