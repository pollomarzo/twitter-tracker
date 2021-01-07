import React, { useState, useLayoutEffect, useEffect} from 'react';
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

const collapse = (toCollapse) => {
  const collapsed = [];
  toCollapse.split(' ').forEach((item) => {
    const index = collapsed.findIndex((element) => element.text === item);
    if (index !== -1) collapsed[index].value += 1;
    else collapsed.push({ text: item, value: 1 });
  });
  return collapsed.sort((a, b) => b.value - a.value);
};

const getWordList = (list) => {
  let listOfWord = '';
  let accumulator = '';
  // Create an agglomerate with all the text from the list
  list.forEach((item) => (accumulator += `${item.text} `));
  accumulator = accumulator.split(' ');
  // Separate every word in the conglomerate and purges links
  accumulator.forEach((word) => {
    if (!word.startsWith('http') || !word.startsWith('@'))
      listOfWord += `${word.toLowerCase()} `;
  });
  return listOfWord;
};

const WordCloud = ({ list }) => {
  const { slider } = useStyles();
  const [arrayOfWords, setArrayOfWords] = useState([]);
  const [numWords, setNumWords] = useState(20);
  const handleSlider = (_, newValue) => {
    setNumWords(newValue);
  };

  const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const [colorWords, setColorWords] = useState([]);


  useEffect(() => {
    if (prefersDarkMode) setColorWords(['#9FFCDF', '#D4DCFF', '#7D83FF', '#590925', '#1AFFD5'])
    else setColorWords(['#447604', '#007FFF', '#47624F', '#6CC551', '#52AD9C'])
  }, [prefersDarkMode])


  const options = {
    colors: colorWords,
    enableTooltip: true,
    enableOptimizations: true,
    deterministic: false,
    fontFamily: 'Helvetica',
    fontSizes: [15, 70],
    fontStyle: 'normal',
    fontWeight: 'bold',
    rotations: 0,
    transitionDuration: 1000,
    tooltipOptions: { theme: 'material' },
  };


  useLayoutEffect(() => {
    if (list.length > 0) {
      const wordData = getWordList(list);
      const compressedData = collapse(wordData);
      setArrayOfWords(compressedData.slice(0, 100));
    } else {
      setArrayOfWords([]);
    }
  }, [list]);

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
            { value: 1, label: 'Sola una parola' },
            { value: 100, label: '100 parole' },
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
