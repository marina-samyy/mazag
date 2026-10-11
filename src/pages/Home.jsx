import { Link, useNavigate } from 'react-router-dom';
import { Heart, Shuffle } from 'lucide-react';
import toast from 'react-hot-toast';
import MoodCard from '../components/MoodCard';
import ImageWithFallback from '../components/ImageWithFallback';
import PageTransition from '../components/PageTransition';
import useMoodTheme from '../hooks/useMoodTheme';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { getAllMoods, getRandomMood } from '../utils/dataHelpers';

export default function Home() {
  const navigate = useNavigate();
  const moods = getAllMoods();
  useMoodTheme('home');
  useDocumentTitle('Mazag — Egypt by Mood');

  // "Surprise me": pick a random mood from the data and go to its page.
  const handleSurprise = () => {
    const mood = getRandomMood();
    toast(`Your mood today: ${mood.name}`, { icon: '✨' });
    navigate(`/mood/${mood.id}`);
  };

  return (
    <PageTransition>
      <section className="container mz-hero" aria-labelledby="hero-title">
        <div className="row align-items-center g-5">
          <div className="col-lg-6">
            <p className="mz-hero-ar" lang="ar" dir="rtl">مزاج</p>
            <h1 id="hero-title" className="mz-hero-title">
              Don't choose a destination. Choose a feeling.
            </h1>
            <p className="lead mz-hero-lead">
              Tell Mazag how you feel and it hands you a small bundle of Egypt: a place to go,
              a film to watch and a song to play.
            </p>
            <div className="d-flex flex-wrap gap-3">
              <button type="button" className="btn btn-lg mz-btn-primary d-inline-flex align-items-center gap-2" onClick={handleSurprise}>
                <Shuffle size={20} aria-hidden="true" /> Surprise me
              </button>
              <Link to="/favorites" className="btn btn-lg mz-btn-outline d-inline-flex align-items-center gap-2">
                <Heart size={20} aria-hidden="true" /> Your favorites
              </Link>
            </div>
          </div>

          <div className="col-lg-6" aria-hidden="true">
            <div className="mz-collage">
              {moods.map((mood) => (
                <div className="mz-collage-item" key={mood.id} data-mood={mood.id}>
                  <ImageWithFallback src={mood.heroImage} alt="" label={mood.name} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container mz-section" aria-labelledby="moods-title">
        <h2 id="moods-title" className="mb-2">How are you feeling?</h2>
        <p className="text-muted-mz mb-4">Pick one. Each mood changes the whole look of the page.</p>
        <div className="row g-4">
          {moods.map((mood) => (
            <div className="col-12 col-md-6 col-xl-3" key={mood.id}>
              <MoodCard mood={mood} />
            </div>
          ))}
        </div>
      </section>
    </PageTransition>
  );
}
