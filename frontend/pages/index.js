import React from 'react'
import Link from 'next/link'
import { Config } from '../config'; // Usage: Config.apiUrl/user

const Home = () => (
  <div>
    <div className="hero">
      <h1 className="title">Welcome to HPE Discover 2019 Hackshack</h1>
      <p className="description">
        To get started, edit <code>pages/index.js</code> and save to reload.
      </p>
      <Link href="/leaderboard">
            <a className="description"><p>Access Leaderboard</p></a>
        </Link>
    </div>

    <style jsx>{`
      .hero {
        width: 100%;
        color: #333;
      }
      .title {
        margin: 0;
        width: 100%;
        padding-top: 80px;
        line-height: 1.15;
        font-size: 48px;
      }
      .title,
      .description {
        text-align: center;
      }
    `}</style>
  </div>
)

export default Home
