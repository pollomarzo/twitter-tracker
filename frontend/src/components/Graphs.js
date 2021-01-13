import React, { useMemo } from 'react';
import { Grid, Typography, makeStyles } from '@material-ui/core';

import { AreaChart, BarChart, PieChart, TableChart } from './GraphSnippets';

const statsTemplate = {
  hours: [
    { name: '00', value: '0', count: 0 },
    { name: '01', value: '1', count: 0 },
    { name: '02', value: '2', count: 0 },
    { name: '03', value: '3', count: 0 },
    { name: '04', value: '4', count: 0 },
    { name: '05', value: '5', count: 0 },
    { name: '06', value: '6', count: 0 },
    { name: '07', value: '7', count: 0 },
    { name: '08', value: '8', count: 0 },
    { name: '09', value: '9', count: 0 },
    { name: '10', value: '10', count: 0 },
    { name: '11', value: '11', count: 0 },
    { name: '12', value: '12', count: 0 },
    { name: '13', value: '13', count: 0 },
    { name: '14', value: '14', count: 0 },
    { name: '15', value: '15', count: 0 },
    { name: '16', value: '16', count: 0 },
    { name: '17', value: '17', count: 0 },
    { name: '18', value: '18', count: 0 },
    { name: '19', value: '19', count: 0 },
    { name: '20', value: '20', count: 0 },
    { name: '21', value: '21', count: 0 },
    { name: '22', value: '22', count: 0 },
    { name: '23', value: '23', count: 0 },
  ],
  days: [
    { name: 'Sun', subject: 'Sunday', count: 0 },
    { name: 'Mon', subject: 'Monday', count: 0 },
    { name: 'Tue', subject: 'Tuesday', count: 0 },
    { name: 'Wed', subject: 'Wednesday', count: 0 },
    { name: 'Thu', subject: 'Thursday', count: 0 },
    { name: 'Fri', subject: 'Friday', count: 0 },
    { name: 'Sat', subject: 'Saturday', count: 0 },
  ],
  geolocalization: [
    { name: 'No', count: 0 },
    { name: 'Yes', count: 0 },
  ],
  retweet: [
    { name: 'No', count: 0 },
    { name: 'Yes', count: 0 },
  ],
  cities: [],
  countries: [],
};

const useStyles = makeStyles({
  container: {
    maxHeight: 800,
    overflowY: 'auto',
    scrollbarWidth: 'none',
  },
});

const Graphs = ({ list }) => {
  const classes = useStyles();

  const updatedStats = useMemo(() => {
    const stats = JSON.parse(JSON.stringify(statsTemplate));

    const updateStats = (next) => {
      const { hours, days, geolocalization, retweet, cities, countries } = stats;
      hours[next.creationHour].count++;
      days[next.creationDay].count++;
      geolocalization[Number(next.isGeolocalized)].count++;
      retweet[Number(next.isRetweeted)].count++;

      const cityToUpdate = cities.find((city) => city.name === next.cityName);
      const { countryCode, countryName } = next.country;
      const countryToUpdate = countries.find((country) => country.code === countryCode);

      if (cityToUpdate) cityToUpdate.count++;
      else cities.push({ name: next.cityName, count: 1 });

      if (countryToUpdate) countryToUpdate.count++;
      else
        countries.push({
          name: countryName,
          code: countryCode,
          count: 1,
        });
    };

    list.forEach((tweet) => {
      const timestamp = new Date(tweet.created_at);
      const creationHour = timestamp.getHours();
      const creationDay = timestamp.getDay();
      const isGeolocalized = Boolean(tweet.coordinates || tweet.place);
      const isRetweeted = Boolean(tweet.retweeted_status);
      const cityName = (tweet.place || {}).name || 'Not known';
      const countryName = (tweet.place || {}).country || 'Not known';
      const countryCode = (tweet.place || {}).country_code || 'Not known';
      updateStats({
        creationHour,
        creationDay,
        isGeolocalized,
        isRetweeted,
        cityName,
        country: { countryName, countryCode },
      });
    });

    return stats;
  }, [list]);

  return (
    <div className={classes.container}>
      <Grid container justify="center">
        <Typography variant="h6" color="primary" align="center">
          Tweets volume by hour
        </Typography>
        <BarChart data={updatedStats.hours} />
      </Grid>

      <Grid container justify="center">
        <Typography variant="h6" color="primary" align="center">
          Tweets volume by day
        </Typography>
        <AreaChart data={updatedStats.days} />
      </Grid>
      <Grid container justify="center">
        <Typography variant="h6" color="primary" align="center">
          % of geolocalized tweets
        </Typography>
        <PieChart data={updatedStats.geolocalization} colors={['#1da1f2', '#00C49F']} />
      </Grid>

      <Grid container justify="center">
        <Typography variant="h6" color="primary" align="center">
          % of retweeted tweets
        </Typography>
        <PieChart data={updatedStats.retweet} colors={['#1da1f2', '#00C49F']} />
      </Grid>

      <Grid container justify="center">
        <Typography variant="h6" color="primary" align="center">
          Tweets country origin
        </Typography>
        <TableChart data={updatedStats.countries} header={['Country', 'Tweet No.']} />
      </Grid>

      <Grid container justify="center">
        <Typography variant="h6" color="primary" align="center">
          Tweets city origin
        </Typography>
        <TableChart data={updatedStats.cities} header={['City', 'Tweet No.']} />
      </Grid>
    </div>
  );
};

export default Graphs;
