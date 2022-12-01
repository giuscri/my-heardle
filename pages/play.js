import { useState } from "react"

export default function Play({ title, artist, audioSrc, thumbnailSrc }) {
  const MAX_SCORE = 5000
  const [score, setScore] = useState(MAX_SCORE)
  const [step, setStep] = useState(1000)
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
        play(ms + step)
        return ms + step 
      })
      setStep(step*2)
    } else {
      setScore(0)
      setGuessed(true)
      play(-1)
    }
  }

  function guessHandler() {
    setGuessed(true)
    if (score === MAX_SCORE) {
      // const canvas = document.createElement('canvas')
      // document.body.appendChild(canvas)
      // const throwConfetti = confetti.create(canvas, { resize: true, useWorker: true })
      // throwConfetti({ particleCount: 100, spread: 160 })
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

      {
        guessed ?
          <div className="flex flex-col items-center">
            {/* <p className=''>{title.slice(0, 20)} — {artist.slice(0, 10)}</p> */}
            <p className=''>{title}</p>
            <img src={thumbnailSrc} className="max-w-[500px] self-center rounded-sm shadow-xl shadow-lime-50"/>
            <button onClick={nextSongHandler} className="mt-2 rounded-sm border-4 p-2">Next song!</button>
          </div>
        :
          <div className="flex flex-row justify-evenly w-4/5 text-3xl">
            <button id="next-hint" onClick={nextHintHandler} disabled={playing} className={`rounded ${ !playing && 'text-red-300 hover:scale-110 focus:scale-110' } p-1 transition-all duration-500`}>Help?</button>
            <button id="listen-again" onClick={listenAgainHandler} disabled={playing} className={`rounded ${ !playing && 'text-yellow-300 hover:scale-110 focus:scale-110' } p-1 transition-all duration-500`}>Play</button>
            <button id="guess" onClick={guessHandler} disabled={playing} className={`rounded ${ !playing && 'text-emerald-400 hover:scale-110 focus:scale-110' } p-1 transition-all duration-500`}>Tell me</button>
          </div>
      }

      <audio src={audioSrc} />
    </div>
  )
}

export async function getServerSideProps({ query }) {
  const audioSrc = decodeURIComponent(query['audio-src'])
  const title = decodeURIComponent(query['title'])
  const artist = decodeURIComponent(query['artist'])
  const thumbnailSrc = decodeURIComponent(query['thumbnail-src'])
  return { props: { title, artist, audioSrc, thumbnailSrc }}
}
