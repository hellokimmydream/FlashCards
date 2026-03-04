import router from '@adonisjs/core/services/router'
import CardsController from '#controllers/cards_controller'
import DecksController from '#controllers/decks_controller'

router.get('/', async ({ response }) => {
  return response.redirect('/decks')
})

router.get('/decks', [DecksController, 'index'])
router.get('/decks/create', [DecksController, 'create'])
router.post('/decks', [DecksController, 'store'])
router.get('/decks/:id', [DecksController, 'show'])
router.get('/decks/:id/edit', [DecksController, 'edit'])
router.post('/decks/:id', [DecksController, 'update'])
router.post('/decks/:id/delete', [DecksController, 'destroy'])

router.get('/decks/:deckId/cards/create', [CardsController, 'create'])
router.post('/decks/:deckId/cards', [CardsController, 'store'])
router.get('/cards/:id', [CardsController, 'show'])
router.get('/cards/:id/edit', [CardsController, 'edit'])
router.post('/cards/:id', [CardsController, 'update'])
router.post('/cards/:id/delete', [CardsController, 'destroy'])
