import './view/styles/tailwind.scss';
import './view/styles/global.scss';
import 'react-nested-dropdown/dist/styles.css';

import React from 'react';
import { createRoot } from 'react-dom/client';

import { App } from './view/components/App';

export const CONTAINER_SELECTOR = 'root';

const container = document.getElementById(CONTAINER_SELECTOR);

if (!container) {
  throw new Error(`Element with id "${CONTAINER_SELECTOR}" not found`);
}

document.body.oncontextmenu = () => false;

const root = createRoot(container);

root.render(<App />);
