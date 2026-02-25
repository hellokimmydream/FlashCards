import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Deck from './deck.js'

export default class Card extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare question: string

  @column()
  declare reponse: string

  @column()
  declare deckId: number

  @belongsTo(() => Deck)
  declare deck: BelongsTo<typeof Deck>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
}
