import React, { useState, useMemo } from 'react';
import { Button, Grid, MenuItem, makeStyles } from '@material-ui/core';
import { InputField, SelectField } from './InputComponent';

const useStyles = makeStyles((theme) => ({
  genericInput: {
    height: 50,
    width: 200,
    marginBottom: 20,
  },
  button: { padding: 10, fontWeight: 800, color: 'white' },
}));

const Filters = ({ list, setFilteredList }) => {
  const [filters, setFilters] = useState({});
  const { genericInput, button } = useStyles();

  const specificInputFieldProps = {
    shrink: true,
    style: { color: 'white' },
  };

  const onChangeFilter = (e) =>
    setFilters({ ...filters, [e.target.name]: e.target.value });

  const { countryList, cityList } = useMemo(() => {
    const countries = list.reduce((accList, tweet) => {
      if (tweet.place && !accList.includes(tweet.place.country_code))
        accList.push(tweet.place.country_code);
      return accList;
    }, []);

    const cities = list.reduce((accList, tweet) => {
      if (tweet.place && !accList.includes(tweet.place.name))
        accList.push(tweet.place.name);
      return accList;
    }, []);

    return { countryList: countries, cityList: cities };
  }, [list]);

  const applyFilter = () => {
    const { minDate, maxDate, minTime, maxTime, geoloc, country, city } = filters;
    const filteredTweets = list.filter((tweet) => {
      const timestamp = new Date(tweet.created_at);
      const minTimestamp = minDate && new Date(`${minDate} ${minTime || '00:00'}`);
      const maxTimestamp = maxDate && new Date(`${maxDate} ${maxTime || '23:59'}`);
      const isGeolocalized = Boolean(tweet.coordinates || tweet.place);
      const cityName = (tweet.place || {}).name;
      const countryCode = (tweet.place || {}).country_code;

      return (
        (!minTimestamp ? true : timestamp >= minTimestamp) &&
        (!maxTimestamp ? true : timestamp <= maxTimestamp) &&
        (geoloc === undefined ? true : geoloc === isGeolocalized) &&
        (!country ? true : country === countryCode) &&
        (!city ? true : city === cityName)
      );
    });

    setFilteredList(filteredTweets);
  };

  return (
    <>
      <Grid container justify="space-evenly">
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

      <Grid container justify="space-evenly">
        <SelectField
          id="geoloc"
          label="Geolocalization"
          value={filters.geoloc}
          onChange={onChangeFilter}
        >
          <MenuItem value={true}>Yes</MenuItem>
          <MenuItem value={false}>No</MenuItem>
        </SelectField>

        <SelectField
          id="country"
          label="Country"
          value={filters.country}
          onChange={onChangeFilter}
        >
          {countryList.map((element, index) => {
            return (
              <MenuItem key={index} value={element}>
                {element}
              </MenuItem>
            );
          })}
        </SelectField>

        <SelectField
          id="city"
          label="City"
          value={filters.city}
          onChange={onChangeFilter}
        >
          {cityList.map((element, index) => {
            return (
              <MenuItem key={index} value={element}>
                {element}
              </MenuItem>
            );
          })}
        </SelectField>
      </Grid>
      <Grid container justify="space-evenly">
        <Button
          color="primary"
          variant="contained"
          onClick={applyFilter}
          className={button}
          disabled={!Object.values(filters).length}
        >
          Apply
        </Button>
        <Button
          color="primary"
          variant="contained"
          onClick={() => {
            setFilters({});
            setFilteredList(list);
          }}
          className={button}
        >
          Reset
        </Button>
      </Grid>
    </>
  );
};

export default Filters;
