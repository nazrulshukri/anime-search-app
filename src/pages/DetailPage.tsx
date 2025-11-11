import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import './DetailPage.css';

export default function DetailPage() {
  const { id } = useParams();
  const [anime, setAnime] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Reaction counts
  const [reactions, setReactions] = useState({ love: 0, like: 0, dislike: 0 });
  // Floating +1 animation state
  const [floatAnim, setFloatAnim] = useState<{type: string, key: number}[]>([]);

  useEffect(() => {
    setLoading(true);
    setError(false);

    axios
      .get(`https://api.jikan.moe/v4/anime/${id}`)
      .then((res) => {
        setAnime(res.data.data);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [id]);

  const handleReaction = (type: 'love' | 'like' | 'dislike') => {
    // Increase counter
    setReactions((prev) => ({ ...prev, [type]: prev[type] + 1 }));

    // Add floating animation
    setFloatAnim((prev) => [...prev, { type, key: Date.now() }]);

    // Remove the floating animation after 1s
    setTimeout(() => {
      setFloatAnim((prev) => prev.filter((f) => f.key !== Date.now()));
    }, 1000);
  };

  if (loading) return <p className="loading">Loading anime details...</p>;
  if (error || !anime) return <p className="error">Failed to load anime details.</p>;

  return (
    <div className="page">
      <div className="container">
        <div className="header">
          <Link to="/" className="back-link">⬅ Back to search</Link>
        </div>

        <div className="main-grid">
          <div className="image-section">
            <img src={anime.images.jpg.image_url} alt={anime.title} className="anime-image" />
            <div className="score-badge">⭐ {anime.score || 'N/A'}</div>
          </div>

          <div className="info-section">
            <h1 className="title">{anime.title}</h1>

            <ul className="info-list">
              <li className="subtitle">{anime.title_japanese}</li>
              <li className="synopsis">{anime.synopsis}</li>
            </ul>

            <div className="badges">
              <span>Episodes: {anime.episodes || 'N/A'}</span>
              <span>Rating: {anime.rating || 'N/A'}</span>
            </div>

            {/* Reactions */}
            <div className="reactions">
              <div className="reaction-wrapper">
                <span onClick={() => handleReaction('love')}>❤️ {reactions.love}</span>
                {floatAnim
                  .filter(f => f.type === 'love')
                  .map(f => <span key={f.key} className="float-plus">+1</span>)}
              </div>
              <div className="reaction-wrapper">
                <span onClick={() => handleReaction('like')}>👍 {reactions.like}</span>
                {floatAnim
                  .filter(f => f.type === 'like')
                  .map(f => <span key={f.key} className="float-plus">+1</span>)}
              </div>
              <div className="reaction-wrapper">
                <span onClick={() => handleReaction('dislike')}>👎 {reactions.dislike}</span>
                {floatAnim
                  .filter(f => f.type === 'dislike')
                  .map(f => <span key={f.key} className="float-plus">+1</span>)}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
