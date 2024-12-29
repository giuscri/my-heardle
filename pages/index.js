import GenreCard from "../components/GenreCard";
import { createClient } from 'redis';

export default function Genre({ pop, metal, evergreen, cartoons, christmas, summer, italians }) {
    const genres = [
        {
            genreHuman: "Evergreen",
            genreId: "evergreen",
            artworkSrc: '/nina-simone.gif',
            url: evergreen.url,
            title: evergreen.title,
            artist: evergreen.artist,
            thumbnail: evergreen.thumbnail
        },
        {
            genreHuman: "Pop",
            genreId: "pop",
            artworkSrc: '/anastacia.gif',
            url: pop.url,
            title: pop.title,
            artist: pop.artist,
            thumbnail: pop.thumbnail
        },
        {
            genreHuman: "Metal & Rock",
            genreId: "metal",
            artworkSrc: '/megadeth.gif',
            url: metal.url,
            title: metal.title,
            artist: metal.artist,
            thumbnail: metal.thumbnail
        },
        {
            genreHuman: "Cartoons",
            genreId: "cartoons",
            artworkSrc: '/goku.gif',
            url: cartoons.url,
            title: cartoons.title,
            artist: cartoons.artist,
            thumbnail: cartoons.thumbnail
        },
        {
            genreHuman: "Italians",
            genreId: "italians",
            artworkSrc: '/883.gif',
            url: italians.url,
            title: italians.title,
            artist: italians.artist,
            thumbnail: italians.thumbnail
        },
    ]

    if (process.env.HEARDLE_CHRISTMAS === "true") {
        genres.push({
            genreHuman: "Christmas",
            genreId: "christmas",
            artworkSrc: '/george-michael.gif',
            url: christmas.url,
            title: christmas.title,
            artist: christmas.artist,
            thumbnail: christmas.thumbnail
        })
    } else {
        genres.push({
            genreHuman: "Festivalbar",
            genreId: "summer",
            artworkSrc: '/festivalbar.jpg',
            url: summer.url,
            title: summer.title,
            artist: summer.artist,
            thumbnail: summer.thumbnail
        })
    }

    return (
        <div className="grid grid-cols-3 items-center">
            {genres.map((genre, index) => 
                <GenreCard
                    i={index+1}
                    key={genre.genreId}
                    genreHuman={genre.genreHuman}
                    genreId={genre.genreId}
                    artworkSrc={genre.artworkSrc}
                    url={genre.url}
                    title={genre.title}
                    artist={genre.artist}
                    thumbnail={genre.thumbnail}
                />
            )}
        </div>
    )
}

export async function getServerSideProps() {
    const client = createClient({ url: 'redis://0.0.0.0:6379' })
    await client.connect()

    const genres = [ 'pop', 'metal', 'christmas', 'summer', 'cartoons', 'italians', 'evergreen' ]

    let props = {}
    for (let g of genres) {
        const j = await client.LPOP(g)
        try {
            props[g] = JSON.parse(j) || {} // allow genre redis list to be empty without breaking the app
            await client.RPUSH(g, JSON.stringify(props[g])) // prevent songs from finishing while having fun
        } catch (e) {
            console.log(e, j)
        }
    }

    return { props }
}
