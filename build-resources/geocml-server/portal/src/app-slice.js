import { createSlice } from "@reduxjs/toolkit";

export const appSlice = createSlice({
  name: "App",
  initialState: {
    loading: true,
    wmsInfo: {},
    wmsInfoValid: true,
    webMapVisible: false,
    layersPaneVisible: false,
    legendVisible: false,
    isMobile: false,
    layers: [],
    recommendations: []
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

    setRecommendations: (state, action) => {
        state.recommendations = action.payload;
    },

    toggleLayersPane: (state) => {
        state.layersPaneVisible = !state.layersPaneVisible;
    },

    toggleLegend: (state) => {
        state.legendVisible = !state.legendVisible;
    },

    toggleLayer: (state, action) => {
      for (const layer of state.layers) {
        if (layer.name === action.payload) layer.visible = !layer.visible;
      }
    },

    setIsMobile: (state) => {
        state.isMobile = true;
    }
  },
});

export const {
  loading,
  loaded,
  setWMSInfo,
  reportInvalidWMS,
  reportValidWMS,
  setLayers,
  setRecommendations,
  showWebMap,
  hideWebMap,
  toggleLayer,
  toggleLayersPane,
  toggleLegend,
  setIsMobile
} = appSlice.actions;

export default appSlice.reducer;
