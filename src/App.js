// App.js
import React from 'react';
import HierarchyChart from './Tree';
import './index.css'

const treeData = {
  name: 'John Doe',
  children: [
    {
      name: 'iPhone',
      children: [
        {
          name: '4',
        },
        {
          name: '5',
        },
      ],
    },
    {
      name: 'Mac',
      children: [
        {
          name: '1',
        },
        {
          name: '2',
        },
      ],
    },
    {
      name: 'Windows',
      children: [
        {
          name: '3',
        },
      ],
    },
  ],
};

const App = () => {

  return (
      <HierarchyChart
        data={treeData}
      />
  );
};

export default App;
