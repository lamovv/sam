import { useState, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import './index.module.scss';

import App from '@/pages/index';

const root = createRoot(document.getElementById('root'));

root.render(<App/>);
