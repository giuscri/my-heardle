import GenreCard from "../components/GenreCard";
import { createClient } from 'redis';

export default function Genre({ pop, metal, evergreen, cartoons, christmas, italians }) {
    return (
    <div className="grid grid-cols-3 items-center">
        <GenreCard
        genreHuman="Evergreen"
        genreId="evergreen"
        artworkSrc='/nina-simone.jpg'
        url={evergreen.url}
        title={evergreen.title}
        artist={evergreen.artist}
        thumbnail={evergreen.thumbnail}
        />

        <GenreCard
        genreId="pop"
        genreHuman="Pop"
        artworkSrc='/anastacia.jpg'
        url={pop.url}
        title={pop.title}
        artist={pop.artist}
        thumbnail={pop.thumbnail}
        />

        <GenreCard
        genreId="metal"
        genreHuman="Metal & Rock"
        artworkSrc='/megadeth.jpg'
        url={metal.url}
        title={metal.title}
        artist={metal.artist}
        thumbnail={metal.thumbnail}
        />

        <GenreCard
        genreHuman="Cartoons"
        genreId="cartoons"
        artworkSrc='/goku.gif'
        url={cartoons.url}
        title={cartoons.title}
        artist={cartoons.artist}
        thumbnail={cartoons.thumbnail}
        />

        <GenreCard
        genreHuman="Christmas"
        genreId="christmas"
        artworkSrc='/george-michael.jpg'
        url={christmas.url}
        title={christmas.title}
        artist={christmas.artist}
        thumbnail={christmas.thumbnail}
        />

        <GenreCard
        genreHuman="Italians"
        genreId="italians"
        artworkSrc='/883.jpg'
        url={italians.url}
        title={italians.title}
        artist={italians.artist}
        thumbnailSrc={italians.thumbnailSrc}
        />
    </div>
    )
}

export async function getServerSideProps() {
    const client = createClient({ url: 'redis://localhost:6379' })
    await client.connect()

    const genres = [ 'pop', 'metal', 'christmas', 'cartoons', 'italians', 'evergreen' ]

    let props = {}
    for (let g of genres) {
        props[g] = JSON.parse(await client.LPOP(g))
        await client.RPUSH(g, JSON.stringify(props[g])) // prevent songs from finishing while playing
    }

    return { props }
}
