import User from '#models/user'

export default class DefaultUserSeeder {
  async run() {
    const existing = await User.find(1)

    if (existing) return

    // crée user minimal pour la FK de Deck

    await User.create({
      user: 'root',

      password: 'root',
    })
  }
}
