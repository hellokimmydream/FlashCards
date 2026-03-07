import type { HttpContext } from '@adonisjs/core/http'
import Deck from '#models/deck'

export default class DecksController {
  // Affiche tous les decks
  async index({ view }: HttpContext) {
    const decks = await Deck.query().orderBy('id', 'desc')
    return view.render('pages/decks/index', { decks })
  }

  // Affiche le formulaire de création
  async create({ view }: HttpContext) {
    return view.render('pages/decks/create')
  }

  // Enregistre un nouveau deck
  async store({ request, response, session }: HttpContext) {
    const title = request.input('title')
    const description = request.input('description')

    if (!title) {
      session.flash('Erreur', 'Titre obligatoire')
      return response.redirect().back()
    }

    await Deck.create({ title, description })
    session.flash('Réussite', 'Deck créé')
    return response.redirect('/decks')
  }

  // Affiche le formulaire d’édition
  async edit({ params, view, response, session }: HttpContext) {
    const deck = await Deck.find(params.id)

    if (!deck) {
      session.flash('Erreur', 'Deck introuvable')
      return response.redirect('/decks')
    }

    return view.render('pages/decks/edit', { deck })
  }

  // Met à jour un deck existant
  async update({ params, request, response, session }: HttpContext) {
    const deck = await Deck.find(params.id)

    if (!deck) {
      session.flash('Erreur', 'Deck introuvable')
      return response.redirect('/decks')
    }

    const title = request.input('title')
    const description = request.input('description')

    if (!title) {
      session.flash('Erreur', 'Titre obligatoire')
      return response.redirect().back()
    }

    deck.title = title
    deck.description = description
    await deck.save()

    session.flash('Réussite', 'Deck modifié')
    return response.redirect('/decks')
  }

  // Supprime un deck
  async destroy({ params, response, session }: HttpContext) {
    const deck = await Deck.find(params.id)

    if (!deck) {
      session.flash('Erreur', 'Deck introuvable')
      return response.redirect('/decks')
    }

    await deck.delete()
    session.flash('Réussite', 'Deck supprimé')
    return response.redirect('/decks')
  }

  // Affiche la page d’apprentissage d’un deck
  async learn({ params, view, response, session }: HttpContext) {
    const deck = await Deck.find(params.id)

    if (!deck) {
      session.flash('Erreur', 'Deck introuvable')
      return response.redirect('/decks')
    }

    return view.render('pages/decks/learn', { deck })
  }
}
