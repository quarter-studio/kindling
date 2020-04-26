module.exports = {
  default: env('DATABASE_SERVICE', 'firestore'),

  services: {
    firestore: {
      driver: 'firestore',
      project: 'project-id',
    },

    alt: {
      driver: 'firestore',
      project: 'project-alt',
    },
  },
}
