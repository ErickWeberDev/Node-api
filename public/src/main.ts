import { renderUsers, setupUsersInterface } from "./users.js";
import {
  createProduct,
  createUser,
  deleteProduct,
  deleteUser,
  getProducts,
  getUsers,
} from "./api.js";
import { renderProducts, setupProductsInterface } from "./produtos.js";

const navigationItems =
  document.querySelectorAll<HTMLButtonElement>("[data-view]");
const views = document.querySelectorAll<HTMLElement>(".view-panel");

function showView(viewId: string): void {
  views.forEach((view) => {
    view.classList.toggle("is-hidden", view.id !== viewId);
  });

  navigationItems.forEach((item) => {
    item.classList.toggle("is-active", item.dataset.view === viewId);
  });
}

function setFeedback(message: string, type: "success" | "error"): void {
  const feedback = document.getElementById("app-feedback");
  if (!feedback) return;

  feedback.textContent = message;
  feedback.className = `feedback feedback-${type}`;
}

function errorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return "Ocorreu um erro inesperado ao comunicar com a API.";
}

function setTableMessage(viewId: string, message: string): void {
  const table = document.querySelector<HTMLElement>(`#${viewId} .table-card`);
  if (!table) return;

  table.querySelectorAll(".data-row").forEach((row) => row.remove());
  const emptyState = table.querySelector<HTMLElement>(".empty-state");
  if (emptyState) {
    emptyState.textContent = message;
    return;
  }

  const messageElement = document.createElement("div");
  messageElement.className = "empty-state";
  messageElement.textContent = message;
  table.append(messageElement);
}

async function loadUsers(): Promise<void> {
  try {
    renderUsers(await getUsers());
  } catch (error) {
    setTableMessage("users-view", "Não foi possível carregar os usuários.");
    setFeedback(
      `Não foi possível carregar usuários: ${errorMessage(error)}`,
      "error",
    );
  }
}

async function loadProducts(): Promise<void> {
  try {
    renderProducts(await getProducts());
  } catch (error) {
    setTableMessage("products-view", "Não foi possível carregar os produtos.");
    setFeedback(
      `Não foi possível carregar produtos: ${errorMessage(error)}`,
      "error",
    );
  }
}

navigationItems.forEach((item) => {
  item.addEventListener("click", () => {
    const viewId = item.dataset.view;

    if (viewId) {
      showView(viewId);
    }
  });
});

setupUsersInterface({
  onCreate: async (data) => {
    try {
      await createUser(data);
      setFeedback("Usuário enviado com sucesso.", "success");
      await loadUsers();
    } catch (error) {
      setFeedback(errorMessage(error), "error");
      throw error;
    }
  },
  onDelete: async (id) => {
    try {
      await deleteUser(id);
      setFeedback("Usuário deletado com sucesso.", "success");
      await loadUsers();
    } catch (error) {
      setFeedback(errorMessage(error), "error");
      throw error;
    }
  },
});

setupProductsInterface({
  onCreate: async (data) => {
    try {
      await createProduct(data);
      setFeedback("Produto enviado com sucesso.", "success");
      await loadProducts();
    } catch (error) {
      setFeedback(errorMessage(error), "error");
      throw error;
    }
  },
  onDelete: async (id) => {
    try {
      await deleteProduct(id);
      setFeedback("Produto deletado com sucesso.", "success");
      await loadProducts();
    } catch (error) {
      setFeedback(errorMessage(error), "error");
      throw error;
    }
  },
});

void loadUsers();
void loadProducts();
