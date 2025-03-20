export function parse(text:string,values:any,startDelimeter="{",endDelimeter="}"){
  // You recieved {comment.amount} money from {comment.link}
  let startIndex = 0;
  let endIndex = 1;
  let finalString = "";
  while(endIndex < text.length){
    if(text[startIndex] == startDelimeter){
      let endPoint = startIndex+2;
      while(text[endPoint] != endDelimeter){
        endPoint++;
      }
      let stringHoldingValue = text.slice(startIndex+1,endPoint);
      let keys = stringHoldingValue.split(".");
      let localValues = {
        ...values
      }
      for(let i=0;i<keys.length;i++){
        if(typeof localValues === "string"){
          localValues = JSON.parse(localValues);
        }
        localValues = localValues[keys[i]];
      }
      finalString = finalString + localValues;
      startIndex = endPoint+1;
      endIndex = endPoint+2;
    }
    else{
      finalString = finalString + text[startIndex];
      startIndex++;
      endIndex++;
    }
  }
  if(text[startIndex]){
    finalString+=text[startIndex];
  }
    return finalString
}
// let value=parse("my name is {comment.name} address is {comment.address} thanks",{
//   comment:{
//     name:"Rohit",
//     address:"Bangalore"
//   }
// })
// console.log(value)