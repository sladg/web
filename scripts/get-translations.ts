import Airtable from 'airtable'
import Record from 'airtable/lib/record'
import { set as lodashSet } from 'lodash'
import { writeFileSync } from 'fs'
import dotenv from 'dotenv'

dotenv.config()

enum AirTableColumn {
  Czech = 'cz',
  English = 'en',
  Key = 'id',
}
interface AirtableStructure {
  [AirTableColumn.Key]: string
  [AirTableColumn.Czech]: string
  [AirTableColumn.English]: string
}

type MappedTranslations = { lang: string; key: string; translation: string }

const base = new Airtable({
  apiKey: process.env.AIRTABLE_TRANSLATION_KEY,
}).base(process.env.AIRTABLE_TRANSLATION_BASE)

const getAirtableRecords = async () =>
  base('Translations').select({ view: 'Grid view' }).all()

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
const writeFilesForLanguages = (data) =>
  Object.entries(data).forEach(([language, values]) =>
    writeFileSync(`./locale/${language}.json`, JSON.stringify(values), 'utf8')
  )

const run = async () => {
  try {
    const results = await getAirtableRecords()
    const translationArray = getPlainObjectFromRecord(results)
    const groupedTranslations = splitByLanguages(translationArray)
    const nestedTranslations = createNestedTranslations(groupedTranslations)

    writeFilesForLanguages(nestedTranslations)
  } catch (e) {
    console.error(e)
    throw new Error('Error has occured.')
  }
}

run()
