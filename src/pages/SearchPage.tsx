import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAnime } from '../redux/slice/animeSlice'
import type { RootState, AppDispatch } from '../redux/store'
import { Link } from 'react-router-dom'

const SkeletonCard = () => (
  <div className="bg-gray-800 rounded-2xl overflow-hidden shadow-md animate-pulse">
    <div className="bg-gray-700 h-60 w-full"></div>
    <div className="h-5 bg-gray-700 mt-3 mx-3 rounded"></div>
  </div>
)

const AnimeCard = ({ anime }: { anime: any }) => (
  <Link
    to={`/anime/${anime.mal_id}`}
    className="group relative rounded-2xl overflow-hidden shadow-lg border border-gray-700 bg-gray-900 hover:border-pink-400 transition-all duration-300"
  >
    <div className="relative">
      <img
        src={anime.images.jpg.image_url}
        alt={anime.title}
        className="h-64 w-full object-cover transition-transform duration-300 group-hover:scale-110"
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>

      {/* Title */}
      <p className="absolute bottom-3 left-3 right-3 text-white font-semibold text-sm sm:text-base truncate">
        {anime.title}
      </p>

      {/* Decorative glowing point */}
      <div className="absolute top-3 right-3 w-3 h-3 bg-pink-400 rounded-full shadow-[0_0_10px_2px_rgba(236,72,153,0.7)]"></div>
    </div>
  </Link>
)

export default function SearchPage() {
  const dispatch = useDispatch<AppDispatch>()
  const { items, loading } = useSelector((state: RootState) => state.anime)
  const [query, setQuery] = useState('')

  useEffect(() => {
    const delay = setTimeout(() => {
      if (query.trim()) dispatch(fetchAnime(query))
    }, 400)
    return () => clearTimeout(delay)
  }, [query, dispatch])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white flex flex-col items-center py-10">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent drop-shadow-lg">
          🌸 Anime Search Gallery
        </h1>
        <p className="text-gray-400 text-sm sm:text-base">
          Discover beautiful anime collections with modern design ✨
        </p>
      </div>

      {/* Search box */}
      <div className="w-full max-w-xl flex justify-center mb-10 px-4">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="🔍 Search anime title..."
          className="w-full bg-gray-800 text-white px-5 py-3 rounded-xl border border-gray-700 focus:ring-2 focus:ring-pink-400 outline-none placeholder-gray-400 shadow-md"
        />
      </div>

      {/* Anime list grid */}
      <div className="w-full max-w-7xl px-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {loading
            ? Array(12)
                .fill(0)
                .map((_, i) => <SkeletonCard key={i} />)
            : items.map((anime: any) => <AnimeCard key={anime.mal_id} anime={anime} />)}
        </div>

        {!loading && items.length === 0 && query && (
          <p className="text-center text-gray-400 mt-12 text-lg">
            No anime found 😢 Try another title!
          </p>
        )}
      </div>
    </div>
  )
}
