import Airtable from 'airtable'
import Record from 'airtable/lib/record'
import { set as lodashSet } from 'lodash'
import { writeFileSync, existsSync, mkdirSync } from 'fs'
import dotenv from 'dotenv'

dotenv.config()

enum AirTableColumn {
  Key = 'id',
  Czech = 'cs',
  English = 'en',
}
interface AirtableStructure {
  [AirTableColumn.Key]: string
  [AirTableColumn.Czech]: string
  [AirTableColumn.English]: string
}

const config = {
  key: process.env.AIRTABLE_TRANSLATION_KEY,
  base: process.env.AIRTABLE_TRANSLATION_BASE,
  base_name: process.env.AIRTABLE_TRANSLATION_BASE_NAME || 'Translations',
  view: process.env.AIRTABLE_TRANSLATION_VIEW || 'Grid view',
}

if (!config.key || !config.base) {
  throw new Error('Env variables not specified!')
}

type MappedTranslations = { lang: string; key: string; translation: string }

const base = new Airtable({ apiKey: config.key }).base(config.base)

const getAirtableRecords = async () =>
  base(config.base_name).select({ view: config.view }).all()

// Gets plain JS object from Airtable structure.
const getPlainObjectFromRecord = (data: Record[]): AirtableStructure[] =>
  data.map((record) => record._rawJson.fields)

// Maps rows from Airtable to object arrays.
const splitByLanguages = (data: AirtableStructure[]) =>
  data.reduce((acc, row) => {
    return [
      ...acc,
      {
        lang: AirTableColumn.Czech,
        key: row[AirTableColumn.Key],
        translation: row[AirTableColumn.Czech],
      },
      {
        lang: AirTableColumn.English,
        key: row[AirTableColumn.Key],
        translation: row[AirTableColumn.English],
      },
      //   @NOTE: if adding new language, add here
    ]
  }, [] as MappedTranslations[])

// Prefix the nesting with language.
const createNestedTranslations = (data: MappedTranslations[]) =>
  data.reduce(
    (acc, { key, lang, translation }) =>
      lodashSet(acc, `${lang}.${key}`, translation),
    {}
  )

// Write for all files. Language is always top key.
// eslint-disable-next-line @typescript-eslint/ban-types
const writeFilesForLanguages = (data: object) =>
  Object.entries(data).forEach(([language, values]) => {
    const folderName = `./locale/${language}`
    const fileName = `${folderName}/translation.json`

    if (!existsSync(folderName)) {
      mkdirSync(folderName)
    }

    writeFileSync(fileName, JSON.stringify(values), 'utf8')
  })

const run = async () => {
  try {
    const results = await getAirtableRecords()
    const translationArray = getPlainObjectFromRecord(results)
    const groupedTranslations = splitByLanguages(translationArray)
    const nestedTranslations = createNestedTranslations(groupedTranslations)

    writeFilesForLanguages(nestedTranslations)
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e)
    throw new Error('Error has occured.')
  }
}

run()
