import { useState } from "react"
import confetti from "canvas-confetti"

export default function Play({ title, artist, url, thumbnail }) {
  const MAX_SCORE = 5000
  const STEP = 2000
  const [score, setScore] = useState(MAX_SCORE)
  const [durationMs, setDurationMs] = useState(1000)
  const [playing, setPlaying] = useState(false)
  const [guessed, setGuessed] = useState(false)

  function listenAgainHandler() {
    play(durationMs)
  }

  function nextHintHandler() {
    if (score-1000 > 0) {
      setScore(score - 1000)
      setDurationMs(ms => {
        play(ms + STEP)
        return ms + STEP
      })
    } else {
      setScore(0)
      setGuessed(true)
      play(-1)
    }
  }

  function guessHandler() {
    setGuessed(true)
    if (score === MAX_SCORE) {
      confetti({ particleCount: 500, spread: 360, shapes: ['circle'], colors: ['#ffffff'] })
    }
    play(-1)
  }

  function nextSongHandler() {
    window.location.href = '/'
  }

  function play(ms) {
    const player = document.querySelector('audio')

    if (ms >= 0) {
      setTimeout(() => {
        player.pause()
        player.currentTime = 0
        setPlaying(false)
      }, ms)
    }

    setPlaying(true)
    player.play()
  }

  return (
    <div className="flex flex-col items-center text-center justify-center">
      <h1 className="font-bold text-4xl">Score: {score}</h1>

      <div className={`${!guessed && 'hidden'} flex flex-col items-center`}>
        <p className=''>{title.length > 30 ? title.slice(0,30)+'...' : title}</p>
        <img src={thumbnail} className="h-[300px] min-h-[300px] self-center rounded-sm shadow-xl shadow-lime-50"/>
        <button onClick={nextSongHandler} className="mt-2 rounded-full px-2 py-1 border-4 border-lime-50 shadow-white shadow-lg hover:bg-lime-50 hover:text-[#0F0F19] transition duration-500 hover:scale-110">Next song!</button>
      </div>

      <div className={`${guessed && 'hidden'} flex flex-row justify-evenly w-4/5 text-3xl`}>
        <button id="next-hint" onClick={nextHintHandler} disabled={playing} className={`rounded ${ !playing && 'text-red-300 hover:scale-110 focus:scale-110 outline-0' } p-1 transition-all duration-500`}>Help?</button>
        <button id="listen-again" onClick={listenAgainHandler} disabled={playing} className={`rounded ${ !playing && 'text-yellow-300 hover:scale-110 focus:scale-110 outline-0' } p-1 transition-all duration-500`}>Play</button>
        <button id="guess" onClick={guessHandler} disabled={playing} className={`rounded ${ !playing && 'text-emerald-400 hover:scale-110 focus:scale-110 outline-0' } p-1 transition-all duration-500`}>Tell me</button>
      </div>

      <audio src={url} />
    </div>
  )
}

export async function getServerSideProps({ query }) {
  const url = decodeURIComponent(query['audio-src'])
  const title = decodeURIComponent(query['title'])
  const artist = decodeURIComponent(query['artist'])
  const thumbnail = decodeURIComponent(query['thumbnail-src'])
  return { props: { title, artist, url, thumbnail }}
}
