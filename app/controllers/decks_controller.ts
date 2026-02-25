import type { HttpContext } from '@adonisjs/core/http'
import Deck from '#models/deck'

// correction de await dans fuction
// auth.getUserOrFail() fait une opération asynchrone
//await attend la fin de cette opération et donne directement le résultat.
// Sans await récupères qu’une promesse pas l’utilisateur lui-même.
// await rend le code plus lisible

export default class DecksController {
  async index({ auth, view }: HttpContext) {
    const user = await auth.getUserOrFail()
    const decks = await Deck.query().where('userId', user.id).orderBy('id', 'desc')
    return view.render('pages/decks/index', { decks })
  }

  async create({ view }: HttpContext) {
    return view.render('pages/decks/create')
  }

  async store({ request, auth, response, session }: HttpContext) {
    const user = await auth.getUserOrFail()
    const title = await request.input('title')
    const description = await request.input('description')

    if (!title) {
      session.flash('Erreur', 'Titre obligatoire')
      return response.redirect().back()
    }

    await Deck.create({ title, description, userId: user.id })
    session.flash('Réussite', 'Deck créé')
    return response.redirect('/decks')
  }

  async edit({ params, auth, view, response, session }: HttpContext) {
    const user = await auth.getUserOrFail()
    const deck = await Deck.query().where('id', params.id).where('userId', user.id).first()

    if (!deck) {
      session.flash('Erreur', 'Deck introuvable')
      return response.redirect('/decks')
    }

    return view.render('pages/decks/edit', { deck })
  }

  async update({ params, request, auth, response, session }: HttpContext) {
    const user = await auth.getUserOrFail()
    const deck = await Deck.query().where('id', params.id).where('userId', user.id).first()

    if (!deck) {
      session.flash('Erreur', 'Deck introuvable')
      return response.redirect('/decks')
    }

    const title = await request.input('title')
    const description = await request.input('description')

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
    const user = await auth.getUserOrFail()
    const deck = await Deck.query().where('id', params.id).where('userId', user.id).first()

    if (!deck) {
      session.flash('Erreur', 'Deck introuvable')
      return response.redirect('/decks')
    }

    await deck.delete()
    session.flash('Réussite', 'Deck supprimé')
    return response.redirect('/decks')
  }

  async learn({ params, auth, view, response, session }: HttpContext) {
    const user = await auth.getUserOrFail()

    const deck = await Deck.query().where('id', params.id).where('userId', user.id).first()

    if (!deck) {
      session.flash('erreur', 'Deck introuvable')

      return response.redirect('/decks')
    }

    return view.render('pages/decks/learn', { deck })
  }
}
