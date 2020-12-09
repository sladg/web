import { Layout, Section, SectionContent } from 'components/layout'
import { Link } from 'components/links'
import { useTranslation } from 'gatsby-plugin-react-i18next'
import React, { useContext } from 'react'
import { ThemeContext } from 'styled-components'

const IndexPage: React.FC = () => {
  const { t } = useTranslation()
  const theme = useContext(ThemeContext)

  return (
    <Layout>
      <Section>
        <SectionContent>
          <h1>{t('translations:some.value.neco')}</h1>
          <p>{t('translations:homepage.title')}</p>
        </SectionContent>
      </Section>

      <Section backgroundColor={theme.colors.lightViolet}>
        <SectionContent>
          <Link to="/page-2/">Go to page 2</Link>
        </SectionContent>
      </Section>

      <Section>
        <SectionContent>
          <Link to="/mdx-page">Go to MDX page</Link>
        </SectionContent>
      </Section>
    </Layout>
  )
}

export default IndexPage
