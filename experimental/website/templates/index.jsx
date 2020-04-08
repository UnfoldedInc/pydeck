import React from 'react';
import {Home} from 'gatsby-theme-ocular/components';
// import GLTFExample from './example-gltf';
import styled from 'styled-components';

if (typeof window !== 'undefined') {
  window.website = true;
}

const Bullet = styled.li`
  background: url(images/icon-high-precision.svg) no-repeat left top;
  list-style: none;
  max-width: 540px;
  padding: 8px 0 12px 42px;
  font: ${props => props.theme.typography.font300};
`;

const HeroExample = () => <div>Add Example</div>;

// <GLTFExample panel={false} />

export default class IndexPage extends React.Component {
  render() {
    return (
      <Home HeroExample={HeroExample} >
        <ul>
          <Bullet>
            GPU powered geospatial visualizations for Python.
          </Bullet>
          <Bullet>
            Data Science made easy.
          </Bullet>
          <Bullet>
            All the power of deck.gl right in your Jupyter Notebo=ok.
          </Bullet>
        </ul>
      </Home>
    );
  }
}
