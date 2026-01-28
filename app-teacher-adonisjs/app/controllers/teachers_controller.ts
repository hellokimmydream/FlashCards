import Section from '#models/section'
import Teacher from '#models/teacher'
import { teacherValidator } from '#validators/teacher'
import type { HttpContext } from '@adonisjs/core/http'
//import { dd } from '@adonisjs/core/services/dumper'

export default class TeachersController {
  /**
   * Display a list of resource
   */
  async index({ view }: HttpContext) {
    //
    // Récupérer la liste des enseignants triés par ordre alphabétique sur le nom et le prénom
    const teachers = await Teacher.query().orderBy('lastname', 'asc').orderBy('firstname', 'asc')
    // Pour obtenir des infos sur la variable teachers
    //dd(teachers)
    // Appel de la vue
    return view.render('pages/home', { teachers })
  }

  /**
   * Display form to create a new record
   */
  async create({ view }: HttpContext) {
    // récuparation de SECTION après triage par le nom
    const sections = await Section.query().orderBy('name', 'asc')

    // ici on appel la vue
    return view.render('page/teachers/create', { title: "Ajout d'un enseignant", sections })
  }

  /**
   * Handle form submission for the create action
   */
  // gére la request d un formulaire pour la créatio d un teacher
  async store({ request, session, response }: HttpContext) {
    //valide les donnée de saisie par user
    const { gender, firstname, lastname, nickname, origine, sectionId } =
      await request.validateUsing(teacherValidator)

    // création d un nouveau teacher
    const teacher = await Teacher.create({
      gender,
      firstname,
      lastname,
      nickname,
      origine,
      sectionId,
    })

    // affiche un message a user
    session.flash(
      'success',
      `Le nouvel enseignant ${teacher.lastname}
    ${teacher.firstname} a été ajouté avec succès !`
    )

    // RETOUR SUR LA PAGE HOME
    return response.redirect().toRoute('home')
  }

  /**
   * Afficher les détails d'un enseignant (y compris le nom de sa section)
   */
  async show({ params, view }: HttpContext) {
    // Sélectionner l'enseignant dont on veut afficher les détails
    const teacher = await Teacher.query().where('id', params.id).preload('section').firstOrFail()
    // Afficher la vue
    return view.render('pages/teachers/show.edge', { title: "Détail d'unenseignant", teacher })
  }

  /**
   * Edit individual record
   */
  async edit({ params }: HttpContext) {}

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request }: HttpContext) {}

  /**
   * Supprimer un enseignant
   */
  async destroy({ params, session, response }: HttpContext) {
    // Sélectionne l'enseignant à supprimer
    const teacher = await Teacher.findOrFail(params.id)
    // Supprime l'enseignant
    await teacher.delete()
    // Afficher un message à l'utilisateur
    session.flash(
      'success',
      `L'enseignant ${teacher.lastname} ${teacher.firstname} a été supprimé avec
succès !`
    )
    // Redirige l'utilisateur sur la home
    return response.redirect().toRoute('home')
  }
}
