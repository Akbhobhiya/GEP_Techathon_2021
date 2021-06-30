import React from "react";
import $ from 'jquery';
import ReactTagInput from "@pathofdev/react-tag-input";

function getInput(){
  
}

function InputTag(props) {
  const [tags, setTags] = React.useState(["Software Development Engineer"]);
  return (
    <ReactTagInput 
      tags={tags} 
      onChange={ (newTags) => {
        // console.log(newTags,"new tags from child");
        console.log(props,"props")
        props.parentCallback(newTags);
        setTags(newTags);
      } }
      class = "input-tag"
    />
  )
}

export default InputTag;
