// App.js
import React from 'react';
import HierarchyChart from './Tree';
import './index.css'

// const treeData = {
//   name: 'John Doe',
//   children: [
//     {
//       image: 'https://www.rockethub.com/wp-content/uploads/2022/07/hubspot-logo.jpg',
//       children: [
//         {
//           image: 'https://www.rockethub.com/wp-content/uploads/2022/07/hubspot-logo.jpg',
//         },
//         {
//           name: '5',
//         },
//       ],
//     },
//     {
//       name: 'Mac',
//       children: [
//         {
//           name: '1',
//         },
//         {
//           name: '2',
//         },
//       ],
//     },
//     {
//       name: 'Windows',
//       children: [
//         {
//           name: '3',
//         },
//       ],
//     },
//   ],
// };

const treeData = {
  name: "John Doe",
  children: [
    {
      name: "Hubspot",
      image:
        "https://www.rockethub.com/wp-content/uploads/2022/07/hubspot-logo.jpg",
      children: [
        {
          name: "hubspot-iPhone",
          image: "https://static.thenounproject.com/png/1314324-200.png",
        },
        {
          name: "hub-Mac",
          image: "https://cdn-icons-png.flaticon.com/512/657/657109.png",
        },
        {
          name: "hub-Windows",
          image:
            "https://icones.pro/wp-content/uploads/2022/03/icone-pc-ordinateur-et-ordinateur-portable.png",
        },
        
      ],
    },
    {
      name: "Github",
      image:
        "https://github.githubassets.com/assets/GitHub-Mark-ea2971cee799.png",
      children: [
        {
          name: "Github-iPhone",
          image: "https://static.thenounproject.com/png/1314324-200.png",
        },
        {
          name: "Github-Mac",
          image: "https://cdn-icons-png.flaticon.com/512/657/657109.png",
        },
      ],
    },
    {
      name: "Copilot",
      image:
        "https://cdn1.iconfinder.com/data/icons/google_jfk_icons_by_carlosjj/512/chrome.png",
      children: [
        {
          name: "Copilot-iPhone",
          image: "https://static.thenounproject.com/png/1314324-200.png",
        },
        {
          name: "Copilot-Mac",
          image: "https://cdn-icons-png.flaticon.com/512/657/657109.png",
        },
        {
          name: "Copilot-Windows",
          image:
            "https://icones.pro/wp-content/uploads/2022/03/icone-pc-ordinateur-et-ordinateur-portable.png",
        },
      ],
    },
    {
      name: "Atlassian",
      image:
        "https://cdn.icon-icons.com/icons2/2407/PNG/512/atlassian_icon_146225.png",
      children: [
        {
          name: "at-Mac",
          image: "https://cdn-icons-png.flaticon.com/512/657/657109.png",
        },
        {
          name: "at-Windows",
          image:
            "https://icones.pro/wp-content/uploads/2022/03/icone-pc-ordinateur-et-ordinateur-portable.png",
        },
        {
          name: "at-iPhone",
          image: "https://static.thenounproject.com/png/1314324-200.png",
        },
      ],
    },
    {
      name: "New1",
      image:
        "https://cdn.icon-icons.com/icons2/2407/PNG/512/atlassian_icon_146225.png",
      children: [
        {
          name: "new-Mac",
          image: "https://cdn-icons-png.flaticon.com/512/657/657109.png",
        },
        {
          name: "new-Windows",
          image:
            "https://icones.pro/wp-content/uploads/2022/03/icone-pc-ordinateur-et-ordinateur-portable.png",
        },
        {
          name: "new-iPhone",
          image: "https://static.thenounproject.com/png/1314324-200.png",
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
