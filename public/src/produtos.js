const productModalIds = ["add-product-modal", "delete-product-modal"];
function getModal(modalId) {
    return document.getElementById(modalId);
}
function closeModal(modal) {
    modal.classList.add("is-hidden");
}
function openModal(modal) {
    modal.classList.remove("is-hidden");
    modal.querySelector("input")?.focus();
}
export function setupProductsInterface(actions) {
    document
        .querySelectorAll("[data-modal]")
        .forEach((button) => {
        const modalId = button.dataset.modal;
        if (modalId && productModalIds.includes(modalId)) {
            button.addEventListener("click", () => {
                const modal = getModal(modalId);
                if (modal)
                    openModal(modal);
            });
        }
    });
    productModalIds.forEach((modalId) => {
        const modal = getModal(modalId);
        if (!modal)
            return;
        modal
            .querySelectorAll(".modal-close, .button-secondary")
            .forEach((button) => {
            button.addEventListener("click", () => closeModal(modal));
        });
        modal.addEventListener("click", (event) => {
            if (event.target === modal)
                closeModal(modal);
        });
        const form = modal.querySelector("form");
        form?.addEventListener("submit", async (event) => {
            event.preventDefault();
            if (!actions || !form.reportValidity())
                return;
            const formData = new FormData(form);
            try {
                if (modalId === "add-product-modal") {
                    const name = String(formData.get("name") ?? "").trim();
                    const preco = Number(formData.get("price"));
                    const userId = Number(formData.get("userId"));
                    if (!name ||
                        !Number.isFinite(preco) ||
                        preco < 0 ||
                        !Number.isInteger(userId) ||
                        userId <= 0)
                        return;
                    await actions.onCreate({
                        name,
                        preco,
                        userId,
                    });
                }
                else {
                    const id = Number(formData.get("id"));
                    if (!Number.isInteger(id) || id <= 0)
                        return;
                    if (!window.confirm(`Deseja deletar o produto de ID ${id}?`))
                        return;
                    await actions.onDelete(id);
                }
                closeModal(modal);
                form.reset();
            }
            catch { }
        });
    });
    document.addEventListener("keydown", (event) => {
        if (event.key !== "Escape")
            return;
        productModalIds.forEach((modalId) => {
            const modal = getModal(modalId);
            if (modal && !modal.classList.contains("is-hidden"))
                closeModal(modal);
        });
    });
}
function formatPrice(price) {
    const numericPrice = Number(price);
    if (!Number.isFinite(numericPrice))
        return "Preço indisponível";
    return numericPrice.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
    });
}
export function renderProducts(products) {
    const table = document.querySelector("#products-view .table-card");
    if (!table)
        return;
    table.querySelector(".empty-state")?.remove();
    table.querySelectorAll(".data-row").forEach((row) => row.remove());
    if (products.length === 0) {
        const emptyState = document.createElement("div");
        emptyState.className = "empty-state";
        emptyState.textContent = "Nenhum produto encontrado.";
        table.append(emptyState);
        return;
    }
    products.forEach((product) => {
        const row = document.createElement("div");
        row.className = "data-row";
        const values = [
            product.name,
            formatPrice(product.preco),
            product.user?.name ??
                (product.userId ? `ID ${product.userId}` : "Não informado"),
            product.id === undefined ? "Não informado" : String(product.id),
        ];
        values.forEach((value, index) => {
            const cell = document.createElement(index === 0 ? "strong" : "span");
            cell.textContent = value;
            row.append(cell);
        });
        table.append(row);
    });
}
