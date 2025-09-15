import { Request, Response, NextFunction } from "express";
import { ApiError } from "./errorHandler";

export async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.session.user) {
    next();
    return;
  }

  throw new ApiError(
    401,
    "Unauthorized! Please login to access this endpoint."
  );
}

export async function authorize(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (
    req.session.user?.role === "SUPERVISOR" ||
    req.session.user?.role === "ADMIN"
  ) {
    next();
    return;
  }

  throw new ApiError(
    403,
    "Only Admins and Supervisors can access this resource"
  );
}
