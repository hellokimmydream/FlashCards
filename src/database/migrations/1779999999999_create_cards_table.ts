import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'cards'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table

        .integer('deck_id')

        .unsigned()

        .notNullable()

        .references('id')

        .inTable('decks')

        .onDelete('CASCADE')

      table.text('question').notNullable()

      table.text('answer').notNullable()

      table.timestamp('created_at')

      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
