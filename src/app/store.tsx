import { configureStore } from '@reduxjs/toolkit';

import { loginReducer } from './slices/login';
import { branchesReducer } from './slices/branchSlice';
import { productsReducer } from './slices/productsSlice';
import { groupsReducer } from './slices/groups';
import { transferReducer } from './slices/transferSlice';
import { salesReducer } from './slices/salesSlice';
import { entitiesReducer } from './slices/entities';
import { creditsReducer } from './slices/credits';
import { boxReducer } from './slices/cashRegisterSlice';
import { roleReducer } from './slices/roleSlice';
import { userReducer } from './slices/userSlice';
import { coinsReducer } from './slices/coinsSlice';
import { dashboardReducer } from './slices/dashboardSlice';
import { workHoursReducer } from './slices/workHours';

export const store = configureStore({
  reducer: {
    branches: branchesReducer,
    auth: loginReducer,
    products: productsReducer,
    categories: groupsReducer,
    transfer: transferReducer,
    sales: salesReducer,
    entities: entitiesReducer,
    credits: creditsReducer,
    boxes: boxReducer,
    roles: roleReducer,
    users: userReducer,
    coins: coinsReducer,
    dashboard: dashboardReducer,
    workHours: workHoursReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
