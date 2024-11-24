"use server"

import * as z from "zod";
import { LoginSchema, RegisterSchema } from "../../schemas";
import bcrypt from "bcryptjs";
import { db } from "../db";
import { getUserByEmail } from "../data/user-data";
import { signIn, signOut } from "../../auth";
import { DEFAULT_LOGIN_REDIRECT } from "../../routes";
import { AuthError } from "next-auth";


export async function Login(values : z.infer<typeof LoginSchema>){
    const validateFields = LoginSchema.safeParse(values);

    if (!validateFields.success) {
        return {error: "Invalid fields!"};
    }

    const { email, password } = validateFields.data;

    try {
        await signIn('credentials', {
            email,
            password,
            redirectTo: DEFAULT_LOGIN_REDIRECT
        })
        return {success: "Login Success.."};
    } catch (error) {
        if (error instanceof AuthError){
            console.log(error);
            switch (error.type){
                case "CredentialsSignin":
                    return { error: "Email atau Password salah!"}
                default:
                    return {success: "Login Success.."}
            }
        }
        console.log(error);
        throw error;
    }
}

export async function Register(values : z.infer<typeof RegisterSchema>){
    const validateFields = RegisterSchema.safeParse(values);

    if (!validateFields.success) {
        return {error: "Invalid fields!"};
    }

    console.log(validateFields.data);

    const { name, email, password} = validateFields.data;

    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await getUserByEmail(email);

    if (existingUser) {
        return {error: "Email sudah terdaftar!"};
    }

    await db.user.create({
        data: {
            name : name,
            email: email,
            password: hashedPassword
        }
    })
    
    return {success: "Membuat User Success.."};
}

export async function SignOut(){
    await signOut();
    
}