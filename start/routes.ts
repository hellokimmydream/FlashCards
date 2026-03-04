import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
import AuthController from '#controllers/auth_controller'
import DecksController from '#controllers/decks_controller'
import CardsController from '#controllers/cards_controller'

/**
 * home
 * si user est connect on va sur deck
 * sion demmande de login user
 */
router
  .get('/', async ({ response }) => {
    return response.redirect('/decks')
  })
  .as('home')

/** authentification */
router
  .group(() => {
    router.get('/register', [AuthController, 'showRegister'])
    router.post('/register', [AuthController, 'register'])

    router.get('/login', [AuthController, 'showLogin'])
    router.post('/login', [AuthController, 'login'])
  })
  .use(middleware.guest())

router.post('/logout', [AuthController, 'logout']).use(middleware.auth())

/** deck **/
router.group(() => {
  router.get('/decks', [DecksController, 'index'])
  router.get('/decks/create', [DecksController, 'create'])
  router.post('/decks', [DecksController, 'store'])

  router.get('/decks/:id/edit', [DecksController, 'edit'])
  router.post('/decks/:id', [DecksController, 'update'])

  router.post('/decks/:id/delete', [DecksController, 'destroy'])

  // pour réviser cards
  router.get('/decks/:id/learn', [DecksController, 'learn'])

  // cards crud dans un deck

  router.get('/decks/:deckId/cards/create', [CardsController, 'create'])

  router.post('/decks/:deckId/cards', [CardsController, 'store'])

  // showcard retourne la carte
  router.get('/cards/:id', [CardsController, 'show'])

  router.get('/cards/:id/edit', [CardsController, 'edit'])

  router.post('/cards/:id', [CardsController, 'update'])

  router.post('/cards/:id/delete', [CardsController, 'destroy'])
})
