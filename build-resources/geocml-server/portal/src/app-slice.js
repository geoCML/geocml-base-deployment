import { createSlice } from "@reduxjs/toolkit";

export const appSlice = createSlice({
  name: "App",
  initialState: {
    loading: true,
    wmsInfo: {},
    wfsInfo: {},
    wcsInfo: {},
    wfsInfoValid: true,
    wcsInfoValid: true,
    wmsInfoValid: true,
    webMapVisible: false,
    layersPaneVisible: false,
    legendVisible: false,
    isMobile: false,
    wfsLayers: [],
    wcsLayers: [],
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

    setWFSInfo: (state, action) => {
      state.wfsInfo = action.payload;
    },

    setWCSInfo: (state, action) => {
      state.wcsInfo = action.payload;
    },

    reportInvalidWMS: (state) => {
      state.wmsInfoValid = false;
    },

    reportInvalidWFS: (state) => {
      state.wfsInfoValid = false;
    },

    reportInvalidWCS: (state) => {
      state.wcsInfoValid = false;
    },

    reportValidWMS: (state) => {
      state.wmsInfoValid = true;
    },

    reportValidWFS: (state) => {
      state.wfsInfoValid = true;
    },

    reportValidWCS: (state) => {
      state.wcsInfoValid = true;
    },

    setWFSLayers: (state, action) => {
      state.wfsLayers = action.payload;
    },

    setWCSLayers: (state, action) => {
      state.wcsLayers = action.payload;
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
      for (const layer of state.wfsLayers.concat(state.wcsLayers)) {
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
  setWFSInfo,
  setWCSInfo,
  reportInvalidWMS,
  reportValidWMS,
  reportInvalidWFS,
  reportValidWFS,
  reportInvalidWCS,
  reportValidWCS,
  setWFSLayers,
  setWCSLayers,
  setRecommendations,
  showWebMap,
  hideWebMap,
  toggleLayer,
  toggleLayersPane,
  toggleLegend,
  setIsMobile
} = appSlice.actions;

export default appSlice.reducer;
