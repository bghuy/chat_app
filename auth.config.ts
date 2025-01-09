import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials";
import { LoginSchema } from "@/schemas";
import { getUserByEmail } from "@/data/user";
import bcrypt from "bcryptjs"
import { NextAuthConfig } from "next-auth";
export default {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    }),
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET
    }),
    CredentialsProvider({
      // id: "domain-login",
      // name: "Domain Account",
      // credentials: {
      //   email: { label: "Email", type: "text", placeholder: "you@example.com" },
      //   password: { label: "Password", type: "password", placeholder: "your password" },
      // },
      async authorize(credentials){
        try {
          const validatedFields = LoginSchema.safeParse(credentials);
          if(validatedFields.success){
            const {email,password} = validatedFields.data;
            const user = await getUserByEmail(email);
            if(!user || !user.password){
              return null;
            }
            const passwordMatch = await bcrypt.compare(
              password,
              user.password
            )
            if(passwordMatch) return user;
          }
  
          return null;
          
        } catch (error) {
          console.log(error,"error");
          return null
        }
      },
    })
  ],
} satisfies NextAuthConfig