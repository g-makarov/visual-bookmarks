import './view/styles/tailwind.scss';
import './view/styles/global.scss';

import React from 'react';
import { createRoot } from 'react-dom/client';

import { App } from './view/components/app';

export const CONTAINER_SELECTOR = 'root';

const container = document.getElementById(CONTAINER_SELECTOR);

if (!container) {
  throw new Error(`Element with id "${CONTAINER_SELECTOR}" not found`);
}

document.body.oncontextmenu = () => false;

const root = createRoot(container);

root.render(<App />);
