import React from 'react';


/***
 * A component shown when the user tries to access content he/she is
 * not authorized for
 */
export default function Forbidden(){
  return (
    <>
      <div>
        <br/>
        <img src="/lock.png" style={{maxWidth:'40%'}}/>
        <br/>
        <h1>Access to this content is restricted or the operation was unauthorized:\</h1>
      </div>
    </>
  );
}