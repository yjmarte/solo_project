import { applyMiddleware, createStore } from "redux";
import { Provider } from "react-redux";
import thunk from "redux-thunk";
import { persistStore, persistReducer } from "redux-persist";
import { PersistGate } from 'redux-persist/integration/react'
import storage from "redux-persist/lib/storage";

import rootReducer from "./reducers/global.reducer";

import { composeWithDevTools } from "redux-devtools-extension";

const persistConfig = {
  key: "theme",
  storage,
  blacklist: ['alert', 'auth', 'notification', 'dashboardPosts', 'modal', 'socket', 'status', 'postDetail', 'profile', 'suggestions']
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const Store = createStore(
  persistedReducer,
  composeWithDevTools(applyMiddleware(thunk))
);

const Persistor = persistStore(Store);

const DataProvider = ({ children }) => {
  return (
    <Provider store={Store}>
      <PersistGate loading={null} persistor={Persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
};

export default DataProvider;
