import type { Produto } from "./produtos.js";
import type { User } from "./users.js";

export const API_URL = "http://localhost:3000";

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

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isUser(value: unknown): value is User {
  return (
    isRecord(value) &&
    typeof value.id === "number" &&
    typeof value.name === "string" &&
    typeof value.email === "string"
  );
}

function isProduto(value: unknown): value is Produto {
  return (
    isRecord(value) &&
    typeof value.name === "string" &&
    (typeof value.preco === "number" || typeof value.preco === "string") &&
    Number.isFinite(Number(value.preco))
  );
}

async function requestJson<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${API_URL}${path}`, options);
  } catch {
    throw new ApiError("Não foi possível conectar ao back-end local.");
  }

  const payload: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    const serverMessage =
      isRecord(payload) && typeof payload.error === "string"
        ? payload.error
        : `A API respondeu com erro HTTP ${response.status}.`;
    throw new ApiError(serverMessage, response.status);
  }

  return payload as T;
}

function jsonOptions(body: unknown): RequestInit {
  return {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  };
}

async function requestList<T>(
  path: string,
  isItem: (value: unknown) => value is T,
): Promise<T[]> {
  const payload = await requestJson<unknown>(path);
  if (!Array.isArray(payload) || !payload.every(isItem)) {
    throw new ApiError("A API retornou uma lista em formato inesperado.");
  }
  return payload;
}

export const getUsers = (): Promise<User[]> => requestList("/user", isUser);

export const getProducts = (): Promise<Produto[]> =>
  requestList("/produtos", isProduto);

export const createUser = (data: UserInput): Promise<User> =>
  requestJson<User>("/user", jsonOptions(data));

export const createProduct = (data: ProdutoInput): Promise<Produto> =>
  requestJson<Produto>(
    "/pordutos",
    jsonOptions({
      name: data.name,
      preco: data.preco,
      userId: data.userId,
    }),
  );

export const deleteUser = (id: number): Promise<unknown> =>
  requestJson<unknown>(`/user/${id}`, { method: "DELETE" });

export const deleteProduct = (id: number): Promise<unknown> =>
  requestJson<unknown>(`/produtos/${id}`, { method: "DELETE" });
