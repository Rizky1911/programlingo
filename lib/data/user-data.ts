import { db } from "../db";
import { unstable_noStore as noStore } from 'next/cache';

export async function getUserByEmail(email:string) {
    try {
        const user = await db.user.findUnique({
            where: {email}
        })

        return user;
    } catch (error) {
        return error;
    }
}

export async function getUserById(id:string) {
    const user = await db.user.findUnique({
        where: {id: id}
    })

    return user;
}

export async function getAllUser() {
    noStore();
    const user = await db.user.findMany();

    return user;
}