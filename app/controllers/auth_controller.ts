import type { HttpContext } from '@adonisjs/core/http'
import hash from '@adonisjs/core/services/hash'
import User from '#models/user'

export default class AuthController {
  async showRegister({ view }: HttpContext) {
    return view.render('pages/auth/register')
  }

  async register({ request, response, session }: HttpContext) {
    const email = String(request.input('email') ?? '').trim().toLowerCase()
    const password = String(request.input('password') ?? '')
    const fullName = String(request.input('fullName') ?? '').trim() || null

    if (!email || !password) {
      session.flash('error', 'Email et mot de passe obligatoires')
      return response.redirect().back()
    }

    // validation simple
    if (!email.includes('@')) {
      session.flash('error', 'Email invalide')
      return response.redirect().back()
    }

    if (password.length < 8) {
      session.flash('error', 'Mot de passe : minimum 8 caractères')
      return response.redirect().back()
    }

    const existing = await User.query().where('email', email).first()
    if (existing) {
      session.flash('error', 'Un compte existe déjà avec cet email')
      return response.redirect().back()
    }

    await User.create({
      email,
      fullName,
      password: await hash.make(password),
    })

    session.flash('success', 'Compte créé. Vous pouvez vous connecter.')
    return response.redirect('/login')
  }

  async showLogin({ view }: HttpContext) {
    return view.render('pages/auth/login')
  }

  async login({ request, auth, response, session }: HttpContext) {
    const email = String(request.input('email') ?? '').trim().toLowerCase()
    const password = String(request.input('password') ?? '')

    if (!email || !password) {
      session.flash('error', 'Email et mot de passe obligatoires')
      return response.redirect().back()
    }

    try {
      // AuthFinder mixin -> verifyCredentials(email, password)
      const user = await User.verifyCredentials(email, password)
      await auth.use('web').login(user)

      session.flash('success', 'Connecté')
      return response.redirect('/decks')
    } catch {
      session.flash('error', 'Identifiants incorrects')
      return response.redirect().back()
    }
  }

  async logout({ auth, response, session }: HttpContext) {
    await auth.use('web').logout()
    session.flash('success', 'Déconnecté')
    return response.redirect('/login')
  }
}