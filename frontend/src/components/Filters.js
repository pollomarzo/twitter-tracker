import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
}));

const Filters = ({list, setList}) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState("");
  const [geolocation, setGeolocaton] = useState('');
  const [city, setCity] = useState('');
  const [citiesList, setCitiesList] = useState([]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const monthConvert = (numb) => {
    const text = ["empty", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    if (numb.startsWith("0")) numb = numb.split("0")[1]
    return text[parseInt(numb)]
  }

  const handleFilter = () => {
    var tmp = list
    //list.forEach(element => console.log(element.created_at.substring(8, 10), element.created_at.substring(4, 7), element.created_at.substring(26, 30) ))
    if (date !== "") tmp = list.filter(element => (element.created_at.substring(8, 10) === date.split("-")[2] && element.created_at.substring(4, 7) === monthConvert(date.split("-")[1]) && element.created_at.substring(26, 30) === date.split("-")[0]))
    if (geolocation === "Yes") tmp = list.filter(element => (element.coordinates && element.coordinates.type === 'Point') ||(element.place && element.place.bounding_box))
    else if (geolocation === "No") {
      var noGeolocation = list.filter(element => (element.coordinates && element.coordinates.type === 'Point') ||(element.place && element.place.bounding_box))
      tmp = list.filter(element => !noGeolocation.includes(element))
    }
    if (city !== "") tmp = tmp.filter(element => (element.place.full_name).split(",")[0] === city)
    setList(tmp)
    setOpen(false);
  }

  useEffect(() => {
    var citiesListArray = []
    list.forEach(element => { citiesListArray.push((element.place.full_name).split(",")[0]) });
    setCitiesList(citiesListArray.filter(function(item, pos) {return citiesListArray.indexOf(item) === pos;}))
  }, [list])

  return (
    <div>
      <Button onClick={handleClickOpen}>Open select dialog</Button>
      <Dialog disableBackdropClick disableEscapeKeyDown open={open} onClose={handleClose}>
        <DialogTitle>Fill the form</DialogTitle>
        <DialogContent>
          <form className={classes.container}>
            <FormControl key={"dataKey"} className={classes.formControl}>
              <TextField
                  id="date"
                  label="Date"
                  type="date"
                  className={classes.textField}
                  value={date}
                  onChange={event => setDate(event.target.value)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
            </FormControl>
            <FormControl key={"geoKey"} className={classes.formControl}>
              <InputLabel id="geolocationLabel">Geolocation</InputLabel>
              <Select labelId="geolocationLabel" value={geolocation} onChange={(event) => setGeolocaton(event.target.value)} input={<Input />} >
                <MenuItem value=""> <em>None</em> </MenuItem>
                <MenuItem value="Yes">Yes</MenuItem>
                <MenuItem value="No">No</MenuItem>
              </Select>
            </FormControl>
            <FormControl key={"cityKey"} className={classes.formControl}>
              <InputLabel id="cityLabel">City</InputLabel>
              <Select labelId="cityLabel" value={city} onChange={(event) => setCity(event.target.value)} input={<Input />}>
                <MenuItem value=""> <em>None</em> </MenuItem>
                {citiesList.map(element => { return <MenuItem value={element}>{element}</MenuItem>})}
              </Select>
            </FormControl>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleFilter} color="primary">
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}


export default Filters;