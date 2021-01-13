import React, { useState, useLayoutEffect, useMemo, memo } from 'react';
import { Slider, makeStyles, Grid, useMediaQuery } from '@material-ui/core';

import ReactWordcloud from 'react-wordcloud';

import { WORDCLOUD_ID } from '../constants';

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

const defaultOptions = {
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

const getWordTooltip = (word) => `${word.text} (${word.value})`;

const WordCloud = ({ list }) => {
  const { slider } = useStyles();
  const [arrayOfWords, setArrayOfWords] = useState([]);
  const [numWords, setNumWords] = useState(20);
  const handleSlider = (_, newValue) => {
    setNumWords(newValue);
  };

  const isDarkTheme = useMediaQuery('(prefers-color-scheme: dark)');

  const options = useMemo(
    () => ({
      ...defaultOptions,
      colors: isDarkTheme
        ? ['#f6d7de', '#bed2f8', '#f8f8b0', '#77DD77', '#FFCBA5', '#B3EEFF']
        : ['#7AE4FF', '#F5A86C', '#7EE083', '#E07CA5'],
    }),
    [isDarkTheme]
  );

  useLayoutEffect(() => {
    if (list.length > 0) {
      const wordData = getWordList(list);
      const compressedData = collapse(wordData);
      setArrayOfWords(compressedData.slice(0, 100));
    } else {
      setArrayOfWords([]);
    }
  }, [list]);

  return (
    <Grid container style={{ width: '100%' }}>
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
        <div id={WORDCLOUD_ID}>
          <ReactWordcloud
            callbacks={{ getWordTooltip }}
            options={options}
            maxWords={numWords}
            words={arrayOfWords}
          />
        </div>
      </Grid>
    </Grid>
  );
};

export default memo(WordCloud);
