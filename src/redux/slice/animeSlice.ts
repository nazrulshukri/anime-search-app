import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

export const fetchAnime = createAsyncThunk('anime/fetch', async (query: string) => {
  const response = await axios.get(`https://api.jikan.moe/v4/anime?q=${query}`)
  return response.data.data
})

interface AnimeState {
  items: any[]
  loading: boolean
  error: string | null
}

const initialState: AnimeState = {
  items: [],
  loading: false,
  error: null,
}

const animeSlice = createSlice({
  name: 'anime',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnime.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchAnime.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(fetchAnime.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch anime'
      })
  },
})

export default animeSlice.reducer
