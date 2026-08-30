import type { Prisma } from "../generated/prisma/client.js";
import prisma from "./prisma.js";

export const getUser = async () => {
  return await prisma.users.findMany({
    select: {
      id: true, 
      name: true,
      email: true,
      _count: {
        select: { produtos: true },
      },
    },

    orderBy: {
      name: "asc",
    },
  });
};

export const createUser = async (data: Prisma.usersCreateInput) => {
  return await prisma.users.create({
    data,
  });
};

export const deleteUser = async (id: number) => {
  return await prisma.users.delete({
    where: { id: id },
  });
};
