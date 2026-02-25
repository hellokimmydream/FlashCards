import { defineConfig } from '@adonisjs/lucid'

export default defineConfig({
  connection: Env.get('DB_CONNECTION', 'sqlite'),

  connections: {
    sqlite: {
      client: 'sqlite3',
      connection: {
        filename: Env.get('SQLITE_DB_PATH', './database.sqlite'),
      },
      useNullAsDefault: true,
      healthCheck: true,
    },
  },
})
