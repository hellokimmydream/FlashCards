import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
import AuthController from '#controllers/auth_controller'
import DecksController from '#controllers/decks_controller'

router.get('/', async ({ view }) => {
  return view.render('pages/home')
})
// routes pour authentification user
router.get('/register', [AuthController, 'showRegister']).use(middleware.guest())
router.post('/register', [AuthController, 'register']).use(middleware.guest())

router.get('/login', [AuthController, 'showLogin']).use(middleware.guest())
router.post('/login', [AuthController, 'login']).use(middleware.guest())

router.post('/logout', [AuthController, 'logout']).use(middleware.auth())

// route pour decks
router.get('/decks', [DecksController, 'index']).use(middleware.auth())
router.get('/decks/create', [DecksController, 'create']).use(middleware.auth())
router.post('/decks', [DecksController, 'store']).use(middleware.auth())

router.get('/decks/:id/edit', [DecksController, 'edit']).use(middleware.auth())
router.post('/decks/:id', [DecksController, 'update']).use(middleware.auth())

router.post('/decks/:id/delete', [DecksController, 'destroy']).use(middleware.auth())