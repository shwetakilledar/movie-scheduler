import { log } from 'console'
import { DateTime, Duration } from 'luxon'
import {
  generateJson,
  CHANGE_OVER_TIME,
  SETUP_TIME,
  WEEKDAY_OPEN,
  WEEKDAY_CLOSE,
  WEEKEND_OPEN,
  WEEKEND_CLOSE,
  todayDate,
  todayDay,
} from './util'

function generateMovieSchedule(movieData): [] {
  if (!movieData) {
    return []
  }
  let theatreOpeningTime, theatreClosingTime
  if (todayDay >= 1 || todayDay <= 4) {
    theatreOpeningTime = WEEKDAY_OPEN
    theatreClosingTime = WEEKDAY_CLOSE
  } else {
    theatreOpeningTime = WEEKEND_OPEN
    theatreClosingTime = WEEKEND_CLOSE
  }

  let result: any = []
  for (let movie of movieData) {
    let movieTimes: any = []

    // for rounding off to nearest time divisible by 5
    let hours = movie.runTime.hours
    let minutes = movie.runTime.minutes
    minutes = Math.round(parseInt(minutes) / 5) * 5
    let newD = Duration.fromObject({ hours, minutes })

    let currentMovieTime = theatreClosingTime.minus(newD)
    let isTheatreOpen = theatreClosingTime > theatreOpeningTime.plus(SETUP_TIME)

    while (isTheatreOpen) {
      let movieStartAt = currentMovieTime
      let movieEndAt =
        currentMovieTime.plus(movie.runTime) > theatreClosingTime
          ? theatreClosingTime
          : currentMovieTime.plus(movie.runTime)

      movieStartAt = movieStartAt.toFormat('HH:mm')
      movieEndAt = movieEndAt.toFormat('HH:mm')

      movieTimes.unshift([movieStartAt, movieEndAt])

      currentMovieTime = currentMovieTime.minus(newD).minus(CHANGE_OVER_TIME)

      isTheatreOpen = currentMovieTime > theatreOpeningTime.plus(SETUP_TIME)
    }

    movie['movieTimes'] = movieTimes
    result.push(movie)
  }

  return result
}

const movieDeatils: any[] = generateMovieSchedule(generateJson(process.argv[2]))

if (!movieDeatils) {
  console.log('no data')
} else {
  console.log(todayDate)

  for (let movie of movieDeatils) {
    console.log(
      `${movie.movieTitle} - Rated ${movie.mpaaRating}, ${movie.originalRunTime} \n`,
    )

    movie.movieTimes.map((time) => console.log(` ${time[0]} - ${time[1]}`))
    console.log('\n')
  }
}
