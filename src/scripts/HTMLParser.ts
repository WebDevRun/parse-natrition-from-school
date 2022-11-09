interface findFindexFileType {
  aFindexFile?: HTMLAnchorElement
  aArray: Array<HTMLAnchorElement>
}

export default class Parser {
  public static createDOM(str: string) {
    const parser = new DOMParser()
    return parser.parseFromString(str, 'text/html')
  }

  public static findFindexFile(
    aList: NodeListOf<HTMLAnchorElement>,
    findexName: string,
  ) {
    const aArray = Array.from(aList)
    return aArray.reduce<findFindexFileType>(
      (acc, a) => {
        if (a.href.endsWith(findexName)) acc.aFindexFile = a
        else acc.aArray.push(a)
        return acc
      },
      {
        aArray: [],
      },
    )
  }

  public static selectOrigin(url: string) {
    const { origin } = new URL(url)
    return origin
  }

  public static selectPathname(url: string) {
    const { pathname } = new URL(url)
    return pathname
  }
}
