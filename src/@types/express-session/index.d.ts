// src/@types/express-session/index.d.ts

import { User } from "@prisma/client";

declare module "express-session" {
  interface SessionData {
    userId?: string;
    user?: User;
  }
}
