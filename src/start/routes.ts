import router from '@adonisjs/core/services/router'
import AuthController from '#controllers/cards_controller'
import DecksController from '#controllers/decks_controller'

// Accueil -> redirige vers la liste des decks

router.get('/', async ({ response }) => {
  return response.redirect('/decks')
})

// decks crud

router.get('/decks', [DecksController, 'index'])

router.get('/decks/create', [DecksController, 'create'])

router.post('/decks', [DecksController, 'store'])

router.get('/decks/:id', [DecksController, 'show']) // showdeck

router.get('/decks/:id/edit', [DecksController, 'edit'])

router.post('/decks/:id', [DecksController, 'update'])

router.post('/decks/:id/delete', [DecksController, 'destroy'])

// cards crud dans un deck

router.get('/decks/:deckId/cards/create', [CardsController, 'create'])

router.post('/decks/:deckId/cards', [CardsController, 'store'])

router.get('/cards/:id', [CardsController, 'show']) // showcard (flip simple)

router.get('/cards/:id/edit', [CardsController, 'edit'])

router.post('/cards/:id', [CardsController, 'update'])

router.post('/cards/:id/delete', [CardsController, 'destroy'])
