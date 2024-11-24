import * as z from "zod";

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(6, {
    message: "Password is required",
  }),
});

export const RegisterSchema = z.object({
  name: z.string().min(1, {
      message: "Name is required"
  }),
  email: z.string().email({
      message: "Email is required"
  }),
  password: z.string().min(6, {
      message: "Minimum 6 character"
  })
})

export const UserSchema = z.object({
  name: z.string().min(1, {
    message: "Name is required",
  }),
  email: z.string().email({
    message: "Email is required",
  }),
  phone: z.string(),
  password: z.string().min(6, {
    message: "Minimum 6 character",
  }),
});