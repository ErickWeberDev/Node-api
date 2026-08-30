import type { Produto } from "./produtos.js";
import type { User } from "./users.js";

export declare const API_URL: string;

export interface UserInput {
  name: string;
  email: string;
  number: string;
}

export interface ProdutoInput {
  name: string;
  preco: number;
  userId: number;
}

export declare class ApiError extends Error {
  readonly status?: number;
  constructor(message: string, status?: number);
}

export declare const getUsers: () => Promise<User[]>;
export declare const getProducts: () => Promise<Produto[]>;
export declare const createUser: (data: UserInput) => Promise<User>;
export declare const createProduct: (data: ProdutoInput) => Promise<Produto>;
export declare const deleteUser: (id: number) => Promise<unknown>;
export declare const deleteProduct: (id: number) => Promise<unknown>;
