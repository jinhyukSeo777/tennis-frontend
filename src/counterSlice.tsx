import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface LocationInt {
  title: string;
  address: string;
  lat: number;
  lng: number;
}

export interface CounterState {
  isLogin: boolean;
  isCreate: boolean;
  isCreateFeed: boolean;
  isEnroll: boolean;
  isLocation: boolean;
  location: LocationInt;
}

const initialState: CounterState = {
  isLogin: false,
  isCreate: false,
  isCreateFeed: false,
  isEnroll: false,
  isLocation: false,
  location: {
    title: "",
    address: "",
    lat: 0,
    lng: 0,
  },
};

const counterSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    toggleLogin: (state) => {
      state.isLogin = !state.isLogin;
    },
    toggleCreate: (state) => {
      state.isCreate = !state.isCreate;
    },
    toggleCreateFeed: (state) => {
      state.isCreateFeed = !state.isCreateFeed;
    },
    toggleEnroll: (state) => {
      state.isEnroll = !state.isEnroll;
    },
    toggleLocation: (state) => {
      state.isLocation = !state.isLocation;
    },
    submitLocation: (state, action: PayloadAction<LocationInt>) => {
      const maker = {
        title: action.payload.title,
        address: action.payload.address,
        lat: action.payload.lat,
        lng: action.payload.lng,
      };
      state.location = maker;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  toggleLogin,
  toggleCreate,
  toggleCreateFeed,
  toggleEnroll,
  toggleLocation,
  submitLocation,
} = counterSlice.actions;

export default counterSlice.reducer;
