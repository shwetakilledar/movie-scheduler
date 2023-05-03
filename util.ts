import * as fs from 'fs'
import { DateTime, Duration } from 'luxon'

export function generateJson(filepath: string): any[] {
  if (!filepath) {
    return []
  }

  let fileContent

  try {
    fileContent = fs.readFileSync(filepath, 'utf-8')
  } catch (err) {
    console.log('something went wrong')
  }

  if (!fileContent) {
    return []
  }

  fileContent = fileContent.trim().split('\n')
  let data: any = []
  for (let i = 1; i < fileContent.length; i++) {
    let [movieTitle, _, mpaaRating, runTime] = fileContent[i].trim().split(', ')
    let [hours, minutes] = runTime.split(':')
    let obj = {
      movieTitle,
      mpaaRating,
      originalRunTime: runTime,
      runTime: Duration.fromObject({ hours, minutes }),
    }
    data.push(obj)
  }

  return data
}

export const CHANGE_OVER_TIME = Duration.fromObject({ minutes: 35 })
export const SETUP_TIME = Duration.fromObject({ hours: 1 })
export const WEEKDAY_OPEN = DateTime.fromFormat('08:00', 'HH:mm')
export const WEEKDAY_CLOSE = DateTime.fromFormat('23:00', 'HH:mm')
export const WEEKEND_OPEN = DateTime.fromFormat('10:30', 'HH:mm')
export const WEEKEND_CLOSE = DateTime.fromFormat('23:30', 'HH:mm')

export const todayDate = DateTime.now().toFormat('EEEE MM/dd/yyyy')
export const todayDay = DateTime.now().day
