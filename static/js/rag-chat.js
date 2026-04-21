(function () {
  const RAG_URL = "http://localhost:3001/chat";

  const widget = document.getElementById("rag-chat-widget");
  if (!widget) return;

  const toggle = widget.querySelector(".rag-toggle");
  const panel = widget.querySelector(".rag-panel");
  const form = widget.querySelector(".rag-form");
  const input = widget.querySelector(".rag-input");
  const messages = widget.querySelector(".rag-messages");

  let history = [];
  let open = false;

  toggle.addEventListener("click", () => {
    open = !open;
    panel.classList.toggle("rag-panel--open", open);
    toggle.setAttribute("aria-expanded", open);
    if (open && messages.childElementCount === 0) addBubble("assistant", "Hi! Ask me anything about Andreas.");
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    input.value = "";
    addBubble("user", text);

    const bubble = addBubble("assistant", "");
    const cursor = document.createElement("span");
    cursor.className = "rag-cursor";
    bubble.appendChild(cursor);

    let reply = "";
    try {
      const res = await fetch(RAG_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history }),
      });

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop();
        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const payload = line.slice(6);
          if (payload === "[DONE]") break;
          try {
            const chunk = JSON.parse(payload);
            if (chunk.text) {
              reply += chunk.text;
              bubble.textContent = reply;
              bubble.appendChild(cursor);
              messages.scrollTop = messages.scrollHeight;
            }
            if (chunk.error) bubble.textContent = "Error: " + chunk.error;
          } catch {}
        }
      }
    } catch {
      bubble.textContent = "Could not reach the RAG server. Make sure it is running.";
    }

    cursor.remove();
    if (reply) {
      history.push({ role: "user", content: text });
      history.push({ role: "assistant", content: reply });
      if (history.length > 20) history = history.slice(-20);
    }
    messages.scrollTop = messages.scrollHeight;
  });

  function addBubble(role, text) {
    const div = document.createElement("div");
    div.className = "rag-bubble rag-bubble--" + role;
    div.textContent = text;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
    return div;
  }
})();
