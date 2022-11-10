import HTMLParser from './HTMLParser'
import { tagText } from '../info/tagText'
import DateWorker from '../utils/dateWorker'
export class HTMLElement {
  private static createTableTag() {
    return this.createTag('table', ['details__table', 'table'])
  }

  private static createTheadTag() {
    return this.createTag('thead', ['table__thead'])
  }

  private static createTbodyTag() {
    return this.createTag('tbody', ['table__tbody'])
  }

  private static createTrTag() {
    return this.createTag('tr', ['table__row'])
  }

  private static createThTag(text = '') {
    return this.createTag('th', ['table__column'], text)
  }

  private static createTdTag(text: string | Node = '') {
    return this.createTag('td', ['table__column'], text)
  }

  private static createATag(text: string, href: string) {
    const a = this.createTag('a', ['table__link'], text)
    a.setAttribute('href', href)
    return a
  }

  private static createTag(
    tagName: string = 'div',
    classArray: Array<string> = [],
    text: string | Node = '',
  ) {
    const tag = document.createElement(tagName)
    classArray.forEach((classItem) => tag.classList.add(classItem))
    typeof text === 'string' ? (tag.textContent = text) : tag.append(text)
    return tag
  }

  public static createTable(
    header: { name: string; link: string },
    aArray: Array<HTMLAnchorElement>,
    options: { schoolOrigin: string },
  ) {
    const table = this.createTableTag()
    const thead = this.createTheadTag()
    const tbody = this.createTbodyTag()
    const tr = this.createTrTag()
    const thName = this.createThTag(header.name)
    const thLink = this.createThTag(header.link)

    aArray.forEach((a) => {
      const text = a.textContent
      const pathname = HTMLParser.selectPathname(a.href)
      const host = HTMLParser.selectOrigin(options.schoolOrigin)
      const url = `${host}${pathname}`
      const tr = this.createTrTag()
      const tdName = this.createTdTag(text)
      const tdLink = this.createTdTag()
      const aTag = this.createATag(url, url)

      tdLink.append(aTag)
      tr.append(tdName, tdLink)
      tbody.append(tr)
    })

    tr.append(thName, thLink)
    thead.append(tr)
    table.append(thead, tbody)
    return table
  }

  public static createSummary(
    school: string,
    options: {
      schoolOrigin: string
      nowDateString: string
      aFindexFile: HTMLAnchorElement
      aNowDate: HTMLAnchorElement
    },
  ) {
    const summary = HTMLElement.createTag('summary', [
      'details__summary',
      'summary',
      'summary-good',
    ])
    const pSchool = HTMLElement.createTag('p', ['summary__school'], school)
    const pFindex = HTMLElement.createTag('p', ['summary__info'])

    if (!options.aFindexFile) {
      const span = HTMLElement.createTag('span', ['summary__span'])
      span.textContent = `${tagText.findexFile.notFound}: ${tagText.findexFile.name}`
      pFindex.append(span)
      summary.classList.replace('summary-good', 'summary-bad')
    } else {
      const aFindexFilePathname = HTMLParser.selectPathname(
        options.aFindexFile.href,
      )
      const span = HTMLElement.createTag('span', ['summary__span'])
      const a = HTMLElement.createATag(
        `${options.schoolOrigin}${aFindexFilePathname}`,
        `${options.schoolOrigin}${aFindexFilePathname}`,
      )

      span.textContent = `${tagText.findexFile.found}: `
      span.append(a)
      pFindex.append(span)
    }

    if (!options.aNowDate) {
      const span = HTMLElement.createTag('span', ['summary__span'])
      span.textContent = `${tagText.errors.notDateOnToday} ${options.nowDateString}`
      pFindex.append(span)
      summary.classList.replace('summary-good', 'summary-bad')
    }

    summary.append(pSchool, pFindex)
    return summary
  }

  public static createDetails() {
    return HTMLElement.createTag('details', ['main__details', 'details'])
  }

  public static createHeader() {
    const header = HTMLElement.createTag('header', ['header'])
    const h1 = HTMLElement.createTag('h1', ['header__h1'], tagText.headerText)
    header.append(h1)
    return header
  }

  public static createMain(options: { loader: boolean }) {
    const main = HTMLElement.createTag('main', ['main'])
    if (options.loader) main.classList.add('main-loader')
    return main
  }

  public static createFooter() {
    const lifeYears = DateWorker.getYearString()
    return HTMLElement.createTag(
      'footer',
      ['footer'],
      `${tagText.authorName}, ${lifeYears}`,
    )
  }

  public static createP(text = '') {
    return HTMLElement.createTag('p', ['details__error'], text)
  }

  public static createDivLoader() {
    return HTMLElement.createTag('div', ['main__loader'])
  }
}
