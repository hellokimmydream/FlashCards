import type { HttpContext } from '@adonisjs/core/http'
import Card from '#models/card'
import Deck from '#models/deck'

export default class CardsController {
  // affiche toutes les cartes de un deck
  async index({ params, view, response, session }: HttpContext) {
    const deck = await Deck.find(params.deckId)
    if (!deck) {
      session.flash('Erreur', 'Deck introuvable')
      return response.redirect('/decks')
    }

    const cards = await Card.query().where('deckId', deck.id).orderBy('id', 'asc')
    return view.render('pages/cards/index', { deck, cards })
  }

  // Affiche le formulaire pour créer une nouvelle carte
  async create({ params, view, response, session }: HttpContext) {
    const deck = await Deck.find(params.deckId)
    if (!deck) {
      session.flash('Erreur', 'Deck introuvable')
      return response.redirect('/decks')
    }

    return view.render('pages/cards/create', { deck })
  }

  // stocke une nouvelle carte
  async store({ params, request, response, session }: HttpContext) {
    const deck = await Deck.find(params.deckId)
    if (!deck) {
      session.flash('Erreur', 'Deck introuvable')
      return response.redirect('/decks')
    }

    const front = request.input('front')
    const back = request.input('back')

    if (!front || !back) {
      session.flash('Erreur', 'Les deux côtés de la carte sont obligatoires')
      return response.redirect().back()
    }

    await Card.create({ deckId: deck.id, front, back })
    session.flash('Réussite', 'Carte créée')
    return response.redirect(`/decks/${deck.id}/cards`)
  }

  // affiche form pour édit une carte
  async edit({ params, view, response, session }: HttpContext) {
    const card = await Card.find(params.id)
    if (!card) {
      session.flash('Erreur', 'Carte introuvable')
      return response.redirect(`/decks/${params.deckId}/cards`)
    }

    const deck = await Deck.find(card.deckId)
    return view.render('pages/cards/edit', { deck, card })
  }

  //met a jour une carte
  async update({ params, request, response, session }: HttpContext) {
    const card = await Card.find(params.id)
    if (!card) {
      session.flash('Erreur', 'Carte introuvable')
      return response.redirect(`/decks/${params.deckId}/cards`)
    }

    const front = request.input('front')
    const back = request.input('back')

    if (!front || !back) {
      session.flash('Erreur', 'Les deux côtés de la carte sont obligatoires')
      return response.redirect().back()
    }

    card.front = front
    card.back = back
    await card.save()

    session.flash('Réussite', 'Carte modifiée')
    return response.redirect(`/decks/${card.deckId}/cards`)
  }

  //supprime une carte
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

  // Page revision montre toutes les cartes d’un deck
  async learn({ params, view, response, session }: HttpContext) {
    const deck = await Deck.find(params.deckId)
    if (!deck) {
      session.flash('Erreur', 'Deck introuvable')
      return response.redirect('/decks')
    }

    const cards = await Card.query().where('deckId', deck.id).orderBy('id', 'asc')
    return view.render('pages/cards/learn', { deck, cards })
  }
}
