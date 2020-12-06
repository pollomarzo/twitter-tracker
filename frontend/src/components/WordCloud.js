import React, { useEffect, useState } from 'react';
import ReactWordcloud from 'react-wordcloud';


const WordCloud = ({ list }) => {
  const [arrayOfWords, setArrayOfWords] = useState([]);


  function httpCase(str) {
    var listOfWord = ""
    var tmp = ""
    var i
    for( i = 0; i < list.length; i++){
      tmp = tmp + list[i].text + " "
    }
    var splitStr = tmp.split(" ");
    for (i = 0; i < splitStr.length; i++) {
      if(!(splitStr[i].startsWith("http"))){
        listOfWord = listOfWord + splitStr[i].toLowerCase() + " "
      }
    }
    return listOfWord
  }

  function tweetsToText(str) {
    var arrayOfObject = []
    var index 
    var splitStr = str.split(" ");
    splitStr.forEach((element) => {
      index = arrayOfObject.findIndex( s => s.text === element)
      if (index !== -1){
          arrayOfObject[index] = ({text: element, value: arrayOfObject[index].value+1})
      }
      else  arrayOfObject.push({text: element, value: 1})   
    })
    return arrayOfObject;
  }



  useEffect(()=>{
    var tmp = httpCase(list)
    console.log(tmp)
    var tmp2 = tweetsToText(tmp)
    setArrayOfWords(tmp2)
    console.log(arrayOfWords)  
  }, [list])

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
    getWordTooltip: word => `${word.text} (${word.value})`,
  };


  return (
    <div className="wordCloud">
      <ReactWordcloud
        id="wordCloud"
        callbacks={callbacks}
        options={options}
        words={arrayOfWords}
      />
    </div>
  )
};



export default WordCloud;

