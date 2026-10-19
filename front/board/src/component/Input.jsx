import React from "react";

function Input(info){
  return (
      <input type={info.type} placeholder={info.placeholder} />
  )
}

export default Input;