import { tagText } from '../info/tagText'

export default class DateWorker {
  public static getYearString(date?: string): string {
    const currentDate = date ? new Date(date) : new Date()
    const year = currentDate.getFullYear()
    if (year === tagText.createDate) return `${tagText.createDate}`
    return `${tagText.createDate}-${year}`
  }

  public static getNowDateString() {
    const date = new Date()

    const dateObj = {
      year: date.getFullYear(),
      month:
        date.getMonth() + 1 <= 9
          ? `0${date.getMonth() + 1}`
          : date.getMonth() + 1,
      day: date.getDate() <= 9 ? `0${date.getDate()}` : date.getDate(),
    }

    return `${dateObj.year}-${dateObj.month}-${dateObj.day}`
  }
}
