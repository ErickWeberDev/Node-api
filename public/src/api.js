export const API_URL = "http://localhost:3000";
export class ApiError extends Error {
    constructor(message, status) {
        super(message);
        this.status = status;
        this.name = "ApiError";
    }
}
function isRecord(value) {
    return typeof value === "object" && value !== null;
}
function isUser(value) {
    return (isRecord(value) &&
        typeof value.id === "number" &&
        typeof value.name === "string" &&
        typeof value.email === "string");
}
function isProduto(value) {
    return (isRecord(value) &&
        typeof value.name === "string" &&
        (typeof value.preco === "number" || typeof value.preco === "string") &&
        Number.isFinite(Number(value.preco)));
}
async function requestJson(path, options = {}) {
    let response;
    try {
        response = await fetch(`${API_URL}${path}`, options);
    }
    catch {
        throw new ApiError("Não foi possível conectar ao back-end local.");
    }
    const payload = await response.json().catch(() => null);
    if (!response.ok) {
        const serverMessage = isRecord(payload) && typeof payload.error === "string"
            ? payload.error
            : `A API respondeu com erro HTTP ${response.status}.`;
        throw new ApiError(serverMessage, response.status);
    }
    return payload;
}
function jsonOptions(body) {
    return {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    };
}
async function requestList(path, isItem) {
    const payload = await requestJson(path);
    if (!Array.isArray(payload) || !payload.every(isItem)) {
        throw new ApiError("A API retornou uma lista em formato inesperado.");
    }
    return payload;
}
export const getUsers = () => requestList("/user", isUser);
export const getProducts = () => requestList("/produtos", isProduto);
export const createUser = (data) => requestJson("/user", jsonOptions(data));
export const createProduct = (data) => requestJson("/pordutos", jsonOptions({
    name: data.name,
    preco: data.preco,
    userId: data.userId,
}));
export const deleteUser = (id) => requestJson(`/user/${id}`, { method: "DELETE" });
export const deleteProduct = (id) => requestJson(`/produtos/${id}`, { method: "DELETE" });
