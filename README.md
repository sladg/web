![cesko.digital](cesko-digital_logo.png)

# Web Česko.Digital

## 🚀 Setup projektu

1.  **Požadavky**

    Projekt vyžaduje Node v12+ a Yarn v1.22+.

1.  **Repozitář**

    Naklonujte si repozitář do složky `cesko-digital-web`:

    ```shell script
    git clone https://github.com/cesko-digital/web.git cesko-digital-web
    ```

1.  **Instalace a spuštění**

    Ve složce `cesko-digital-web` nainstalujte požadované závislosti:

    ```shell script
    cd cesko-digital-web
    yarn
    ```

    poté lze spustit vývojový režim:

    ```shell script
    yarn start
    ```

    Na [localhost:8000](http://localhost:8000) by měla běžet lokální verze webu a podporující live reload pro pohodlný vývoj.

## ⌨️ Základní příkazy

`yarn start`: Start vývojového režimu

`yarn lint`: Lint kontrola kódu a formátování

`yarn test`: Spuštění testů

`yarn storybook`: Start dokumentace komponent

`yarn build`: Build produkční verze webu

`yarn serve`: Spuštění produkčního buildu

`yarn format`: Formátování kódu

## 🛠 Jak přispívat

Před zahájením vývoje si prosím projděte soubor [CONTRIBUTING](CONTRIBUTING.md), který obsahuje informace o všech konvencích repozitáře.

## Licence

Zdroje jsou zveřejněny pod [licencí BSD 3-Clause](LICENSE).

## Kontakty

**Koordinátoři:** [Tomáš Jeřábek](https://github.com/tjerabek), [Jindřich Oukropec](https://github.com/miiila)

**Tech leads:** [Matěj 'Horm' Horák](https://github.com/HormCodes), [Míla Votradovec](https://github.com/miiila)

**Wiki:** [Redesign webu Česko.Digital](https://wiki.cesko.digital/pages/viewpage.action?pageId=1574868)

## Translations

Překlady jsou realizovány pomocí `gatsby-plugin-react-i18next` ve spojení se Airtable. Airtable umožnuje vytvářet tabulky a databáze, ze kterých jsou překlady staženy pomocí skriptu `yarn translations:get`. Tento skript spustí `scripts/get-translations.ts`. V rámci tohoto skriptu je vytvořeno připojení do Airtable, staženy záznamy a vytvořeny JSON soubory ve složce `locale/`.

V rámci aplikace lze tyto překlady použit pomocí `useTranslation` takto:

```
import { useTranslation } from 'gatsby-plugin-react-i18next'
const { t } = useTranslation()
t('translations:key.for.translation')
```

nebo

```
import { useTranslation } from 'gatsby-plugin-react-i18next'
const { t } = useTranslation("translations")
t('key.for.translation')
```

Pro spuštění skriptu a načtení překladů je nutné mít dostupné environment proměné. Jmenovitě:

- AIRTABLE_TRANSLATION_KEY
- AIRTABLE_TRANSLATION_BASE
- AIRTABLE_TRANSLATION_VIEW (defaultně "Grid view")
- AIRTABLE_TRANSLATION_BASE_NAME (defaultně "Translations")

### Přidání jazyka

Pro přidání jazyka je ve službe Airtable definovat nový sloupec, který bude identifikovat překlady pro daný jazyk. Následně v `scripts/get-translations` a `AirTableColumn` je nutné definovat nový klíč. V rámci `AirtableStructure` potom definovat tento klíč jako string. Dále ve funkci `splitByLanguages` je nutné přidat mapování pro tento nový jazyk.

### Přidání překladu

Pro přídání překladu je nutné ve službě Airtable přidat nový záznam s hodnotou `key` a překlady pro dané jazyky. Názvy sloupců pro dané jazyky je možné definovat v `scripts/get-translations` a `AirTableColumn`.
