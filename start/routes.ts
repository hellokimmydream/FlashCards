// start/routes.ts
import router from '@adonisjs/core/services/router'
import CardsController from '#controllers/cards_controller'
import DecksController from '#controllers/decks_controller'
import AuthController from '#controllers/auth_controller'

/**
 * Route Home
 * Redirection vers /decks
 */
router
  .get('/', async ({ response }) => {
    return response.redirect('/decks')
  })
  .as('home')

/**
 * routes d'authentification
 * Sans middleware guest() pour simplifier
 */
router.get('/register', 'AuthController.showRegister')
router.post('/register', 'AuthController.register')

router.get('/login', 'AuthController.showLogin')
router.post('/login', 'AuthController.login')

// Déconnexion accessible sans middleware auth() pour simplifier
router.post('/logout', 'AuthController.logout')

/**
 * rouetes CRUD pour les decks et les cartes
 * Sans middleware auth() pour simplifier
 */

// DECKS CRUD
router.get('/decks', 'DecksController.index') // Liste tous les decks
router.get('/decks/create', 'DecksController.create') // Formulaire création deck
router.post('/decks', 'DecksController.store') // Création deck
router.get('/decks/:id/edit', 'DecksController.edit') // Formulaire édition deck
router.post('/decks/:id', 'DecksController.update') // Mise à jour deck
router.post('/decks/:id/delete', 'DecksController.destroy') // Suppression deck
router.get('/decks/:id/learn', 'DecksController.learn') // Révision deck

// CARDS CRUD (cartes dans un deck)
router.get('/decks/:deckId/cards/create', 'CardsController.create') // Formulaire création carte
router.post('/decks/:deckId/cards', 'CardsController.store') // Création carte
router.get('/decks/:deckId/cards/:id/edit', 'CardsController.edit') // Formulaire édition carte
router.post('/decks/:deckId/cards/:id', 'CardsController.update') // Mise à jour carte
router.post('/decks/:deckId/cards/:id/delete', 'CardsController.destroy') // Suppression carte
