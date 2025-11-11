import '../components/Animecard.css' 

export default function AnimeCard({ anime }: { anime: any }) {
  return (
    <div className="anime-card">
      <img src={anime.images.jpg.image_url} alt={anime.title} />
      <p>{anime.title}</p>
    </div>
  )
}
