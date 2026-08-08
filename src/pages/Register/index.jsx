import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { useAuth } from "../../context/AuthContext";
import Input from "../../components/forms/Input";
import Button from "../../components/ui/Button";
import { Heading, Text } from "../../components/ui/Typography";

const schema = z
  .object({
    name: z.string().min(2, "Enter your full name"),
    email: z.string().email("Enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

function Register() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      await registerUser(data);
      toast.success("Account created — welcome to Cushite Beauty!");
      navigate("/", { replace: true });
    } catch (err) {
      toast.error(friendlyAuthError(err.code));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#FAFAFA] px-6 py-20">
      <div className="w-full max-w-md rounded-[var(--radius-lg)] bg-[var(--surface)] p-8 shadow-[var(--shadow-card)]">
        <Heading level="h3" align="center" className="mb-2">
          Create an Account
        </Heading>
        <Text tone="muted" align="center" className="mb-8">
          Join Cushite Beauty for a personalized experience.
        </Text>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Input label="Full Name" placeholder="Jane Doe" error={errors.name?.message} {...register("name")} />
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
          <Input
            label="Confirm Password"
            type="password"
            placeholder="••••••••"
            error={errors.confirmPassword?.message}
            {...register("confirmPassword")}
          />
          <Button type="submit" variant="primary" size="lg" loading={submitting} className="mt-2">
            Create Account
          </Button>
        </form>

        <Text align="center" size="sm" tone="muted" className="mt-6">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-[var(--primary)]">
            Log in
          </Link>
        </Text>
      </div>
    </main>
  );
}

function friendlyAuthError(code) {
  switch (code) {
    case "auth/email-already-in-use":
      return "That email is already registered. Try logging in instead.";
    case "auth/weak-password":
      return "Please choose a stronger password.";
    default:
      return "Something went wrong. Please try again.";
  }
}

export default Register;
