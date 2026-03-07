import Route from '@adonisjs/core/services/router'
import DecksController from '#controllers/decks_controller'
import CardsController from '#controllers/cards_controller'

// Accueil qui va vers la liste des decks
Route.get('/', async ({ response }) => response.redirect('/decks'))

// decks crud
Route.get('/decks', [DecksController, 'index'])
Route.get('/decks/create', [DecksController, 'create'])
Route.post('/decks', [DecksController, 'store'])
Route.get('/decks/:id/edit', [DecksController, 'edit'])
Route.post('/decks/:id/update', [DecksController, 'update'])
Route.post('/decks/:id/delete', [DecksController, 'destroy'])

// cards crud
Route.get('/decks/:deckId/cards/create', [CardsController, 'create'])
Route.post('/decks/:deckId/cards', [CardsController, 'store'])
Route.get('/cards/:id/edit', [CardsController, 'edit'])
Route.post('/cards/:id/update', [CardsController, 'update'])
Route.post('/cards/:id/delete', [CardsController, 'destroy'])
Route.get('/decks/:deckId/learn', [CardsController, 'learn'])
