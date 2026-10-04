const messagesEl = document.querySelector("#messages");
const composer = document.querySelector("#composer");
const input = document.querySelector("#message");

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  }[char]));
}

function render(messages) {
  messagesEl.innerHTML = messages.map(message => {
    const time = new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    return `
      <article class="bubble ${message.direction}">
        <div>${escapeHtml(message.body)}</div>
        <div class="meta">${time} · ${message.status}</div>
      </article>
    `;
  }).join("");
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

async function loadMessages() {
  const response = await fetch("/api/messages");
  render(await response.json());
}

composer.addEventListener("submit", async event => {
  event.preventDefault();
  const body = input.value.trim();
  if (!body) return;

  const button = composer.querySelector("button");
  button.disabled = true;

  try {
    const response = await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        phone: document.querySelector("#phone").value,
        body
      })
    });

    if (!response.ok) throw new Error("Message could not be queued.");
    input.value = "";
    await loadMessages();
  } catch (error) {
    alert(error.message);
  } finally {
    button.disabled = false;
    input.focus();
  }
});

loadMessages();
