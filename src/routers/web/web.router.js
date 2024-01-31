import { Router } from 'express'



export const webRouter = Router()

webRouter.get('/', (req, res) => { return res.redirect('/login') })


webRouter.get('/register', (req, res) => {
  res.render('register.handlebars', {
    pageTitle: 'Registro'
  })
})

webRouter.get('/profile', (req, res) => {
  res.render('profile.handlebars', {
    pageTitle: 'Perfil',
    user: req.user,
  })
})

webRouter.get('/profileAdmin', (req, res) => {
  res.render('profile.admin.handlebars', {
    pageTitle: 'Perfil',
    user: req.user,
  })
})

webRouter.get('/login', (req, res) => {
  res.render('login.handlebars', {
    pageTitle: 'Login'
  })
})

webRouter.get('/addProducts', (req, res) => {
  res.render('addProducts.handlebars', {
    pageTitle: 'addProducts'
  })
})

webRouter.get('/productos', (req, res) => {
  res.render('productos.users.handlebars',{ titulo: 'Productos' })
})

webRouter.get('/carritos', (req, res) => {
  res.render('carritos.handlebars',{ titulo: 'carritos' })
})

webRouter.get('/chat', (req, res) => {
  res.render('chat.handlebars',{ titulo: 'chat' })
})

webRouter.get('/carritosActivos', (req, res) => {
  res.render('carritosActivos.handlebars',{ titulo: 'Elegir Carritos' })
})