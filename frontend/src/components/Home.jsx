import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import { fetchRandomLegislation } from '../api';
import './Home.css';

const Home = () => {
  const [legislationCards, setLegislationCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Utility function to get first 10 words of description
  const getTruncatedDescription = (description) => {
    if (!description) return 'No description available...';
    const words = description.split(' ').slice(0, 10);
    return words.join(' ') + '...';
  };

  // Fallback data in case API is not available
  const fallbackLegislation = [
    {
      id: 1,
      title: 'Local Park Renovation Initiative',
      description: 'Proposal to renovate the central community park with new playground equipment and walking trails.',
      billLevel: 'Local',
      state: 'CA',
      city: 'Beverly Hills',
      zipcode: '90210',
      billDate: '2024-11-15'
    },
    {
      id: 2,
      title: 'State Education Funding Reform',
      description: 'Comprehensive reform of education funding allocation across California school districts.',
      billLevel: 'State',
      state: 'CA',
      city: null,
      zipcode: null,
      billDate: '2024-12-01'
    },
    {
      id: 3,
      title: 'Federal Healthcare Accessibility Act',
      description: 'Legislation to improve healthcare accessibility and affordability nationwide.',
      billLevel: 'Federal',
      state: null,
      city: null,
      zipcode: null,
      billDate: '2024-12-10'
    },
    {
      id: 4,
      title: 'Local Transportation Improvement',
      description: 'Initiative to improve public transportation and reduce traffic congestion.',
      billLevel: 'Local',
      state: 'CA',
      city: 'Beverly Hills',
      zipcode: '90210',
      billDate: '2024-11-20'
    },
    {
      id: 5,
      title: 'State Environmental Protection Bill',
      description: 'New regulations to protect natural resources and combat climate change.',
      billLevel: 'State',
      state: 'CA',
      city: null,
      zipcode: null,
      billDate: '2024-12-05'
    },
    {
      id: 6,
      title: 'Federal Infrastructure Investment',
      description: 'Major infrastructure investment package for roads, bridges, and broadband.',
      billLevel: 'Federal',
      state: null,
      city: null,
      zipcode: null,
      billDate: '2024-12-15'
    }
  ];

  useEffect(() => {
    const loadRandomLegislation = async () => {
      try {
        setLoading(true);
        // Get user's zipcode and state from localStorage or use defaults
        const userZipcode = localStorage.getItem('userZipcode') || '48315'; // Default zipcode (Beverly Hills, CA)
        const userState = localStorage.getItem('userState') || 'MI'; // Default state
        
        console.log('Fetching random legislation for:', { userZipcode, userState });
        
        const legislation = await fetchRandomLegislation(userZipcode, userState);
        
        console.log('Received legislation:', legislation);
        
        // Transform the API response to match the card format
        const transformedCards = legislation.map((item) => ({
          id: item.id,
          title: `${item.billLevel}: ${item.title}`,
          truncatedDescription: getTruncatedDescription(item.description),
          description: item.description,
          billLevel: item.billLevel,
          state: item.state,
          city: item.city,
          zipcode: item.zipcode
        }));
        
        console.log('Transformed cards:', transformedCards);
        setLegislationCards(transformedCards);
      } catch (err) {
        console.error('Error loading random legislation:', err);
        console.log('Using fallback legislation data');
        
        // Use fallback data when API fails
        const transformedFallback = fallbackLegislation.map((item) => ({
          id: item.id,
          title: `${item.billLevel}: ${item.title}`,
          truncatedDescription: getTruncatedDescription(item.description),
          description: item.description,
          billLevel: item.billLevel,
          state: item.state,
          city: item.city,
          zipcode: item.zipcode
        }));
        
        console.log('Using fallback data:', transformedFallback);
        setLegislationCards(transformedFallback);
        setError(null); // Clear error since we have fallback data
      } finally {
        setLoading(false);
      }
    };

    loadRandomLegislation();
  }, []);
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 10000, // 10 seconds
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 900,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <div className="home">
      <header className="home__header">
        <div className="header-content">
          <h1>
            <span className="welcome-text">Welcome to </span>
            <span className="brand-text">
              <span className="your-text">Your</span>
              <span className="say-text">Say</span>
            </span>
          </h1>
          <p className="hero-text">
            Your voice matters. Be part of the conversation.
          </p>
          <p className="sub-text">
            Stay informed about upcoming legislation and share your opinions on bills at all levels - 
            from your local town halls to state legislatures and federal congress.
          </p>
          <div className="stat-cards">
            <div className="stat-card">
              <span className="stat-number">50+</span>
              <span className="stat-label">Active Bills</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">10k+</span>
              <span className="stat-label">Citizens Engaged</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">3</span>
              <span className="stat-label">Government Levels</span>
            </div>
          </div>
        </div>
      </header>
      <section className="home__legislation">
        <h2><span className="section-title">Upcoming Legislation</span></h2>
        <div className="carousel">
          {loading ? (
            <div className="loading-spinner-container">
              <div className="big-blue-spinner"></div>
            </div>
          ) : error ? (
            <div className="error-state">
              <p>{error}</p>
            </div>
          ) : legislationCards.length > 0 ? (
            <Slider {...settings}>
              {legislationCards.map((card) => (
                <div key={card.id} className="legislation-card">
                  <h3>{card.title}</h3>
                  <p><strong>Summary:</strong> {card.truncatedDescription}</p>
                </div>
              ))}
            </Slider>
          ) : (
            <div className="no-legislation">
              <p>No legislation available for your area at the moment.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
