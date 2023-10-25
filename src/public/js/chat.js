let currentUserEmail = '';
const emailEntryDiv = document.querySelector('.email-entry');
const messagesDiv = document.querySelector('.messages');
const messageFormDiv = document.querySelector('.message-form');
const emailInput = document.getElementById('email');
const startChatBtn = document.getElementById('startChat');
const messageInput = document.getElementById('messageInput');
const sendMessageBtn = document.getElementById('sendMessage');
const messageList = document.getElementById('messageList');

function toggleChat() {
    const chatContainer = document.querySelector('.chat-container');
    const chatButton = document.querySelector('.chat-button');
    
    if (chatContainer.style.display === 'none' || chatContainer.style.display === '') {
        chatContainer.style.display = 'block';
        chatButton.style.display = 'none'; // Oculta el botón del chat
    } else {
        chatContainer.style.display = 'none';
        chatButton.style.display = 'block'; // Muestra el botón del chat
    }
}

function stringToColor(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = '#';
    for (let i = 0; i < 3; i++) {
        const value = (hash >> (i * 8)) & 0xFF;
        color += ('00' + value.toString(16)).substr(-2);
    }
    return color;
}

// Función para iniciar el chat
function startChat() {
    if (emailInput.value) {
        const userEmail = emailInput.value;
        currentUserEmail = userEmail;

        emailEntryDiv.style.display = 'none';
        messagesDiv.style.display = 'block';
        messageFormDiv.style.display = 'block';
        
        initSocket(userEmail);
    } else {
        alert('Por favor, introduce un correo válido.');
    }
}

function initSocket(user) {
    const socket = io();

    socket.emit('new user', user);

    socket.on('new message', function(data) {
        console.log(data);
        displayMessage(data);
    });

    sendMessageBtn.addEventListener('click', function() {
        const messageText = messageInput.value;
        socket.emit('send message', { username: user, message: messageText });
        messageInput.value = '';
    });
}

function alignMessage(username, listItem) {
    if (username === currentUserEmail) {
        listItem.classList.add('message-server');  
    } else {
        listItem.classList.add('message-client'); 
    }
}

function displayMessage(data) {

    const listItem = document.createElement('li');
    listItem.className = 'message-list-item'; 
    
    const cardDiv = document.createElement('div');
    cardDiv.className = 'message-card';

    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';

    const messageIcon = document.createElement('span');
    messageIcon.className = 'material-symbols-outlined message-icon';
    messageIcon.innerHTML = 'face';

    const usernameDiv = document.createElement('div');
    usernameDiv.className = 'message-username';
    usernameDiv.textContent = data.user.split("@")[0];
    contentDiv.appendChild(usernameDiv);

    const messageDiv = document.createElement('div');
    messageDiv.className = 'message-text';
    messageDiv.textContent = data.message;
    contentDiv.appendChild(messageDiv);

    cardDiv.appendChild(messageIcon);
    cardDiv.appendChild(contentDiv);
    messageList.appendChild(cardDiv);

    alignMessage(data.user, listItem);
}

startChatBtn.addEventListener('click', startChat);
