import { renderUsers, setupUsersInterface } from "./users.js";
import { createProduct, createUser, deleteProduct, deleteUser, getProducts, getUsers, } from "./api.js";
import { renderProducts, setupProductsInterface } from "./produtos.js";
const navigationItems = document.querySelectorAll("[data-view]");
const views = document.querySelectorAll(".view-panel");
function showView(viewId) {
    views.forEach((view) => {
        view.classList.toggle("is-hidden", view.id !== viewId);
    });
    navigationItems.forEach((item) => {
        item.classList.toggle("is-active", item.dataset.view === viewId);
    });
}
function setFeedback(message, type) {
    const feedback = document.getElementById("app-feedback");
    if (!feedback)
        return;
    feedback.textContent = message;
    feedback.className = `feedback feedback-${type}`;
}
function errorMessage(error) {
    if (error instanceof Error)
        return error.message;
    return "Ocorreu um erro inesperado ao comunicar com a API.";
}
function setTableMessage(viewId, message) {
    const table = document.querySelector(`#${viewId} .table-card`);
    if (!table)
        return;
    table.querySelectorAll(".data-row").forEach((row) => row.remove());
    const emptyState = table.querySelector(".empty-state");
    if (emptyState) {
        emptyState.textContent = message;
        return;
    }
    const messageElement = document.createElement("div");
    messageElement.className = "empty-state";
    messageElement.textContent = message;
    table.append(messageElement);
}
async function loadUsers() {
    try {
        renderUsers(await getUsers());
    }
    catch (error) {
        setTableMessage("users-view", "Não foi possível carregar os usuários.");
        setFeedback(`Não foi possível carregar usuários: ${errorMessage(error)}`, "error");
    }
}
async function loadProducts() {
    try {
        renderProducts(await getProducts());
    }
    catch (error) {
        setTableMessage("products-view", "Não foi possível carregar os produtos.");
        setFeedback(`Não foi possível carregar produtos: ${errorMessage(error)}`, "error");
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
        }
        catch (error) {
            setFeedback(errorMessage(error), "error");
            throw error;
        }
    },
    onDelete: async (id) => {
        try {
            await deleteUser(id);
            setFeedback("Usuário deletado com sucesso.", "success");
            await loadUsers();
        }
        catch (error) {
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
        }
        catch (error) {
            setFeedback(errorMessage(error), "error");
            throw error;
        }
    },
    onDelete: async (id) => {
        try {
            await deleteProduct(id);
            setFeedback("Produto deletado com sucesso.", "success");
            await loadProducts();
        }
        catch (error) {
            setFeedback(errorMessage(error), "error");
            throw error;
        }
    },
});
void loadUsers();
void loadProducts();
