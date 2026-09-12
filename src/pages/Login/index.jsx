import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";

import { useAuth } from "../../context/AuthContext";
import Input from "../../components/forms/Input";
import Button from "../../components/ui/Button";
import { Heading, Text } from "../../components/ui/Typography";

const schema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      await login(data);
      toast.success("Welcome back!");
      navigate(location.state?.from?.pathname || "/", { replace: true });
    } catch (err) {
      toast.error(friendlyAuthError(err.code));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#FAFAFA] px-6 py-20">
      <div className="w-full max-w-md overflow-hidden rounded-[var(--radius-lg)] bg-[var(--surface)] shadow-[var(--shadow-card)]">
        <div
          className="px-8 py-8 text-center"
          style={{ background: "linear-gradient(135deg,#4A136C 0%, #381055 100%)" }}
        >
          <Heading level="h3" align="center" className="!text-white">
            Welcome Back
          </Heading>
          <Text style={{ fontFamily: "`Bricolage Grotesque`, sans-serif" }} align="center" className="mt-2 text-white/70">
            Log in to your Cushite Beauty account.
          </Text>
        </div>

        <div className="p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              error={errors.email?.message}
              {...register("email")}
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              error={errors.password?.message}
              {...register("password")}
            />
            <Button type="submit" variant="primary" size="lg" loading={submitting} className="mt-2">
              Log In
            </Button>
          </form>

          <Text style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} align="center" size="sm" tone="muted" className="mt-6">
            Don't have an account?{" "}
            <Link to="/register" className="font-semibold text-[var(--primary)]">
              Create one
            </Link>
          </Text>
        </div>
      </div>
    </main>
  );
}

function friendlyAuthError(code) {
  switch (code) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "Incorrect email or password.";
    case "auth/too-many-requests":
      return "Too many attempts. Please try again later.";
    default:
      return "Something went wrong. Please try again.";
  }
}

export default Login;
