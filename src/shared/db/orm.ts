import { MikroORM, Options } from '@mikro-orm/core'
import { MySqlDriver } from '@mikro-orm/mysql'
import { SqlHighlighter } from '@mikro-orm/sql-highlighter'

const config: Options<MySqlDriver> = {
  entities: ['dist/**/*.entity.js'],
  entitiesTs: ['src/**/*.entity.ts'],
  dbName: 'gestionTorneos',
  type: 'mysql',
  clientUrl: 'mysql://root:0600@localhost:3306/gestionTorneos',
  highlighter: new SqlHighlighter(),
  debug: true,
  schemaGenerator: {
    disableForeignKeys: true,
    createForeignKeyConstraints: true,
    ignoreSchema: [],
  },
}

export const orm = await MikroORM.init(config)

export const syncSchema = async () => {
  const generator = orm.getSchemaGenerator()
  // await generator.dropSchema()
  // await generator.createSchema()
  await generator.updateSchema()
}
