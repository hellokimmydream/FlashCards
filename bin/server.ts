/*
|--------------------------------------------------------------------------
| HTTP server entrypoint
|--------------------------------------------------------------------------
|
| The "server.ts" file is the entrypoint for starting the AdonisJS HTTP
| server. Either you can run this file directly or use the "serve"
| command to run this file and monitor file changes
|
*/

import 'reflect-metadata'
import { Ignitor, prettyPrintError } from '@adonisjs/core'

/**
 * URL to the application root. AdonisJS needs it to resolve
 * paths to files and directories for scaffolding commands
 */
const APP_ROOT = new URL('../', import.meta.url)

/**
 * The importer is used to import files in context of the
 * application.
 */
const IMPORTER = (filePath: string) => {
  if (filePath.startsWith('./') || filePath.startsWith('../')) {
    return import(new URL(filePath, APP_ROOT).href)
  }
  return import(filePath)
}

/** start adonis serv*/
new Ignitor(APP_ROOT, { importer: IMPORTER })
  .tap((app) => {
    // Booting pour charger l'environnement
    app.booting(async () => {
      await import('#start/env')
    })

    // Après que tout est booté, on peut utiliser les modèles
    app.booted(async () => {
      // Import dynamique pour s'assurer que Lucid est initialisé
      const { default: Deck } = await import('#models/deck')
      // const { default: Card } = await import('#models/card')

      // Ex: afficher tous les decks dans la console
      try {
        const decks = await Deck.query().orderBy('id', 'desc')
        console.log('Decks existants :', decks)
      } catch (err) {
        console.error('Erreur lors de la récupération des decks :', err)
      }

      // Ex: supprimer toutes les cartes
      // await Card.query().delete()
      // console.log('Toutes les cartes supprimées')
    })

    // Gestion des signaux pour arrêter proprement le serveur
    app.listen('SIGTERM', () => app.terminate())
    app.listenIf(app.managedByPm2, 'SIGINT', () => app.terminate())
  })
  .httpServer()
  .start()
  .catch((error) => {
    process.exitCode = 1
    prettyPrintError(error)
  })
