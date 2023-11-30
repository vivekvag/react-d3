import React from 'react'
import ReactDOM from 'react-dom/client'
import ParentSize from '@visx/responsive/lib/components/ParentSize';
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
     <ParentSize>{({ width, height }) => <App width={width} height={height} />}</ParentSize>
  </React.StrictMode>,
)
