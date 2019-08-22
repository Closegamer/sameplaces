import React from 'react';

// import Intro from './components/Intro';
import Playground from './components/Playground';

function Page(props) {
  return (
    <React.Fragment>
      {/* <Intro /> */}
      <Playground />
    </React.Fragment>
  );
}

Page.propTypes = {};

export default Page;
