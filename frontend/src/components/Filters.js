import React, { useEffect, useState } from 'react';
import {
  makeStyles,
  TextField,
  Button,
  InputLabel,
  Input,
  MenuItem,
  Select,
} from '@material-ui/core';
import { getName } from 'country-list';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
  formControl: {
    margin: theme.spacing(1),
    marginBottom: theme.spacing(3),
    marginTop: theme.spacing(3),
    height: 50,
    width: 120,
    multilineColor: {
      color: 'white',
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: 'white',
    },
  },
  submitButton: {
    margin: 10,
    width: 100,
    fontWeight: 800,
    color: 'white',
    backgroundColor: '#1DA1F2',
    '&:hover': {
      backgroundColor: 'lightblue',
      color: '#1DA1F2',
    },
  },
  title: {
    alignSelf: 'center',
    color: 'white',
  },
  button: {
    color: 'white',
  },
  multilineColor: {
    color: 'white',
  },
}));

const Filters = ({ list, setList }) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [minDate, setMinDate] = useState('');
  const [maxDate, setMaxDate] = useState('');
  const [minTime, setMinTime] = useState('');
  const [maxTime, setMaxTime] = useState('');
  const [geolocation, setGeolocaton] = useState('');
  const [country, setCountry] = useState('');
  const [countryList, setCountryList] = useState([]);
  const [city, setCity] = useState('');
  const [citiesList, setCitiesList] = useState([]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const monthConvert = (month) => {
    const text = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    var numb = (text.indexOf(month) + 1).toString();
    if (numb.length === 1) numb = '0' + numb;
    return numb;
  };

  const handleFilter = () => {
    var tmp = list;
    var tmpList = [];
    if (minDate !== '') {
      tmpList = [];
      tmp.forEach((element) => {
        var year = element.created_at.substring(26, 30);
        var month = monthConvert(element.created_at.substring(4, 7));
        var day = element.created_at.substring(8, 10);
        if (year > minDate.split('-')[0]) tmpList.push(element);
        else if (year === minDate.split('-')[0]) {
          if (month > minDate.split('-')[1]) tmpList.push(element);
          else if (month === minDate.split('-')[1]) {
            if (day >= minDate.split('-')[2]) tmpList.push(element);
          }
        }
      });
      tmp = tmpList;
    }
    if (maxDate !== '') {
      tmpList = [];
      tmp.forEach((element) => {
        var year = element.created_at.substring(26, 30);
        var month = monthConvert(element.created_at.substring(4, 7));
        var day = element.created_at.substring(8, 10);
        if (year < maxDate.split('-')[0]) tmpList.push(element);
        else if (year === maxDate.split('-')[0]) {
          if (month < maxDate.split('-')[1]) tmpList.push(element);
          else if (month === maxDate.split('-')[1]) {
            if (day <= maxDate.split('-')[2]) tmpList.push(element);
          }
        }
      });
      tmp = tmpList;
    }
    if (minTime !== '') {
      tmpList = [];
      tmp.forEach((element) => {
        var hourTweet = element.created_at.substring(11, 13);
        var minuteTweet = element.created_at.substring(14, 16);
        if (hourTweet > minTime.split(':')[0]) tmpList.push(element);
        else if (hourTweet === minTime.split(':')[0]) {
          if (minuteTweet >= minTime.split(':')[1]) tmpList.push(element);
        }
      });
      tmp = tmpList;
    }
    if (maxTime !== '') {
      tmpList = [];
      tmp.forEach((element) => {
        var hourTweet = element.created_at.substring(11, 13);
        var minuteTweet = element.created_at.substring(14, 16);
        if (hourTweet < maxTime.split(':')[0]) tmpList.push(element);
        else if (hourTweet === maxTime.split(':')[0]) {
          if (minuteTweet <= maxTime.split(':')[1]) tmpList.push(element);
        }
      });
      tmp = tmpList;
    }
    if (geolocation === 'Yes')
      tmp = tmp.filter(
        (element) =>
          (element.coordinates && element.coordinates.type === 'Point') ||
          (element.place && element.place.bounding_box)
      );
    else if (geolocation === 'No') {
      var noGeolocation = tmp.filter(
        (element) =>
          (element.coordinates && element.coordinates.type === 'Point') ||
          (element.place && element.place.bounding_box)
      );
      tmp = tmp.filter((element) => !noGeolocation.includes(element));
    }
    if (city !== '') {
      tmp = tmp.filter(
        (element) =>
          (element.coordinates && element.coordinates.type === 'Point') ||
          (element.place && element.place.bounding_box)
      );
      if (city === 'Unknown') tmp = tmp.filter((element) => element.place.name === '');
      else tmp = tmp.filter((element) => element.place.name === city);
    }
    if (country !== '') {
      tmp = tmp.filter(
        (element) =>
          (element.coordinates && element.coordinates.type === 'Point') ||
          (element.place && element.place.bounding_box)
      );
      if (country === 'Unknown')
        tmp = tmp.filter((element) => element.place.country_code === '');
      else tmp = tmp.filter((element) => getName(element.place.country_code) === country);
    }
    setList(tmp);
    setOpen(false);
  };

  useEffect(() => {
    var tmp = [];
    var citiesListArray = [];
    list.forEach((element) => {
      if (element.place !== null) {
        if (element.place.name === '') citiesListArray.push('Unknown');
        else citiesListArray.push(element.place.name);
      }
    });
    tmp = citiesListArray.filter(function (item, pos) {
      return citiesListArray.indexOf(item) === pos;
    });
    setCitiesList(tmp.sort());
    var countriesListArray = [];
    list.forEach((element) => {
      if (element.place !== null) {
        if (element.place.country_code === '') countriesListArray.push('Unknown');
        else countriesListArray.push(getName(element.place.country_code));
      }
    });
    tmp = countriesListArray.filter(function (item, pos) {
      return countriesListArray.indexOf(item) === pos;
    });
    setCountryList(tmp.sort());
  }, [list]);

  return (
    <>
      <TextField
        id="date"
        type="date"
        label="Min date"
        value={minDate}
        className={classes.button}
        onChange={(event) => setMinDate(event.target.value)}
        InputProps={{ className: classes.multilineColor }}
        InputLabelProps={{
          shrink: true,
          style: { color: 'white' },
        }}
      />
      <TextField
        id="date"
        type="date"
        label="Max date"
        value={maxDate}
        className={classes.button}
        onChange={(event) => setMaxDate(event.target.value)}
        InputProps={{ className: classes.multilineColor }}
        InputLabelProps={{
          shrink: true,
          style: { color: 'white' },
        }}
      />
      <TextField
        id="minTime"
        label="Min time"
        type="time"
        value={minTime}
        className={classes.button}
        onChange={(event) => setMinTime(event.target.value)}
        InputProps={{ className: classes.multilineColor }}
        InputLabelProps={{
          shrink: true,
          style: { color: 'white' },
        }}
      />
      <TextField
        id="maxTime"
        label="Max time"
        type="time"
        value={maxTime}
        className={classes.button}
        onChange={(event) => setMaxTime(event.target.value)}
        InputProps={{ className: classes.multilineColor }}
        InputLabelProps={{
          shrink: true,
          style: { color: 'white' },
        }}
      />
      <InputLabel id="geolocationLabel" className={classes.button}>
        Geolocation
      </InputLabel>
      <Select
        labelId="geolocationLabel"
        value={geolocation}
        onChange={(event) => setGeolocaton(event.target.value)}
        inputProps={{ className: classes.multilineColor }}
        input={<Input />}
      >
        <MenuItem value="">-----</MenuItem>
        <MenuItem value="Yes">Yes</MenuItem>
        <MenuItem value="No">No</MenuItem>
      </Select>
      <InputLabel id="countryLabel" className={classes.button}>
        Country
      </InputLabel>
      <Select
        labelId="countryLabel"
        value={country}
        onChange={(event) => setCountry(event.target.value)}
        inputProps={{ className: classes.multilineColor }}
        input={<Input />}
      >
        <MenuItem value="">-----</MenuItem>
        {countryList.map((element) => {
          return <MenuItem value={element}>{element}</MenuItem>;
        })}
      </Select>
      <InputLabel id="cityLabel" className={classes.button}>
        City
      </InputLabel>
      <Select
        labelId="cityLabel"
        value={city}
        onChange={(event) => setCity(event.target.value)}
        inputProps={{ className: classes.multilineColor }}
        input={<Input />}
      >
        <MenuItem value="">-----</MenuItem>
        {citiesList.map((element) => {
          return <MenuItem value={element}>{element}</MenuItem>;
        })}
      </Select>
      <Button onClick={handleClose} className={classes.button}>
        Cancel
      </Button>
      <Button onClick={handleFilter} className={classes.button}>
        Ok
      </Button>
    </>
  );
};

export default Filters;
