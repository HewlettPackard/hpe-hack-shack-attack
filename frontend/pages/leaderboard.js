/* eslint-disable no-underscore-dangle */
import React, { Component } from 'react';
import { TableLayout } from '../components/Leaderboard/style';
import { Config } from '../config';

export default class Leaderboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      leaderboard: [],
    };
  }

  componentDidMount() {
    this._isMounted = true;
    fetch(`${Config.apiUrl}/user/leaderboard`)
      .then(res => res.json())
      .then((data) => {
        const leaderboard = data.sort((a, b) => b.score - a.score);
        const len = leaderboard.length;
        if (len < 10) {
          for (let i = len + 1; i <= 10; i += 1) {
            leaderboard.push({ score: '-', name: '-' });
          }
        }
        if (this._isMounted) this.setState({ leaderboard });
      })
      .catch(err => console.log(err));
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

    rankText = (rank) => {
      switch (rank) {
        case 1:
          return '1ST';
        case 2:
          return '2ND';
        case 3:
          return '3RD';
        case 4:
        case 5:
        case 6:
        case 7:
        case 8:
        case 9:
        case 10:
          return `${rank}TH`;
        default:
          return '';
      }
    }

    render() {
      const { leaderboard } = this.state;
      const tableBody = leaderboard.map((player, index) => (
        <tr key={index}>
          <td>{this.rankText(index + 1)}</td>
          <td>{player.score}</td>
          <td>{player.name !== '-' ? `${player.name} (${player.initials})` : '-'}</td>
        </tr>
      ));

      return (
        <TableLayout>
          <table>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Score</th>
                <th>Name</th>
              </tr>
            </thead>
            <tbody>
              {tableBody}
            </tbody>
          </table>
        </TableLayout>
      );
    }
}
