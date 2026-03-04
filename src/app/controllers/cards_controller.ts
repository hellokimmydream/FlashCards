import type { HttpContext } from '@adonisjs/core/http'

import Deck from '#models/deck'

import Card from '#models/card'

export default class CardsController {
  async create({ params, view, response, session }: HttpContext) {
    const deck = await Deck.find(params.deckId)

    if (!deck) {
      session.flash('error', 'Deck introuvable')

      return response.redirect('/decks')
    }

    return view.render('pages/cards/create', { deck })
  }

  async store({ params, request, response, session }: HttpContext) {
    const deck = await Deck.find(params.deckId)

    if (!deck) {
      session.flash('error', 'Deck introuvable')

      return response.redirect('/decks')
    }

    const question = String(request.input('question') ?? '').trim()

    const answer = String(request.input('answer') ?? '').trim()

    if (question.length < 3) {
      session.flash('error', 'Question trop courte')

      return response.redirect().back()
    }

    if (!answer) {
      session.flash('error', 'Réponse obligatoire')

      return response.redirect().back()
    }

    await Card.create({ deckId: deck.id, question, answer })

    session.flash('success', 'Carte créée')

    return response.redirect(`/decks/${deck.id}`)
  }

  async show({ params, view, response, session }: HttpContext) {
    const card = await Card.find(params.id)

    if (!card) {
      session.flash('error', 'Carte introuvable')

      return response.redirect('/decks')
    }

    return view.render('pages/cards/show', { card })
  }

  async edit({ params, view, response, session }: HttpContext) {
    const card = await Card.find(params.id)

    if (!card) {
      session.flash('error', 'Carte introuvable')

      return response.redirect('/decks')
    }

    return view.render('pages/cards/edit', { card })
  }

  async update({ params, request, response, session }: HttpContext) {
    const card = await Card.find(params.id)

    if (!card) {
      session.flash('error', 'Carte introuvable')

      return response.redirect('/decks')
    }

    const question = String(request.input('question') ?? '').trim()

    const answer = String(request.input('answer') ?? '').trim()

    if (question.length < 3) {
      session.flash('error', 'Question trop courte')

      return response.redirect().back()
    }

    if (!answer) {
      session.flash('error', 'Réponse obligatoire')

      return response.redirect().back()
    }

    card.question = question

    card.answer = answer

    await card.save()

    session.flash('success', 'Carte modifiée')

    return response.redirect(`/decks/${card.deckId}`)
  }

  async destroy({ params, response, session }: HttpContext) {
    const card = await Card.find(params.id)

    if (!card) {
      session.flash('error', 'Carte introuvable')

      return response.redirect('/decks')
    }

    const deckId = card.deckId

    await card.delete()

    session.flash('success', 'Carte supprimée')

    return response.redirect(`/decks/${deckId}`)
  }
}
