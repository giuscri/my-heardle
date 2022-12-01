import GenreCard from "../components/GenreCard";
import { createClient } from 'redis';

export default function Genre({ pop, metal, evergreen, cartoons, christmas, italian }) {
    return (
    <div className="grid grid-cols-3 items-center">
        <GenreCard
        genreId="metal"
        genreHuman="Metal & Rock"
        artworkSrc='https://upload.wikimedia.org/wikipedia/en/thumb/d/dc/Megadeth-RustInPeace.jpg/220px-Megadeth-RustInPeace.jpg'
        audioSrc={metal.audioSrc}
        title={metal.title}
        artist={metal.artist}
        thumbnailSrc={metal.thumbnailSrc}
        />

        <GenreCard
        genreId="pop"
        genreHuman="Pop"
        artworkSrc='https://lastfm.freetls.fastly.net/i/u/770x0/3ec3142b39954d6c94b82e113a593104.jpg'
        audioSrc={pop.audioSrc}
        title={pop.title}
        artist={pop.artist}
        thumbnailSrc={pop.thumbnailSrc}
        />

        <GenreCard
        genreHuman="Evergreen"
        genreId="evergreen"
        artworkSrc='https://iscale.iheart.com/catalog/artist/1804'
        audioSrc={evergreen.audioSrc}
        title={evergreen.title}
        artist={evergreen.artist}
        thumbnailSrc={evergreen.thumbnailSrc}
        />

        <GenreCard
        genreHuman="Cartoons"
        genreId="cartoons"
        artworkSrc='https://64.media.tumblr.com/b1f76d4415ebb43fb2d8c93dd9703792/tumblr_o9g31eV15c1uuj1vto1_500.gif'
        audioSrc={cartoons.audioSrc}
        title={cartoons.title}
        artist={cartoons.artist}
        thumbnailSrc={cartoons.thumbnailSrc}
        />

        <GenreCard
        genreHuman="Christmas"
        genreId="christmas"
        artworkSrc='https://m.media-amazon.com/images/I/51Y8cIkPfzL._AC_SX466_.jpg'
        audioSrc={christmas.audioSrc}
        title={christmas.title}
        artist={christmas.artist}
        thumbnailSrc={christmas.thumbnailSrc}
        />

        <GenreCard
        genreHuman="Italian"
        genreId="italian"
        artworkSrc='https://i.scdn.co/image/ab67616d0000b273243b73f0b9fd2500f491f5bf'
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
