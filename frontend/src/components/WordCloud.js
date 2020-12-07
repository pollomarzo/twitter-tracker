import React, { useMemo } from 'react';
import ReactWordcloud from 'react-wordcloud';


const WordCloud = ({ list }) => {
  const wordsList = useMemo(() => {
    const uniqueWord = [];
    list.forEach(tweet => {
      tweet.text.toLowerCase().split(" ").forEach(word => {
        const collision = uniqueWord.find(item => item.word === word);
        if (collision)
          collision.occurrencies++;
        else 
          uniqueWord.push({ word, occurrencies: 1})
      })});
    return uniqueWord;
  }, [list]);

  const options = {
    colors: ["blue", "#2F4F4F", "#011f4b", "#03396c", "#008080", "#05E9FF", '#525C65'],
    enableTooltip: true,
    deterministic: false,
    fontFamily: "impact",
    fontSizes: [15, 40],
    fontStyle: "normal",
    fontWeight: "normal",
    padding: 1,
    rotations: 3,
    rotationAngles: [0, 90],
    spiral: "archimedean",
    transitionDuration: 1500
  };

  const callbacks = {
    getWordTooltip: word => `${word.text} (${word.occurrencies})`,
  };


  return (
    <div className="wordCloud">
      <ReactWordcloud
        id="wordCloud"
        callbacks={callbacks}
        options={options}
        words={wordsList}
      />
    </div>
  )
};



export default WordCloud;