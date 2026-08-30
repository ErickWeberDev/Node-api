const userModalIds = ["add-user-modal", "delete-user-modal"];
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
export function setupUsersInterface(actions) {
    document
        .querySelectorAll("[data-modal]")
        .forEach((button) => {
        const modalId = button.dataset.modal;
        if (modalId && userModalIds.includes(modalId)) {
            button.addEventListener("click", () => {
                const modal = getModal(modalId);
                if (modal)
                    openModal(modal);
            });
        }
    });
    userModalIds.forEach((modalId) => {
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
                if (modalId === "add-user-modal") {
                    const name = String(formData.get("name") ?? "").trim();
                    const email = String(formData.get("email") ?? "").trim();
                    const number = String(formData.get("number") ?? "").trim();
                    if (!name || !email || !number)
                        return;
                    await actions.onCreate({
                        name,
                        email,
                        number,
                    });
                }
                else {
                    const id = Number(formData.get("id"));
                    if (!Number.isInteger(id) || id <= 0)
                        return;
                    if (!window.confirm(`Deseja deletar o usuário de ID ${id}?`))
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
        userModalIds.forEach((modalId) => {
            const modal = getModal(modalId);
            if (modal && !modal.classList.contains("is-hidden"))
                closeModal(modal);
        });
    });
}
export function renderUsers(users) {
    const table = document.querySelector("#users-view .table-card");
    if (!table)
        return;
    table.querySelector(".empty-state")?.remove();
    table.querySelectorAll(".data-row").forEach((row) => row.remove());
    if (users.length === 0) {
        const emptyState = document.createElement("div");
        emptyState.className = "empty-state";
        emptyState.textContent = "Nenhum usuário encontrado.";
        table.append(emptyState);
        return;
    }
    users.forEach((user) => {
        const row = document.createElement("div");
        row.className = "data-row";
        const name = document.createElement("strong");
        name.textContent = user.name;
        row.append(name);
        [user.email, user.number ?? "Não informado", String(user.id)].forEach((value) => {
            const cell = document.createElement("span");
            cell.textContent = value;
            row.append(cell);
        });
        table.append(row);
    });
}
