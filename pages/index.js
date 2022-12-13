import GenreCard from "../components/GenreCard";
import { createClient } from 'redis';

export default function Genre({ pop, metal, evergreen, cartoons, christmas, italian }) {
    return (
    <div className="grid grid-cols-3 items-center">
        <GenreCard
        genreHuman="Evergreen"
        genreId="evergreen"
        artworkSrc='/nina-simone.jpg'
        audioSrc={evergreen.audioSrc}
        title={evergreen.title}
        artist={evergreen.artist}
        thumbnailSrc={evergreen.thumbnailSrc}
        />

        <GenreCard
        genreId="pop"
        genreHuman="Pop"
        artworkSrc='/anastacia.jpg'
        audioSrc={pop.audioSrc}
        title={pop.title}
        artist={pop.artist}
        thumbnailSrc={pop.thumbnailSrc}
        />

        <GenreCard
        genreId="metal"
        genreHuman="Metal & Rock"
        artworkSrc='/megadeth.jpg'
        audioSrc={metal.audioSrc}
        title={metal.title}
        artist={metal.artist}
        thumbnailSrc={metal.thumbnailSrc}
        />

        <GenreCard
        genreHuman="Cartoons"
        genreId="cartoons"
        artworkSrc='/goku.gif'
        audioSrc={cartoons.audioSrc}
        title={cartoons.title}
        artist={cartoons.artist}
        thumbnailSrc={cartoons.thumbnailSrc}
        />

        <GenreCard
        genreHuman="Christmas"
        genreId="christmas"
        artworkSrc='/george-michael.jpg'
        audioSrc={christmas.audioSrc}
        title={christmas.title}
        artist={christmas.artist}
        thumbnailSrc={christmas.thumbnailSrc}
        />

        <GenreCard
        genreHuman="Italian"
        genreId="italian"
        artworkSrc='/883.jpg'
        audioSrc={italian.audioSrc}
        title={italian.title}
        artist={italian.artist}
        thumbnailSrc={italian.thumbnailSrc}
        />
    </div>
    )
}

export async function getServerSideProps() {
    const client = createClient({ url: 'redis://localhost:6379' })
    await client.connect()

    const genres = [ 'pop', 'metal', 'christmas', 'cartoons', 'italian', 'evergreen' ]

    let props = {}
    for (let g of genres) {
        props[g] = JSON.parse(await client.LPOP(g))
        await client.RPUSH(g, JSON.stringify(props[g])) // prevent songs from finishing while playing
    }

    return { props }
}
