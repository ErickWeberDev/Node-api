import { Router } from "express";
import { createUser, deleteUser, getUser } from "../lib/User.js";
import {
  createProdutos,
  deleteProdutos,
  deleteUserProdutos,
  getProdutos,
} from "../lib/produtos.js";

export const router = Router();

interface CreateUserBody {
  name?: unknown;
  email?: unknown;
  number?: unknown;
}

interface CreateProductBody {
  name?: unknown;
  preco?: unknown;
  userId?: unknown;
}

router.get("/user", async (req, res) => {
  const user = await getUser();
  return res.json(user);
});

router.get("/produtos", async (req, res) => {
  const produtos = await getProdutos();
  return res.json(produtos);
});

router.post("/user", async (req, res) => {
  const body = req.body as CreateUserBody;
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const number = typeof body.number === "string" ? body.number.trim() : "";

  if (!name || !email || !number) {
    return res
      .status(400)
      .json({ error: "Nome, e-mail e número são obrigatórios." });
  }

  try {
    const user = await createUser({ name, email, number });
    return res.status(201).json(user);
  } catch {
    return res.status(409).json({ error: "E-mail ou número já cadastrado." });
  }
});

router.post("/pordutos", async (req, res) => {
  const body = req.body as CreateProductBody;
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const preco = Number(body.preco);
  const userId = Number(body.userId);

  if (
    !name ||
    !Number.isFinite(preco) ||
    preco < 0 ||
    !Number.isInteger(userId) ||
    userId <= 0
  ) {
    return res
      .status(400)
      .json({
        error: "Nome, preço e ID do usuário são obrigatórios e válidos.",
      });
  }

  try {
    const product = await createProdutos({
      name,
      preco,
      user: { connect: { id: userId } },
    });

    return res.status(201).json(product);
  } catch {
    return res
      .status(400)
      .json({
        error: "Não foi possível criar o produto ou o usuário não existe.",
      });
  }
});

router.delete("/user/:id", async (req, res) => {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ error: "ID inválido" });
  }

  await deleteUserProdutos(id);
  const user = await deleteUser(id);
  return res.json({ complet: `deu certo o ${user}` });
});

router.delete("/produtos/:id", async (req, res) => {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ error: "ID inválido" });
  }

  const produto = await deleteProdutos(id);
  return res.json({ complet: `deu certo o ${produto}` });
});
