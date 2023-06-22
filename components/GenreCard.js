export default function GenreCard({ i, genreId, genreHuman, artworkSrc, url, title, artist, thumbnail }) {
    return (
        <a href={`/play?audio-src=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}&artist=${encodeURIComponent(artist)}&thumbnail-src=${encodeURIComponent(thumbnail)}`}>
            <div className="text-center text-sm">
                <p className="text-lime-50" style={{textShadow: 'yellow 1px 0 10px'}}>{genreHuman}</p>
                <div className="relative flex justify-center items-center transition-all duration-500 delay-75 hover:shadow-lime-50 hover:scale-110 focus:scale-110">
                    <p className="absolute text-4xl font-bold text-white z-10">{i}</p>
                    <img src={artworkSrc} className="h-[250px] rounded-sm shadow-xl" />
                </div>
            </div>
        </a>
    )
}
