import type { HttpContext } from '@adonisjs/core/http'

import Deck from '#models/deck'

import Card from '#models/card'

export default class DecksController {
  async index({ view }: HttpContext) {
    const decks = await Deck.query().orderBy('id', 'desc')

    return view.render('pages/decks/index', { decks })
  }

  async create({ view }: HttpContext) {
    return view.render('pages/decks/create')
  }

  async store({ request, response, session }: HttpContext) {
    const title = String(request.input('title') ?? '').trim()

    const description = String(request.input('description') ?? '').trim() || null

    if (!title) {
      session.flash('error', 'Titre obligatoire')

      return response.redirect().back()
    }

    // Pas d’auth -> on force userId=1 (user “fake” créé via seed)

    await Deck.create({ title, description, userId: 1 })

    session.flash('success', 'Deck créé')

    return response.redirect('/decks')
  }

  async show({ params, view, response, session }: HttpContext) {
    const deck = await Deck.find(params.id)

    if (!deck) {
      session.flash('error', 'Deck introuvable')

      return response.redirect('/decks')
    }

    const cards = await Card.query().where('deckId', deck.id).orderBy('id', 'asc')

    return view.render('pages/decks/show', { deck, cards })
  }

  async edit({ params, view, response, session }: HttpContext) {
    const deck = await Deck.find(params.id)

    if (!deck) {
      session.flash('error', 'Deck introuvable')

      return response.redirect('/decks')
    }

    return view.render('pages/decks/edit', { deck })
  }

  async update({ params, request, response, session }: HttpContext) {
    const deck = await Deck.find(params.id)

    if (!deck) {
      session.flash('error', 'Deck introuvable')

      return response.redirect('/decks')
    }

    const title = String(request.input('title') ?? '').trim()

    const description = String(request.input('description') ?? '').trim() || null

    if (!title) {
      session.flash('error', 'Titre obligatoire')

      return response.redirect().back()
    }

    deck.title = title

    deck.description = description

    await deck.save()

    session.flash('success', 'Deck modifié')

    return response.redirect('/decks')
  }

  async destroy({ params, response, session }: HttpContext) {
    const deck = await Deck.find(params.id)

    if (!deck) {
      session.flash('error', 'Deck introuvable')

      return response.redirect('/decks')
    }

    await deck.delete()

    session.flash('success', 'Deck supprimé')

    return response.redirect('/decks')
  }
}
