const formLogin = document.getElementById('login')

formLogin?.addEventListener('submit', async (event) => {
  event.preventDefault()

  // @ts-ignore
  const formDataEncoded = new URLSearchParams(new FormData(formLogin))

  const response = await fetch('/api/sessions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    // @ts-ignore
    body: formDataEncoded 
  })

  const res = await fetch('/api/users/current')
    if (res.status !== 200) {
      alert('necesitas loguearte para ver esta info!')
      Swal.fire({
        title: "Fallo de inicio",
        icon: "error",
        color: "write",
        text: "Ingresar usuario y contraseña!"
      });
      return (window.location.href = '/login')
    }

    const result = await res.json()
    const usuario = result.payload
    
    const rol= usuario.rol

    if(rol == "admin"){
      window.location.href = '/addProducts'
    }else{
      window.location.href = '/productos'
    }
  
});

document.getElementById('btnRegister').addEventListener('click', newCarrito)
function newCarrito(e) {
    fetch('http://localhost:8080/api/carts', {
        method: 'POST'
    })
        .then(resp => resp.json())
        .then(data => {
            const newID = data._id
            console.log(newID)
            localStorage.setItem('carrito', JSON.stringify(newID))
            window.location = '/register'
        })
  
  }