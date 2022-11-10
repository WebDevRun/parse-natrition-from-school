import DataFromServer from './utils/dataFormServer'
import { HTMLElement } from './HTMLWorker/HTMLElement'
import HTMLParser from './HTMLWorker/HTMLParser'
import DateWorker from './utils/dateWorker'
import { schools } from './info/schools'
import { tagText } from './info/tagText'

async function createHTML() {
  const wrapper = <HTMLDivElement>document.querySelector('#wrapper')
  const header = HTMLElement.createHeader()
  const mainLoader = HTMLElement.createMain({ loader: true })
  const footer = HTMLElement.createFooter()
  const loader = HTMLElement.createDivLoader()

  mainLoader.append(loader)
  wrapper.append(header, mainLoader, footer)

  const mainContent = HTMLElement.createMain({ loader: false })
  const resultsData = await DataFromServer.getResults(schools)

  for (const resultData of resultsData) {
    if (resultData.body instanceof Error) {
      const errorMessageTag = HTMLElement.createP(
        `${tagText.errors.notLinked} ${resultData.school}: ${resultData.url}`,
      )
      mainContent.append(errorMessageTag)
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

    const details = HTMLElement.createDetails()
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
    mainContent.append(details)
  }

  mainLoader.replaceWith(mainContent)
}

createHTML()
