import DataFromServer from './utils/dataFormServer'
import { HTMLElement } from './HTMLElement'
import HTMLParser from './HTMLParser'
import DateWorker from './utils/dateWorker'
import { schools } from './info/schools'
import { tagText } from './info/tagText'

async function createHTML() {
  const wrapper = <HTMLDivElement>document.querySelector('#wrapper')
  const resultsData = await DataFromServer.getResults(schools)
  const header = HTMLElement.create('header', ['header'])
  const h1 = HTMLElement.create('h1', ['header__h1'], tagText.headerText)
  const main = HTMLElement.create('main', ['main'])
  const lifeYears = DateWorker.getYearString()
  const footer = HTMLElement.create(
    'footer',
    ['footer'],
    `${tagText.authorName}, ${lifeYears}`,
  )

  for (const resultData of resultsData) {
    if (resultData.body instanceof Error) {
      const errorMessageTag = HTMLElement.create(
        'p',
        ['details__error'],
        `${tagText.errors.notLinked} ${resultData.school}: ${resultData.url}`,
      )
      main.append(errorMessageTag)
      continue
    }

    const htmlDOM = HTMLParser.createDOM(resultData.body)
    const aList = <NodeListOf<HTMLAnchorElement>>(
      htmlDOM.querySelectorAll('fieldset>div>ul>li>a')
    )

    const { aFindexFile, aArray } = HTMLParser.findFindexFile(
      aList,
      tagText.findexFile.name,
    )

    const details = HTMLElement.create('details', [
      'infoWrapper__details',
      'details',
    ])

    const schoolOrigin = HTMLParser.selectOrigin(resultData.url)
    const nowDateString = DateWorker.getNowDateString()
    const aNowDate = aArray.find((a) => a.textContent.includes(nowDateString))
    const summary = HTMLElement.createSummary(resultData.school, {
      aFindexFile,
      aNowDate,
      schoolOrigin,
      nowDateString,
    })

    const table = HTMLElement.createTable(tagText.table, aArray, {
      schoolOrigin,
    })

    details.append(summary, table)
    main.append(details)
  }

  header.append(h1)
  wrapper.append(header, main, footer)
}

createHTML()
