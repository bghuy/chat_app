

import { UserRole } from "@prisma/client";
import { DefaultSession } from "next-auth";
// import { UserRole } from "./user";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string; 
      role: UserRole;
    };
  }

  interface User {
    role: UserRole;
  }
}
