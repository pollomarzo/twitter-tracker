import React, { useState, useMemo } from 'react';
import { Button, Grid, MenuItem, makeStyles } from '@material-ui/core';
import { InputField, SelectField } from './InputComponent';

const useStyles = makeStyles((theme) => ({
  genericInput: {
    height: 50,
    width: 150,
    marginBottom: 20,
  },
}));

const Filters = ({ list, setFilteredList }) => {
  const [filters, setFilters] = useState({});
  const { genericInput } = useStyles();

  const specificInputFieldProps = {
    shrink: true,
    style: { color: 'white' },
  };

  const onChangeFilter = (e) => {
    console.log(typeof e.target.value);
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const { countryList, cityList } = useMemo(() => {
    const countryList = list.reduce((accList, tweet) => {
      if (tweet.place && !accList.includes(tweet.place.country_code))
        accList.push(tweet.place.country_code);
      return accList;
    }, []);

    const cityList = list.reduce((accList, tweet) => {
      if (tweet.place && !accList.includes(tweet.place.name))
        accList.push(tweet.place.name);
      return accList;
    }, []);

    return { countryList, cityList };
  }, [list]);

  const applyFilter = () => {
    const { minDate, maxDate, minTime, maxTime, geoloc, country, city } = filters;
    const filteredTweets = list.filter((tweet) => {
      const timestamp = new Date(tweet.created_at);
      const minTimestamp = new Date(`${minDate} ${minTime || '00:00'}`);
      const maxTimestamp = new Date(`${maxDate} ${maxTime || '23:59'}`);
      const isGeolocalized = tweet.user.geo_enabled;
      const cityName = (tweet.place || {}).name;
      const countryCode = (tweet.place || {}).country_code;

      return (
        (isNaN(minTimestamp) ? true : timestamp >= minTimestamp) &&
        (isNaN(maxTimestamp) ? true : timestamp <= maxTimestamp) &&
        (geoloc === '' ? true : geoloc === isGeolocalized) &&
        (country === '' ? true : country === countryCode) &&
        (city === '' ? true : city === cityName)
      );
    });
    setFilteredList(filteredTweets);
  };

  return (
    <>
      <Grid container xs={12} justify="space-evenly">
        <InputField
          type="date"
          label="Min date"
          fieldName="minDate"
          value={filters.minDate}
          className={genericInput}
          onChange={onChangeFilter}
          InputLabelProps={specificInputFieldProps}
        />
        <InputField
          type="date"
          label="Max date"
          fieldName="maxDate"
          value={filters.maxDate}
          className={genericInput}
          onChange={onChangeFilter}
          InputLabelProps={specificInputFieldProps}
        />
        <InputField
          type="time"
          label="Min time"
          fieldName="minTime"
          value={filters.minTime}
          className={genericInput}
          onChange={onChangeFilter}
          InputLabelProps={specificInputFieldProps}
        />
        <InputField
          type="time"
          label="Max time"
          fieldName="maxTime"
          value={filters.maxTime}
          className={genericInput}
          onChange={onChangeFilter}
          InputLabelProps={specificInputFieldProps}
        />
      </Grid>

      <Grid container xs={12} justify="space-evenly">
        <SelectField
          id="geoloc"
          label="Geolocalization"
          value={filters.geolocation}
          onChange={onChangeFilter}
        >
          <MenuItem value={true}>Yes</MenuItem>
          <MenuItem value={false}>No</MenuItem>
        </SelectField>

        <SelectField
          id="country"
          label="Country"
          value={filters.countries}
          onChange={onChangeFilter}
        >
          {countryList.map((element) => {
            return <MenuItem value={element}>{element}</MenuItem>;
          })}
        </SelectField>

        <SelectField
          id="city"
          label="City"
          value={filters.cities}
          onChange={onChangeFilter}
        >
          {cityList.map((element) => {
            return <MenuItem value={element}>{element}</MenuItem>;
          })}
        </SelectField>
      </Grid>
      <Grid container xs={12} justify="space-evenly">
        <Button color="primary" variant="contained" onClick={applyFilter}>
          Apply
        </Button>
        <Button
          color="primary"
          variant="contained"
          onClick={() => {
            setFilters({});
            setFilteredList(list);
          }}
        >
          Reset
        </Button>
      </Grid>
    </>
  );
};

export default Filters;
