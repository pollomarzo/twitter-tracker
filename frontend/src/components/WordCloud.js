import React, { useState, useEffect } from 'react';
import ReactWordcloud from 'react-wordcloud';
import 'tippy.js/themes/light.css';

const WordCloud = ({ list }) => {
  const [arrayOfWords, setArrayOfWords] = useState([]);

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
    const wordData = getWordList(list);
    const compressedData = collapse(wordData);
    setArrayOfWords(compressedData);
  }, [list]);

  const options = {
    colors: ['blue', '#2F4F4F', '#011f4b', '#03396c', '#008080', '#05E9FF', '#525C65'],
    enableTooltip: true,
    deterministic: false,
    fontFamily: 'impact',
    fontSizes: [15, 60],
    fontStyle: 'normal',
    fontWeight: 'normal',
    padding: 5,
    rotations: 3,
    rotationAngles: [0, 90],
    spiral: 'archimedean',
    transitionDuration: 1000,
    tooltipOptions: {
      theme: 'light'
    }
  };

  const getWordTooltip = (word) => `${word.text} (${word.value})`;

  return (
    <div className="wordCloud">
      <ReactWordcloud
        callbacks={{ getWordTooltip }}
        options={options}
        maxWords={5}
        words={arrayOfWords}
      />
    </div >
  );
};

export default WordCloud;
