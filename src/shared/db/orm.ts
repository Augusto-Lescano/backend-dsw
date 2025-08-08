import { MikroORM } from "@mikro-orm/mysql"; 
import { SqlHighlighter } from "@mikro-orm/sql-highlighter"; 

 

export const orm = await MikroORM.init({ 

    entities: ['dist/**/*.entity.js'], 

    entitiesTs: ['src/**/*.entity.ts'], 

    dbName: 'gestionTorneos', 

    type: 'mysql', 

    clientUrl: 'mysql://root:0600@localhost:3306/gestionTorneos', 

    highlighter: new SqlHighlighter(), 

    debug: true, 

    schemaGenerator:{ 

        disableForeignKeys: true, 

        createForeignKeyConstraints: true, 

        ignoreSchema:[], 

    }, 

}) 

 

export const syncSchema = async () => {
    const generator = orm.getSchemaGenerator() 

 

  //await generator.dropSchema() 

  //await generator.createSchema() 

 

  await generator.updateSchema() 

} 