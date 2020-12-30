import React, { useState, useEffect } from 'react';
import { Slider, makeStyles, Grid } from '@material-ui/core';
import ReactWordcloud from 'react-wordcloud';

import 'tippy.js/dist/tippy.css';
import 'tippy.js/themes/material.css';

const useStyles = makeStyles(() => ({
  slider: {
    width: '80%',
    marginTop: 40,
    marginLeft: 70,
  },
}));

const WordCloud = ({ list }) => {
  const { slider } = useStyles();
  const [arrayOfWords, setArrayOfWords] = useState([]);
  const [numWords, setNumWords] = useState(7);
  const handleSlider = (event, newValue) => {
    setNumWords(newValue);
  };

  const collapse = (toCollapse) => {
    const collapsed = [];
    toCollapse.split(' ').forEach((item) => {
      const index = collapsed.findIndex((element) => element.text === item);
      if (index !== -1) collapsed[index].value += 1;
      else collapsed.push({ text: item, value: 1 });
    });
    return collapsed;
  };

  useEffect(() => {
    const getWordList = () => {
      let listOfWord = '';
      let accumulator = '';
      // Create an agglomerate with all the text from the list
      list.forEach((item) => (accumulator += `${item.text} `));
      accumulator = accumulator.split(' ');
      // Separate every word in the conglomerate and purges links
      accumulator.forEach((word) => {
        if (!word.startsWith('http')) listOfWord += `${word.toLowerCase()} `;
      });
      return listOfWord;
    };
    const wordData = getWordList();
    const compressedData = collapse(wordData);
    setArrayOfWords(compressedData);
  }, [list]);

  const options = {
    colors: ['blue', '#1DA1F2', '#011f4b', '#03396c', '#008080', '#05E9FF', '#3434eb'],
    enableTooltip: true,
    deterministic: true,
    fontFamily: 'Helvetica',
    fontSizes: [15, 70],
    fontStyle: 'normal',
    fontWeight: 'bold',
    rotations: 0,
    transitionDuration: 1000,
    tooltipOptions: { theme: 'material' },
  };

  const getWordTooltip = (word) => `${word.text} (${word.value})`;

  return (
    <Grid container>
      <Grid item xs={12}>
        <Slider
          color="secondary"
          valueLabelDisplay="on"
          className={slider}
          onChange={handleSlider}
          value={numWords}
          max={100}
          min={1}
          marks={[ 
            {value: 1, label: 'Sola una parola'},
            {value: 100, label: '100 parole'},
          ]}
        />
      </Grid>
      <Grid item xs={12}>
        <ReactWordcloud
          callbacks={{ getWordTooltip }}
          options={options}
          maxWords={numWords}
          words={arrayOfWords}
        />
      </Grid>
    </Grid>
  );
};

export default WordCloud;
