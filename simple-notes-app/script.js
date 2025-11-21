// script.js

// Since index.html and api.php are in the same folder, we can use a relative URL
const API_URL = "api.php";

let isEditing = false;

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("note-form");
    const messageEl = document.getElementById("message");
    const cancelEditBtn = document.getElementById("cancel-edit-btn");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const id = document.getElementById("note-id").value;
        const title = document.getElementById("title").value.trim();
        const body = document.getElementById("body").value.trim();

        if (!title) {
            showMessage("Title is required.", "red");
            return;
        }

        const formData = new FormData();
        formData.append("title", title);
        formData.append("body", body);

        let action = "add";
        if (isEditing && id) {
            action = "update";
            formData.append("id", id);
        }

        try {
            const res = await fetch(`${API_URL}?action=${action}`, {
                method: "POST",
                body: formData,
            });

            const data = await res.json();

            if (data.success) {
                showMessage(
                    isEditing ? "Note updated successfully!" : "Note added successfully!",
                    "green"
                );
                resetForm();
                loadNotes(); // reload notes
            } else {
                showMessage(data.error || "Something went wrong", "red");
            }
        } catch (err) {
            console.error(err);
            showMessage("Error connecting to server", "red");
        }
    });

    cancelEditBtn.addEventListener("click", () => {
        resetForm();
        showMessage("Edit cancelled.", "black");
    });

    // Load notes on page load
    loadNotes();
});

function showMessage(text, color) {
    const messageEl = document.getElementById("message");
    messageEl.textContent = text;
    messageEl.style.color = color;
}

function resetForm() {
    const form = document.getElementById("note-form");
    form.reset();
    document.getElementById("note-id").value = "";
    isEditing = false;
    document.getElementById("submit-btn").textContent = "Add Note";
    document.getElementById("cancel-edit-btn").classList.add("hidden");
}

async function loadNotes() {
    const notesList = document.getElementById("notes-list");
    notesList.textContent = "Loading notes...";

    try {
        const res = await fetch(`${API_URL}?action=list`);
        const notes = await res.json();

        if (!Array.isArray(notes)) {
            notesList.textContent = "Failed to load notes.";
            return;
        }

        if (notes.length === 0) {
            notesList.textContent = "No notes yet. Add one above!";
            return;
        }

        notesList.innerHTML = "";

        notes.forEach((note) => {
            const card = document.createElement("div");
            card.className = "note-card";

            const header = document.createElement("div");
            header.className = "note-header";

            const titleEl = document.createElement("span");
            titleEl.className = "note-title";
            titleEl.textContent = note.title;

            const dateEl = document.createElement("span");
            dateEl.className = "note-date";
            dateEl.textContent = formatDate(note.created_at);

            header.appendChild(titleEl);
            header.appendChild(dateEl);

            const bodyEl = document.createElement("div");
            bodyEl.className = "note-body";
            bodyEl.textContent = note.body || "";

            const actions = document.createElement("div");
            actions.className = "note-actions";

            const editBtn = document.createElement("button");
            editBtn.textContent = "Edit";
            editBtn.addEventListener("click", () => startEdit(note));

            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "Delete";
            deleteBtn.addEventListener("click", () => deleteNote(note.id));

            actions.appendChild(editBtn);
            actions.appendChild(deleteBtn);

            card.appendChild(header);
            card.appendChild(bodyEl);
            card.appendChild(actions);

            notesList.appendChild(card);
        });
    } catch (err) {
        console.error(err);
        notesList.textContent = "Error loading notes.";
    }
}

function formatDate(dateString) {
    if (!dateString) return "";
    const d = new Date(dateString);
    if (isNaN(d.getTime())) {
        return dateString;
    }
    return d.toLocaleString();
}

function startEdit(note) {
    isEditing = true;
    document.getElementById("note-id").value = note.id;
    document.getElementById("title").value = note.title;
    document.getElementById("body").value = note.body || "";
    document.getElementById("submit-btn").textContent = "Update Note";
    document.getElementById("cancel-edit-btn").classList.remove("hidden");
    showMessage(`Editing note #${note.id}`, "black");
}

async function deleteNote(id) {
    if (!confirm("Are you sure you want to delete this note?")) return;

    const formData = new FormData();
    formData.append("id", id);

    try {
        const res = await fetch(`${API_URL}?action=delete`, {
            method: "POST",
            body: formData,
        });

        const data = await res.json();

        if (data.success) {
            showMessage("Note deleted successfully.", "green");
            loadNotes();
        } else {
            showMessage(data.error || "Failed to delete note.", "red");
        }
    } catch (err) {
        console.error(err);
        showMessage("Error connecting to server", "red");
    }
}
