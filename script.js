const schools = [
  {
    name: 'МБОУ "Анчулская НОШ"',
    host: 'http://anchulschool.edusite.ru',
    path: '/food/index.html'
  },
  {
    name: 'МБОУ "Малоарбатская СОШ"',
    host: 'https://malarbat.edusite.ru',
    path: '/food/index.html'
  },
  {
    name: 'МБОУ "Большесейская СОШ"',
    host: 'https://bseya-sosh.edusite.ru',
    path: '/food/index.html'
  },
  {
    name: 'МБОУ "Арбатская СОШ"',
    host: 'https://arbatschool.edusite.ru',
    path: '/food/index.html'
  },
  {
    name: 'МБОУ "Бутрахтинская СОШ"',
    host: 'http://school-19-217.edusite.ru',
    path: '/food/index.html'
  },
  {
    name: 'МБОУ "Верх-Таштыпская СОШ"',
    host: 'https://verhtashtip.edusite.ru',
    path: '/food/index.html'
  },
  {
    name: 'МБОУ "Имекская СОШ"',
    host: 'https://school-imek.edusite.ru',
    path: '/food/index.html'
  },
  {
    name: 'МБОУ "Матурская СОШ"',
    host: 'http://school-226.edusite.ru',
    path: '/food/index.html'
  },
  {
    name: 'МБОУ "ТСШ №2"',
    host: 'http://tashtip-skola2.edusite.ru',
    path: '/food/index.html'
  },
  {
    name: 'МБОУ "Таштыпская школа-интернат №1"',
    host: 'http://nashatoshi-1.edusite.ru',
    path: '/food/index.html'
  },
  {
    name: 'МБОУ "Нижнесирская ООШ"',
    host: 'http://school-n-sir.edusite.ru',
    path: '/food/index.html'
  }
]

const attributeNames = {
  fileName: 'Название файла',
  fileLink: 'Ссылка',
  notLinked: 'Нет доступа к сайту:',
  notDataOnToday: 'Нет данных на сегодня'
}

class DataFromServer {
  static async getData (url) {
    try {
      const response = await fetch(url)
      if (response.ok) return await response.text()
      throw new Error(`${response.status}: ${response.statusText}`)
    } catch (error) {
      return new Error(`${attributeNames.notLinked} ${url}`)
    }
  }
}

class HTMLElement {
  static create (tagName = 'div', classArray = [], text = '') {
    const tag = document.createElement(tagName)
    classArray.forEach((classItem) => tag.classList.add(classItem))
    tag.textContent = text
    return tag
  }
}

class Parser {
  static createDOM (str) {
    const parser = new DOMParser()
    const html = parser.parseFromString(str, 'text/html')
    return html
  }

  static selectContent (link) {
    const [name, extension] = link.textContent.split('\n')
    const url = new URL(link.href)

    return {
      textContent: `${name.trim()} ${extension.trim()}`,
      link: url.pathname
    }
  }
}

class CalcValues {
  static nowDateString () {
    const date = new Date()

    const dateObj = {
      year: date.getFullYear(),
      month: date.getMonth() + 1 <= 9 ? `0${date.getMonth() + 1}` : date.getMonth() + 1,
      day: date.getDate() <= 9 ? `0${date.getDate()}` : date.getDate()
    }

    return `${dateObj.year}-${dateObj.month}-${dateObj.day}`
  }

  static hasMenuNowDate (textContent) {
    return textContent.includes(this.nowDateString())
  }
}

window.addEventListener('load', async () => {
  const progressBar = document.querySelector('.header__progressBar')
  const infoWrapper = document.querySelector('.infoWrapper')
  const footer = document.querySelector('.footer')

  progressBar.value = 0

  const footerP = HTMLElement.create(
    'p',
    ['footer__text', 'text'],
    `МКУ "УО Таштыпского района", 2021-${new Date().getFullYear()}`
  )

  footer.appendChild(footerP)

  schools.forEach(async (school) => {
    const htmlStirng = await DataFromServer.getData(
      `${school.host}${school.path}`
    )
    const fragment = document.createDocumentFragment()
    const details = HTMLElement.create('details', ['infoWrapper__details', 'details'])
    const summary = HTMLElement.create('summary', ['details__summary'], school.name)

    if (htmlStirng) progressBar.value++

    if (htmlStirng instanceof Error) {
      const errorMessageTag = HTMLElement.create(
        'p',
        ['details__error'],
        htmlStirng.message
      )

      details.appendChild(summary)
      details.appendChild(errorMessageTag)
      fragment.appendChild(details)
      infoWrapper.appendChild(fragment)
      return
    }

    const htmlDOM = Parser.createDOM(htmlStirng)
    const fieldset = htmlDOM.querySelector('fieldset')
    const menuNodeList = fieldset.querySelectorAll('ul>li>a')
    let hasMenuNowDate = false

    const table = HTMLElement.create('table', ['details__table', 'table'])
    const thead = HTMLElement.create('thead', ['table__thead'])
    const trhead = HTMLElement.create('tr', ['table__row'])
    const thName = HTMLElement.create(
      'th',
      ['table__column'],
      attributeNames.fileName
    )
    const thURL = HTMLElement.create(
      'th',
      ['table__column'],
      attributeNames.fileName
    )
    const tbody = HTMLElement.create('tbody', ['table__tbody'])

    trhead.appendChild(thName)
    trhead.appendChild(thURL)
    thead.appendChild(trhead)
    table.appendChild(thead)

    menuNodeList.forEach((tag) => {
      const { textContent, link } = Parser.selectContent(tag)
      const absoluteLink = `${school.host}${link}`

      if (!hasMenuNowDate) {
        hasMenuNowDate = CalcValues.hasMenuNowDate(textContent)
      }

      const tr = HTMLElement.create('tr', ['table__row'])
      const tdName = HTMLElement.create('td', ['table__column'], textContent)
      const tdLink = HTMLElement.create('td', ['table__column'])
      const tagA = HTMLElement.create('a', ['table__link'], absoluteLink)

      tagA.setAttribute('href', absoluteLink)
      tdLink.appendChild(tagA)
      tr.appendChild(tdName)
      tr.appendChild(tdLink)
      tbody.appendChild(tr)
    })

    if (hasMenuNowDate) {
      summary.classList.add('summary-good')
    } else {
      const spanInfo = HTMLElement.create(
        'span',
        ['spanInfo'],
        `${attributeNames.notDataOnToday} (${CalcValues.nowDateString()})`
      )

      summary.textContent += '. '
      summary.appendChild(spanInfo)
      summary.classList.add('summary-bad')
    }

    table.appendChild(tbody)
    details.appendChild(summary)
    details.appendChild(table)
    fragment.appendChild(details)
    infoWrapper.appendChild(fragment)
  })
})
