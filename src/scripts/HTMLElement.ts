import HTMLParser from './HTMLParser'
import { tagText } from './info/tagText'

export class HTMLElement {
  private static createTableTag() {
    return this.create('table', ['details__table', 'table'])
  }

  private static createTheadTag() {
    return this.create('thead', ['table__thead'])
  }

  private static createTbodyTag() {
    return this.create('tbody', ['table__tbody'])
  }

  private static createTrTag() {
    return this.create('tr', ['table__row'])
  }

  private static createThTag(text = '') {
    return this.create('th', ['table__column'], text)
  }

  private static createTdTag(text: string | Node = '') {
    return this.create('td', ['table__column'], text)
  }

  private static createATag(text: string, href: string) {
    const a = this.create('a', ['table__link'], text)
    a.setAttribute('href', href)
    return a
  }

  public static create(
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
    const summary = HTMLElement.create('summary', [
      'details__summary',
      'summary',
      'summary-good',
    ])
    const pSchool = HTMLElement.create('p', ['summary__school'], school)
    const pFindex = HTMLElement.create('p', ['summary__findex'])

    if (!options.aFindexFile) {
      const span = HTMLElement.create('span', ['summary__info'])
      span.textContent = `${tagText.findexFile.notFound}: ${tagText.findexFile.name}`
      pFindex.append(span)
      summary.classList.replace('summary-good', 'summary-bad')
    } else {
      const aFindexFilePathname = HTMLParser.selectPathname(
        options.aFindexFile.href,
      )
      const span = HTMLElement.create('span', ['summary__info'])
      const a = HTMLElement.createATag(
        `${options.schoolOrigin}${aFindexFilePathname}`,
        `${options.schoolOrigin}${aFindexFilePathname}`,
      )

      span.textContent = `${tagText.findexFile.found}: `
      span.append(a)
      pFindex.append(span)
    }

    if (!options.aNowDate) {
      const span = HTMLElement.create('span', ['summary__info'])
      span.textContent = `${tagText.errors.notDateOnToday} ${options.nowDateString}`
      pFindex.append(span)
      summary.classList.replace('summary-good', 'summary-bad')
    }

    summary.append(pSchool, pFindex)
    return summary
  }
}
