const userInput = document.querySelector("#userInput")
const sendBtn = document.querySelector("#sendBtn")
const chatBox = document.querySelector("#chatBox")
const clearBtn = document.querySelector("#clearBtn")



const MAX_LENGTH = 300; 
sendBtn.disabled = true;


userInput.addEventListener("input", () => {

  sendBtn.disabled = userInput.value.trim() === "";
});


function sendMessage() {

  const message = userInput.value.trim();

  if (!message) return;

  if (message.length > MAX_LENGTH) {
    alert("Message too long! Max 300 characters.");
    return;
  }

  const time = new Date().toLocaleTimeString();

  
  chatBox.innerHTML += `
    <div class="message user-message">
      ${message}
      <div class="time">${time}</div>
    </div>
  `;

  chatBox.scrollTop = chatBox.scrollHeight;

  userInput.value = "";
  sendBtn.disabled = true;

 
  const loadingDiv = document.createElement("div");
  loadingDiv.className = "message ai-message";
  loadingDiv.innerHTML = "Typing...";
  chatBox.appendChild(loadingDiv);
  chatBox.scrollTop = chatBox.scrollHeight;

  fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": "Bearer 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",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "openai/gpt-4o-mini",
      messages: [{ role: "user", content: message }]
    })
  })
  .then(res => {

    if (!res.ok) {
      throw new Error("API Error");
    }
    return res.json();
  })
  .then(data => {

    loadingDiv.remove(); 

    const aiMessage = data.choices[0].message.content;
    
    const aiTime = new Date().toLocaleTimeString();

    chatBox.innerHTML += `
      <div class="message ai-message">
        ${aiMessage}
        <div class="time">${aiTime}</div>
      </div>
    `;

    chatBox.scrollTop = chatBox.scrollHeight;

  })
  .catch(err => {

    loadingDiv.remove();

    chatBox.innerHTML += `
      <div class="message error-message">
        ⚠️ Something went wrong.
      </div>
    `;

    chatBox.scrollTop = chatBox.scrollHeight;

  });
}


sendBtn.addEventListener("click", sendMessage);


userInput.addEventListener("keypress", function(e) {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});


clearBtn.addEventListener("click", () => {
  chatBox.innerHTML = "";
});




