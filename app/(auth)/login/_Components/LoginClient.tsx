"use client";

import { useActionState } from "react";
import { login } from "../_ServerSideActions/action";

const LoginClient = () => {
  const [state, formAction, isPending] = useActionState(login, {
    success: false,
    status: 200,
    message: "",
  });

  return (
    <div>
      <form action={formAction}>
        <input type="email" name="email" placeholder="Eter our email" />
        <input
          type="password"
          name="password"
          placeholder="Enter your password"
        />
        {state?.success && <p className="text-green-500">{state?.message}</p>}
        {!state?.success && <p className="text-red-500">{state?.message}</p>}
        <button type="submit" disabled={isPending}>
          {isPending ? "Login..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default LoginClient;
