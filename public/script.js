const socket = io();

document.getElementById('chat-form').addEventListener('submit', function(event) {
  event.preventDefault();
  const input = document.getElementById('message-input');
  if (input.value) {
    socket.emit('chat message', input.value);
    input.value = '';
  }
});

socket.on('chat history', function(messages) {
  const messagesContainer = document.getElementById('messages');
  messages.forEach((msg) => {
    const item = document.createElement('div');
    item.textContent = `[${new Date(msg.timestamp).toLocaleTimeString()}] ${msg.text}`;
    messagesContainer.appendChild(item);
  });
  window.scrollTo(0, document.body.scrollHeight);
});

socket.on('chat message', function(msg) {
  const item = document.createElement('div');
  item.textContent = `[${new Date(msg.timestamp).toLocaleTimeString()}] ${msg.text}`;
  document.getElementById('messages').appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
});
