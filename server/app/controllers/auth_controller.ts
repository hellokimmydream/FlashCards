import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'

export default class AuthController {
  async showRegister({ view }: HttpContext) {
    return view.render('pages/auth/register')
  }

  async register({ request, response, session }: HttpContext) {
    const username = request.input('username')
    const password = request.input('password')

    if (!username || !password) {
      session.flash('Erreur', 'Username et mot de passe obligatoires')
      return response.redirect().back()
    }

    if (String(password).length < 8) {
      session.flash('Erreur', 'Mot de passe: minimum 8 caractères')
      return response.redirect().back()
    }

    const existing = await User.query().where('username', username).first()
    if (existing) {
      session.flash('Erreur', 'Choisissez un autre username')
      return response.redirect().back()
    }

    await User.create({ username, password })
    session.flash('Creation réussie', 'Compte créé. Vous pouvez à présent vous connecter.')
    return response.redirect('/login')
  }

  async showLogin({ view }: HttpContext) {
    return view.render('pages/auth/login')
  }

  async login({ request, auth, response, session }: HttpContext) {
    const username = request.input('username')
    const password = request.input('password')

    if (!username || !password) {
      session.flash('Erreur', 'Username et mot de passe obligatoires')
      return response.redirect().back()
    }

    try {
      await auth.use('web').attempt(username, password)
      session.flash('success', 'Connecté')
      return response.redirect('/decks')
    } catch {
      session.flash('error', 'Login incorrect')
      return response.redirect().back()
    }
  }

  async logout({ auth, response, session }: HttpContext) {
    await auth.use('web').logout()
    session.flash('success', 'Déconnecté')
    return response.redirect('/login')
  }
}