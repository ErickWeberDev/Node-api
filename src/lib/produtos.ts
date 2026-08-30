import type { Prisma } from "../generated/prisma/client.js";
import prisma from "./prisma.js";

export const getProdutos = async () => {
  return prisma.produtos.findMany({
    select: {
      name: true,
      preco: true,
    },

    orderBy: {
      name: "asc",
    },
  });
};

export const createProdutos = async (data: Prisma.produtosCreateInput) => {
  return await prisma.produtos.create({
    data,
  });
};

export const deleteProdutos = async (id: number) => {
  return await prisma.produtos.delete({
    where: { id: id },
  });
};

export const deleteUserProdutos = async (id: number) => {
  return await prisma.produtos.deleteMany({
    where: {
      userId: id,
    },
  });
};
