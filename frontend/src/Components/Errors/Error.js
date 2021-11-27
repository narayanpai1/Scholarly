import React from 'react';

/***
 * A component shown in '/error' route.
 * 
 * Whenever any error is encountered, the user is directed to this page.
 * It will mostly be due to not being authorized for a task.
 */
export default function Error() {
  return (
    <>
      <div>
        <br />
        <br />
        <h1>Some Error occurred :\</h1>
        <h3> Either you are unauthorized or it is our fault</h3>
      </div>
    </>
  );
}
