import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'

import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'

import Card from '#models/card'
import User from './user.js'

export default class Deck extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare title: string

  @column()
  declare description: string | null

  @column()
  declare userId: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @hasMany(() => Card)
  declare cards: HasMany<typeof Card>

  @belongsTo(() => Deck)
  declare deck: BelongsTo<typeof Deck>

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>
}
