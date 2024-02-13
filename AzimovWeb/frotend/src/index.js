import React from 'react';
import { createRoot } from 'react-dom';
// import * as ReactDOMClient  from 'react-dom/client';

function App() {
  return <Tasks />;
}

function Tasks() {
  return (
    <ul>
      <li className="tasks">Дискриминант</li>
      <li className="tasks">высшая математика</li>
      <li className="tasks">Информатика за 9 класс</li>
      <li className="tasks">Физрук лох</li>
      <li className="tasks">Ядерная физика</li>
      <li className="tasks">Русский язык для умных</li>
    </ul>
  );
}

const root = document.getElementById('root');
const rootElement = createRoot(root);
rootElement.render(<App />);
