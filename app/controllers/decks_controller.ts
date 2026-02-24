import type { HttpContext } from '@adonisjs/core/http'
import Deck from '#models/deck'

export default class DecksController {
  async index({ auth, view }: HttpContext) {
    const user = auth.getUserOrFail()
    const decks = await Deck.query().where('userId', user.id).orderBy('id', 'desc')
    return view.render('pages/decks/index', { decks })
  }

  async create({ view }: HttpContext) {
    return view.render('pages/decks/create')
  }

  async store({ request, auth, response, session }: HttpContext) {
    const user = auth.getUserOrFail()
    const title = request.input('title')
    const description = request.input('description')

    if (!title) {
      session.flash('Erreur', 'Titre obligatoire')
      return response.redirect().back()
    }

    await Deck.create({ title, description, userId: user.id })
    session.flash('Réussite', 'Deck créé')
    return response.redirect('/decks')
  }

  async edit({ params, auth, view, response, session }: HttpContext) {
    const user = auth.getUserOrFail()
    const deck = await Deck.query().where('id', params.id).where('userId', user.id).first()

    if (!deck) {
      session.flash('Erreur', 'Deck introuvable')
      return response.redirect('/decks')
    }

    return view.render('pages/decks/edit', { deck })
  }

  async update({ params, request, auth, response, session }: HttpContext) {
    const user = auth.getUserOrFail()
    const deck = await Deck.query().where('id', params.id).where('userId', user.id).first()

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

  async destroy({ params, auth, response, session }: HttpContext) {
    const user = auth.getUserOrFail()
    const deck = await Deck.query().where('id', params.id).where('userId', user.id).first()

    if (!deck) {
      session.flash('Erreur', 'Deck introuvable')
      return response.redirect('/decks')
    }

    await deck.delete()
    session.flash('Réussite', 'Deck supprimé')
    return response.redirect('/decks')
  }
}