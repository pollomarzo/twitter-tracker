import React, { useState, useEffect } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import { getName } from 'country-list';

const Graphs = ({ list }) => {
  const [hours, setHours] = useState([]);
  const [days, setDays] = useState([]);
  const [geo, setGeo] = useState([]);
  const [country, setCountry] = useState([]);
  const [city, setCity] = useState([]);
  const [region, setRegion] = useState([]);
  const [retweet, setRetweet] = useState([]);

  var hoursObject = [
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
  ];

  var daysObject = [
    { name: 'Mon', subject: 'Monday', count: 0 },
    { name: 'Tue', subject: 'Tuesday', count: 0 },
    { name: 'Wed', subject: 'Wednesday', count: 0 },
    { name: 'Thu', subject: 'Thursday', count: 0 },
    { name: 'Fri', subject: 'Friday', count: 0 },
    { name: 'Sat', subject: 'Saturday', count: 0 },
    { name: 'Sun', subject: 'Sunday', count: 0 },
  ];

  const geoObject = [
    { name: 'Yes', count: 0 },
    { name: 'No', count: 0 },
  ];

  const retweetObject = [
    { name: 'Yes', count: 0 },
    { name: 'No', count: 0 },
  ];

  function removeDupes(arr) {
    var result = {};
    var i = arr.length;
    while (i--) {
      if (result.hasOwnProperty(arr[i])) {
        result[arr[i]]++;
        arr.splice(i, 1);
      } else {
        result[arr[i]] = 1;
      }
    }
    return Object.keys(result).map(function (p) {
      if (p == 'Not geolocated') return { name: p, country: 'Not geolocated',  count: result[p] };
      else if (p.length == 2) return { name: getName(p), count: result[p] };
      else {
        var tmp = p.split('-')[0] == 'undefined' ? 'Unknown' : p.split('-')[0];
        return { name: tmp, country: getName(p.split('-')[1]), count: result[p] };
      }
    });
  }

  useEffect(() => {
    let nation = [];
    let cityName = [];
    let regionName = [];
    list.forEach((listElement) => {
      hoursObject.forEach((hourElement) => {
        if (listElement.created_at.substring(11, 13) === hourElement.name) {
          hourElement.count += 1;
        }
      });
      daysObject.forEach((dayElement) => {
        if (listElement.created_at.substring(0, 3) === dayElement.name) {
          dayElement.count += 1;
        }
      });
      if (
        (listElement.coordinates && listElement.coordinates.type === 'Point') ||
        (listElement.place && listElement.place.bounding_box)
      ) {
        geoObject[0].count += 1;
      } else {
        geoObject[1].count += 1;
      }
      if (listElement.place != null) {
        nation.push(listElement.place.country_code);
        cityName.push(listElement.place.name + '-' + listElement.place.country_code);
        regionName.push(
          listElement.place.full_name.split(',')[1] + '-' + listElement.place.country_code
        );
      } else {
        nation.push('Not geolocated');
        cityName.push('Not geolocated');
        regionName.push('Not geolocated');
      }
      if (listElement.retweeted_status) {
        retweetObject[0].count += 1;
      } else {
        retweetObject[1].count += 1;
      }
    });
    setHours(hoursObject);
    setDays(daysObject);
    setGeo(geoObject);
    setCountry(removeDupes(nation));
    setCity(removeDupes(cityName));
    setRegion(removeDupes(regionName));
    setRetweet(retweetObject);
  }, [list]);

  return (
    <div className="graphsContainer">
      <div className="infoArea">
        <h1 className="infoTitle">TOTAL TWEETS</h1>
        <div className="infoNumber">{list.length}</div>
      </div>
      <div className="graphArea">
        <h1 className="infoTitle">AMOUNT TWEETS BY HOURS</h1>
        <AreaChart width={700} height={300} data={hours}>
          <CartesianGrid strokeDasharray="1 1" />
          <XAxis dataKey="value" />
          <YAxis />
          <Tooltip />
          <Area type="monotone" dataKey="count" stroke="#1da1f2" fill="#1da1f2" />
        </AreaChart>
      </div>
      <div className="graphRadar">
        <h1 className="infoTitle">AMOUNT TWEETS BY DAYS</h1>
        <RadarChart width={700} height={300} data={days}>
          <PolarGrid />
          <PolarAngleAxis dataKey="subject" />
          <Tooltip />
          <Radar dataKey="count" stroke="#1da1f2" fill="#1da1f2" fillOpacity={0.6} />
        </RadarChart>
      </div>
      <div className="graphPie">
        <h1 className="infoTitle">TWEETS GEOLOCATED</h1>
        <PieChart width={700} height={300}>
          <Pie dataKey="count" isAnimationActive={false} data={geo} outerRadius={80} label >
            {
              geo.map((entry, index) => <Cell name={entry.name + ": " + ((geo[index].count / list.length)*100).toFixed(0)  + "%"} key={`cell-${index}`} key={`cell-${index}`} fill={['#1da1f2', '#00C49F'][index % 2]} />)
            }
          </Pie>
          <Tooltip />
          <Legend verticalAlign="top" height={36} iconSize={30} iconType="circle" />
        </PieChart>
      </div>
      <div className="graphPie" >
        <h1 className="infoTitle">TWEETS RE-TWEETED</h1>
        <PieChart width={700} height={300}>
          <Pie dataKey="count" isAnimationActive={false} data={retweet} outerRadius={80} label >
            {
              retweet.map((entry, index) => <Cell name={entry.name + ": " + ((retweet[index].count / list.length)*100).toFixed(0) + "%"} key={`cell-${index}`} fill={['#1da1f2', '#00C49F'][index % 2]} />)
            }
          </Pie>
          <Tooltip />
          <Legend verticalAlign="top" height={36} iconSize={30} iconType="circle" />
        </PieChart>
      </div>
      <div className="graphTable">
        <h1 className="infoTitle">COUNTRY STATS</h1>
        <div className="ag-theme-alpine" style={{ height: 400, width: 400 }}>
          <AgGridReact rowData={country}>
            <AgGridColumn field="name" sortable={true} filter={true}></AgGridColumn>
            <AgGridColumn field="count" sortable={true} filter={true}></AgGridColumn>
          </AgGridReact>
        </div>
      </div>
      <div className="graphTable">
        <h1 className="infoTitle">CITY STATS</h1>
        <div className="ag-theme-alpine" style={{ height: 400, width: 500 }}>
          <AgGridReact rowData={city}>
            <AgGridColumn field="name" sortable={true} filter={true}></AgGridColumn>
            <AgGridColumn field="country" sortable={true} filter={true}></AgGridColumn>
            <AgGridColumn field="count" sortable={true} filter={true}></AgGridColumn>
          </AgGridReact>
        </div>
      </div>
      <div className="graphTable">
        <h1 className="infoTitle">REGION STATS</h1>
        <div className="ag-theme-alpine" style={{ height: 400, width: 500 }}>
          <AgGridReact rowData={region}>
            <AgGridColumn field="name" sortable={true} filter={true}></AgGridColumn>
            <AgGridColumn field="country" sortable={true} filter={true}></AgGridColumn>
            <AgGridColumn field="count" sortable={true} filter={true}></AgGridColumn>
          </AgGridReact>
        </div>
    </div>
  </div>
  );
};

export default Graphs;
