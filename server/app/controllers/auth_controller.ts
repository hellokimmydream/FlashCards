import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import hash from '@adonisjs/core/services/hash'

export default class AuthController {
  async showRegister({ view }: HttpContext) {
    return view.render('auth/register')
  }

  async register({ request, response, auth, session }: HttpContext) {
    const email = request.input('email')
    const password = request.input('password')

    // validation simple
    if (!email || !password) {
      session.flash('error', 'Email et mot de passe requis')
      return response.redirect().back()
    }

    const existing = await User.query().where('email', email).first()
    if (existing) {
      session.flash('error', 'Cet email est déjà utilisé')
      return response.redirect().back()
    }

    // le model user du starter gere le hash avec hook sinon hash ci-dessous
    const user = await User.create({
      email,
      password,
    })

    // Pour la sécurite si model ne hash pas automatiquement il faut enlever les commentaire en dessous:
    // user.password = await hash.make(password)
    // await user.save()

    await auth.use('web').login(user)
    return response.redirect('/decks')
  }

  async showLogin({ view }: HttpContext) {
    return view.render('auth/login')
  }

  async login({ request, response, auth, session }: HttpContext) {
    const email = request.input('email')
    const password = request.input('password')

    if (!email || !password) {
      session.flash('error', 'Email et mot de passe requis')
      return response.redirect().back()
    }

    try {
      await auth.use('web').attempt(email, password)
      return response.redirect('/decks')
    } catch {
      session.flash('error', 'Identifiants invalides')
      return response.redirect().back()
    }
  }

  async logout({ response, auth }: HttpContext) {
    await auth.use('web').logout()
    return response.redirect('/')
  }
}
