'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TokensSchema extends Schema {
  up () {
    this.create('tokens', (table) => {
      table.bigIncrements()
      table.uuid('user_id').references('id').inTable('users').onDelete('Cascade')
      table.string('token', 255).notNullable().unique().index()
      table.string('type', 80).notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('tokens')
  }
}

module.exports = TokensSchema
