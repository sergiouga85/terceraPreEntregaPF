async function sendMessage() {

  
    const res = await fetch('http://localhost:8080/api/sessions/current',
    {
      method:'GET'
    })
    if (res.status !== 200) {
      alert('necesitas loguearte para ver esta info!')
      return (window.location.href = '/login')
    }
  
    const result = await res.json()
    const usuario = result.payload
    const user=usuario.username
    console.log(user)

  var messageInput = document.getElementById('message-input');
  var messageText = messageInput.value;

  // Verificar si el mensaje está vacío
  if (messageText.trim() === '') {
      return;
  }

  // Realizar una solicitud de fetch para agregar el mensaje
  try {
    const response = await fetch('http://localhost:8080/api/chat/mensaje', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user:user, message: messageText }),
    });

    if (response.ok) {
        // El mensaje se ha enviado correctamente
        console.log('Mensaje enviado con éxito');
        Swal.fire({
          title: "Mensaje enviado!",
          icon: "success",
          color: "write",
      });
    } else {
        console.error('Error al enviar el mensaje:', response.status);
    }
  } catch (error) {
    console.error('Error en la solicitud:', error);
  }

  // Agregar el mensaje al área de chat localmente
  var chatBox = document.getElementById('chat-box');
  var messageElement = document.createElement('div');
  messageElement.className = 'alert alert-primary';
  messageElement.innerHTML = '<strong>Tú:</strong> ' + messageText;

  chatBox.appendChild(messageElement);
  messageInput.value = '';
  chatBox.scrollTop = chatBox.scrollHeight; // Desplazar automáticamente hacia abajo para ver el último mensaje
}





const buttonLogout = document.getElementById('logout')
buttonLogout?.addEventListener('click', async event => {
  event.preventDefault()

  // @ts-ignore
  //const formDataEncoded = new URLSearchParams(new FormData(formLogin))

  try {
    const res = await fetch(
      '/api/sessions/current',
      {
        method: 'DELETE',
      },
    )

    // Verificar si la solicitud fue exitosa (código de respuesta 2xx)
    if (res.ok) {
      // Redirigir a la nueva página
      window.location.href = '/login'
    } else {
      // Manejar otros casos si es necesario
      console.log('La solicitud no fue exitosa. Código de respuesta:', res.status)
    }

  } catch (err) {
    console.log(err.message)
  }
})