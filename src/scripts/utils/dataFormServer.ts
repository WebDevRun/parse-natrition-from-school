import { schoolType } from '../info/schools'

export default class DataFromServer {
  private static createUrl(school: schoolType): string {
    const { host, path } = school
    return host.concat(path)
  }

  private static async getData(urls: string[]) {
    const responses = await Promise.allSettled(urls.map((url) => fetch(url)))
    const bodies: (string | Error)[] = []

    for (const response of responses) {
      if (response.status === 'fulfilled') {
        const responseBody = await response.value.text()
        bodies.push(responseBody)
      }

      if (response.status === 'rejected') {
        bodies.push(response.reason)
      }
    }

    return bodies
  }

  public static async getResults(schools: schoolType[]) {
    const urls = schools.map(this.createUrl)
    const bodies = await this.getData(urls)
    return schools.map((school, index) => {
      return {
        school: school.name,
        url: urls[index],
        body: bodies[index],
      }
    })
  }
}
