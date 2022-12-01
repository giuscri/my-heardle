export default function GenreCard({ genreId, genreHuman, artworkSrc, audioSrc, title, artist, thumbnailSrc }) {
    return (
        <a href={`/play?audio-src=${encodeURIComponent(audioSrc)}&title=${encodeURIComponent(title)}&artist=${encodeURIComponent(artist)}&thumbnail-src=${encodeURIComponent(thumbnailSrc)}`} className="">
        <div className="text-center flex flex-col text-sm">
            <p className="text-lime-50" style={{textShadow: 'yellow 1px 0 10px'}}>{genreHuman}</p>
            <img src={artworkSrc} className="w-[300px] self-center items-center rounded-sm shadow-xl hover:shadow-lime-50 hover:scale-110 focus:scale-110 transition-all duration-500 delay-75" />
        </div>
        </a>
    )
}
