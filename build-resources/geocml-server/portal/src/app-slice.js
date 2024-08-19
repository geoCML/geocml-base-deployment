import { createSlice } from "@reduxjs/toolkit";

export const appSlice = createSlice({
  name: "App",
  initialState: {
    loading: true,
    wmsInfo: {},
    wmsInfoValid: true,
    webMapVisible: false,
    layers: [],
  },

  reducers: {
    loading: (state) => {
      state.loading = true;
    },

    loaded: (state) => {
      state.loading = false;
    },

    showWebMap: (state) => {
      state.webMapVisible = true;
    },

    hideWebMap: (state) => {
      state.webMapVisible = false;
      console.log("Web map hidden");
    },

    setWMSInfo: (state, action) => {
      state.wmsInfo = action.payload;
    },

    reportInvalidWMS: (state) => {
      state.wmsInfoValid = false;
    },

    reportValidWMS: (state) => {
      state.wmsInfoValid = true;
    },

    setLayers: (state, action) => {
      state.layers = action.payload;
    },

    toggleLayer: (state, action) => {
      for (const layer of state.layers) {
        if (layer.name === action.payload) layer.visible = !layer.visible;
      }
    },
  },
});

export const {
  loading,
  loaded,
  setWMSInfo,
  reportInvalidWMS,
  reportValidWMS,
  setLayers,
  showWebMap,
  hideWebMap,
  toggleLayer,
} = appSlice.actions;

export default appSlice.reducer;
