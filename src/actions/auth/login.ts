"use client"
import { LoginByCredentials } from "@/services/auth";

export const LocalLogin = async (email: string, password: string) => {
    try {
        if(!email || !password){
            throw new Error("Invalid credentials!");
        }
        const response = await LoginByCredentials(email, password);
        return response;
    } catch (error) {
        throw error;
    }
}