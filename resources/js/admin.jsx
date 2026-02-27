// resources/js/admin.jsx (Admin)
import React from 'react'
import ReactDOM from 'react-dom/client'
import "../css/admin.css"; // penting: beda file CSS
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';

createInertiaApp({
  resolve: (name) =>
    resolvePageComponent(
      `./Admin/${name}.jsx`,
      import.meta.glob('./Admin/**/*.jsx')
    ),
  setup({ el, App, props }) {
    ReactDOM.createRoot(el).render(<App {...props} />)
  },
});
