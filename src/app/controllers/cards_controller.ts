import type { HttpContext } from '@adonisjs/core/http'
import Card from '#models/card'
import Deck from '#models/deck'

export default class CardsController {
  // Affiche toutes les cartes d’un deck
  async index({ params, view, response, session }: HttpContext) {
    const deck = await Deck.find(params.deckId)
    if (!deck) {
      session.flash('Erreur', 'Deck introuvable')
      return response.redirect('/decks')
    }

    const cards = await Card.query().where('deck_id', deck.id).orderBy('id', 'asc')

    return view.render('pages/cards/index', { deck, cards })
  }

  // Formulaire pour créer une nouvelle carte
  async create({ params, view, response, session }: HttpContext) {
    const deck = await Deck.find(params.deckId)
    if (!deck) {
      session.flash('Erreur', 'Deck introuvable')
      return response.redirect('/decks')
    }

    return view.render('pages/cards/create', { deck })
  }

  // Stocke une nouvelle carte
  async store({ params, request, response, session }: HttpContext) {
    const deck = await Deck.find(params.deckId)
    if (!deck) {
      session.flash('Erreur', 'Deck introuvable')
      return response.redirect('/decks')
    }

    const question = request.input('front')
    const answer = request.input('back')

    if (!question || !answer) {
      session.flash('Erreur', 'Les deux côtés de la carte sont obligatoires')
      return response.redirect().back()
    }

    await Card.create({ deckId: deck.id, question, answer })

    session.flash('Réussite', 'Carte créée')
    return response.redirect(`/decks/${deck.id}/cards`)
  }

  // Formulaire pour éditer une carte
  async edit({ params, view, response, session }: HttpContext) {
    const card = await Card.find(params.id)
    if (!card) {
      session.flash('Erreur', 'Carte introuvable')
      return response.redirect(`/decks/${params.deckId}/cards`)
    }

    const deck = await Deck.find(card.deckId)
    return view.render('pages/cards/edit', { deck, card })
  }

  // Met à jour une carte
  async update({ params, request, response, session }: HttpContext) {
    const card = await Card.find(params.id)
    if (!card) {
      session.flash('Erreur', 'Carte introuvable')
      return response.redirect(`/decks/${params.deckId}/cards`)
    }

    const question = request.input('front')
    const answer = request.input('back')

    if (!question || !answer) {
      session.flash('Erreur', 'Les deux côtés de la carte sont obligatoires')
      return response.redirect().back()
    }

    card.question = question
    card.answer = answer
    await card.save()

    session.flash('Réussite', 'Carte modifiée')
    return response.redirect(`/decks/${card.deckId}/cards`)
  }

  // Supprime une carte
  async destroy({ params, response, session }: HttpContext) {
    const card = await Card.find(params.id)
    if (!card) {
      session.flash('Erreur', 'Carte introuvable')
      return response.redirect(`/decks/${params.deckId}/cards`)
    }

    await card.delete()
    session.flash('Réussite', 'Carte supprimée')
    return response.redirect(`/decks/${card.deckId}/cards`)
  }

  // Page de révision pour un deck
  async learn({ params, view, response, session }: HttpContext) {
    const deck = await Deck.find(params.deckId)
    if (!deck) {
      session.flash('Erreur', 'Deck introuvable')
      return response.redirect('/decks')
    }

    const cards = await Card.query().where('deck_id', deck.id).orderBy('id', 'asc')

    return view.render('pages/cards/learn', { deck, cards })
  }
}
