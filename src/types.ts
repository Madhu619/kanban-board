// Will declare the types used in the application

//Sample user
export type UserRole = "admin" | "contributor";

export type User = {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
};
