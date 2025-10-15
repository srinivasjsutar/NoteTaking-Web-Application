const API_URL = "http://localhost:8000/api/notes";

export const getNotes = async () => {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error("Failed to fetch notes");
  return response.json();
};

export const addNote = async (note) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(note),
  });
  if (!response.ok) throw new Error("Failed to add note");
  return response.json();
};

export const updateNote = async (id, note) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(note),
  });
  if (!response.ok) throw new Error("Failed to update note");
  return response.json();
};

export async function deleteNote(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete note");
  return response.json();
}
