import React, { useState, useEffect } from 'react';
import Card from './Components/Card.js';
import './App.css';
//const token = process.env.API_TOKEN || require("./token.js");

function App() {
  const defaultBoro = 'BRONX';
  const [restaurant, setRestaurant] = useState('');
  const [boro, setBoro] = useState(defaultBoro);

  const [restaurantQuery, setRestaurantQuery] = useState('');
  const [boroQuery, setBoroQuery] = useState(defaultBoro);

  const [results, setResults] = useState([]);

  const cards = results.map((result, i) =>
    <Card key={i}
      dba={result.dba}
      cuisine_description={result.cuisine_description}
      inspection_date={result.inspection_date}
      street={result.street}
      boro={result.boro}
      zipcode={result.zipcode}
      phone={result.phone}
      score={result.score}
      grade={result.grade}
      critical_flag={result.critical_flag}
      action={result.action}
      violation_code={result.violation_code}
      violation_description={result.violation_description}
      grade_date={result.grade_date}
      inspection_type={result.inspection_type}
    />
  );
  const numCards = cards.length;

  function handleFormSubmit(event) {
    event.preventDefault();
    setRestaurantQuery(restaurant.toUpperCase());
    setBoroQuery(boro.toUpperCase());
    return false;
  }

  useEffect(() => {
    let didCancel = false;

    async function fetchMyAPI() {
      const queryString = `?$where=DBA like '%${restaurantQuery}%' and BORO like '${boroQuery}'`;
      const url = 'https://data.cityofnewyork.us/resource/9w7m-hzhe.json';
      const fullUrl = encodeURI(url + queryString);

      const res = await fetch(fullUrl);
      if (!didCancel) { // Ignore if we started fetching something else
        const response = await res.json();
        if (Array.isArray(response)) {
          setResults(response);
        } else {
          setResults([]);
        }
      }
    }

    if (restaurantQuery.length > 0) {
      fetchMyAPI();
    }

    return () => { didCancel = true; }; // Remember if we start fetching something else
  }, [restaurantQuery, boroQuery]);

  return (
    <div>
      <header>
        <nav className="teal">
          <div className="nav-wrapper container">
            <a href="/" className="brand-logo truncate">NYC Food Safety</a>
            <a href="/" data-target="mobile-demo" className="sidenav-trigger"><i className="material-icons">menu</i></a>
            <ul className="right hide-on-med-and-down">
              <li className="li-home"><a href="/">Home</a></li>
              <li className="li-search"><a href="/search">Search</a></li>
              <li className="li-violation"><a href="/report-violations">Report Violations</a></li>
            </ul>
          </div>
        </nav>

        <ul id="mobile-demo" className="sidenav">
          <li>
            <div className="user-view">
              <div className="background teal">
              </div>
              <a href="/"><span className="white-text name">NYC Food Safety</span></a>
              <span className="white-text">Find restaurant inspection records</span>
            </div>
          </li>
          <li className="li-home"><a href="/"><i className="material-icons">home</i>Home</a></li>
          <li className="li-search"><a href="/search"><i className="material-icons">search</i>Search</a></li>
          <li className="li-violation"><a href="/report-violations"><i className="material-icons">report_problem</i>Report Violations</a></li>
        </ul>

      </header>
      <main className="blue-grey lighten-5" style={{ padding: '35px' }}>

        <form onSubmit={handleFormSubmit}>
          <input placeholder="Resaurant Name" value={restaurant} onChange={e => setRestaurant(e.target.value)}></input>

          <select name="boro" value={boro} onChange={e => setBoro(e.target.value)}>
            <option value="BRONX">Bronx</option>
            <option value="BROOKLYN">Brooklyn</option>
            <option value="MANHATTAN">Manhattan</option>
            <option value="QUEENS">Queens</option>
            <option value="STATEN ISLAND">Staten Island</option>
          </select>

          <button type="submit">Search</button>
        </form>

        <div className="container" style={{ textAlign: 'center', marginBottom: '50px' }}>
          <h3 style={{ fontWeight: 'bold' }}>Search Results</h3>
        </div>

        <div className="container">
          <div className="row">
            <p>Your search returned {numCards} results.</p>
          </div>
          {cards}
        </div>
      </main>
    </div>
  );
}

export default App;
