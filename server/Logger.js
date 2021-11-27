module.exports={
  log: (severityLevel, ...messages)=>{
    let type = (severityLevel ===0)?'INFO':'ERROR';

    console.log(type+': ', ...messages);
  }
};