import React from 'react';
import Slider from 'react-slick';
import './Home.css';


const legislationCards = [
  {
    title: 'Local: Zoning Reform',
    date: 'Town Hall - Oct 10, 2025',
    details: 'View Details',
  },
  {
    title: 'State: Education Funding Bill',
    date: 'State Legislature - Oct 15, 2025',
    details: 'View Details',
  },
  {
    title: 'Federal: Healthcare Expansion Act',
    date: 'Congress - Nov 1, 2025',
    details: 'View Details',
  },
  {
    title: 'Local: Park Renovation',
    date: 'Town Hall - Nov 5, 2025',
    details: 'View Details',
  },
  {
    title: 'State: Transportation Bill',
    date: 'State Legislature - Nov 12, 2025',
    details: 'View Details',
  },
  {
    title: 'Federal: Tax Reform Act',
    date: 'Congress - Nov 20, 2025',
    details: 'View Details',
  },
];

const Home = () => {
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
        <h1>Welcome to YourSay</h1>
        <p>
          YourSay is the platform for sharing your political opinions and staying informed about upcoming legislation in your local town halls, state legislatures, and federal congress.
        </p>
      </header>
      <section className="home__legislation">
        <h2>Upcoming Legislation</h2>
        <div className="carousel">
          <Slider {...settings}>
            {legislationCards.map((card, idx) => (
              <div key={idx} className="legislation-card">
                <h3>{card.title}</h3>
                <p>{card.date}</p>
                <button>{card.details}</button>
              </div>
            ))}
          </Slider>
        </div>
      </section>
    </div>
  );
};

export default Home;
