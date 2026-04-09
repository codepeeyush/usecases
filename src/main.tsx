import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { YourGPTProvider } from '@yourgpt/widget-web-sdk/react'
import './index.css'
import App from './App.tsx'

const yourGPTConfig = {
  widgetId: '39bed1c2-ea31-4186-817d-14dcbef0c734',
  debug: false,
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <YourGPTProvider config={yourGPTConfig}>
        <App />
      </YourGPTProvider>
    </BrowserRouter>
  </StrictMode>,
)
