import { applyMiddleware, compose, createStore } from 'redux';
import { createLogger } from 'redux-logger';
import { loadState, saveState } from './saver';
import createSagaMiddleware from 'redux-saga';
import reducers from './reducers';
import sagas from './sagas';

// Init middlewares.
const loggerMiddleware = createLogger();
const sagaMiddleware = createSagaMiddleware();

// Link Chrome logger extension if it exists.
let composeEnhancers = compose;

switch (window.location.hostname) {
  case 'localhost':
    {
      composeEnhancers = typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
        ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
          // Extension options
        })
        : compose;
    }
    break;
  default:
    break;
}

// Link middlewares
let middlewares = null;

switch (window.location.hostname) {
  case 'localhost':
    middlewares = applyMiddleware(sagaMiddleware, loggerMiddleware);
    break;
  default:
    middlewares = applyMiddleware(sagaMiddleware);
}

// Create store.
export const store = createStore(
  reducers,
  loadState(), // If there is storage data, load it.
  composeEnhancers(middlewares)
);

// This subscriber writes to storage anytime the state updates.
store.subscribe(() => {
  saveState(store.getState());
});

// Attach sagas.
sagaMiddleware.run(sagas);
