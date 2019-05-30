/* (C) Copyright 2019 Hewlett Packard Enterprise Development LP. */
/* eslint-disable no-underscore-dangle */

import React, { Component } from 'react';
import {
  Box, Heading, Text, Grommet,
} from 'grommet';
import { Config } from '../config';
import PostData from '../data/events.json';

const theme = {
  global: {
    font: {
      family: "'Metric', Arial, sans-serif",
      face: `
      @font-face {
        font-family: "Metric";
        src: url("https://hpefonts.s3.amazonaws.com/web/MetricHPE-Web-Regular.woff") format('woff');
      }
      @font-face {
        font-family: "Metric";
        src: url("https://hpefonts.s3.amazonaws.com/web/MetricHPE-Web-Bold.woff") format('woff');
        font-weight: 700;
      }
      @font-face {
        font-family: "Metric";
        src: url("https://hpefonts.s3.amazonaws.com/web/MetricHPE-Web-Semibold.woff") format('woff');
        font-weight: 600;
      }
      @font-face {
        font-family: "Metric";
        src: url("https://hpefonts.s3.amazonaws.com/web/MetricHPE-Web-Light.woff") format('woff');
        font-weight: 100;
      }
    `,
    },
  },
};

export default class Leaderboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      column1: [],
      column2: [],
      date: {
        day: '',
      },
    };
  }

  componentDidMount() {
    this.interval = setInterval(() => {
      const newDate = new Date();
      this.setState(
        {
          date: {
            day: newDate.getDate().toString(),

          },
        },
      );
    }, 1000);

    this._isMounted = true;
    fetch(`${Config.apiUrl}/user/leaderboard`)
      .then(res => res.json())
      .then((data) => {
        const leaderboard = data.sort((a, b) => b.score - a.score);
        const column1 = leaderboard.slice(0, 5);
        const column2 = leaderboard.slice(5, 10);
        const len = leaderboard.length;
        if (len < 10) {
          for (let i = len + 1; i <= 10; i += 1) {
            leaderboard.push({ score: '-', name: '-' });
          }
        }
        if (this._isMounted) this.setState({ column1, column2 });
      })
      .catch(err => console.log(err));
  }

  componentWillUnmount() {
    clearInterval(this.interval);
    this._isMounted = false;
  }


  render() {
    const { column1, column2 } = this.state;
    const { date: { day } } = this.state;
    const tableBody1 = column1.map((player, index) => (
      <Box width="large" basis="1/2" direction="row" gap="small" key={index}>
        <Text size="xxlarge" weight="bold">
          {`${index + 1}.`}{' '}
          {player.name !== '-' ? `${player.name} (${player.initials})` : '-'}{' '}
        </Text>
        <Text size="xxlarge">{player.score}</Text>
      </Box>
    ));
    const tableBody2 = column2.map((player, index) => (
      <Box width="large" basis="1/2" direction="row" gap="small" key={index}>
        <Box width="large" basis="1/2" direction="row" gap="small" key={index}>
          <Text size="xxlarge" weight="bold">
            {`${index + 6}.`}{' '}
            {player.name !== '-' ? `${player.name} (${player.initials})` : '-'}{' '}
          </Text>
          <Text size="xxlarge">{player.score}</Text>
        </Box>
      </Box>
    ));

    return (
      <Grommet full theme={theme}>
        <Box width="large" direction="column" fill flex>
          <Box basis="1/2" background="brand">
            <Heading
              style={{ fontWeight: 'bold' }}
              alignSelf="center"
              margin="small"
              pad="small"
              color="white"
              size="xlarge"
              level={1}
            >
              {' '}
              upcoming sessions{' '}
            </Heading>
            <Box
              margin="small"
              gap="medium"
              width="large"
              align="center"
              alignSelf="center"
            >

              {PostData.map((postDetail) => {
                if (postDetail.day === day) {
                  return <Box alignSelf="start" direction="row" gap="small">
                    <Text weight="bold" size="large"> {postDetail.time} </Text>
                    <Text size="large"> {postDetail.title} </Text>
                  </Box>;
                }
              })}
            </Box>
          </Box>
          <Box basis="1/2" background="accent-3">
            <Heading
              style={{ fontWeight: 'bold' }}
              alignSelf="center"
              margin="small"
              pad="small"
              color="black"
              size="xlarge"
            >
              {' '}
              leaderboard{' '}
            </Heading>
            <Box
              alignContent="center"
              alignSelf="center"
              margin="small"
              gap="large"
              width="600px"
              direction="row-responsive"
            >
              <Box direction="column"> {tableBody1} </Box>
              <Box direction="column"> {tableBody2} </Box>
            </Box>
          </Box>
          <style jsx global>{`
            html,
            body {
              margin: 0;
              padding: 0;
              height: 100%;
              overflow-x: hidden;
            }
            #__next {
              height: 100%;
            }
          `}
          </style>
        </Box>
      </Grommet>
    );
  }
}
