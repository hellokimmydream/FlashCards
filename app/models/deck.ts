import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'

import type { HasMany } from '@adonisjs/lucid/types/relations'

import Card from '#models/card'

export default class Deck extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  @column()
  declare title: string

  @column()
  declare description: string | null

  //@column.dateTime({ autoCreate: true })
  //declare createdAt: DateTime

  // @column.dateTime({ autoCreate: true, autoUpdate: true })
  // declare updatedAt: DateTime | null
  @hasMany(() => Card)
  declare cards: HasMany<typeof Card>

  //@belongsTo(() => User)
  //declare user: BelongsTo<typeof User>
}
