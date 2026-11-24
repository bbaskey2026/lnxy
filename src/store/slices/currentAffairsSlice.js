import { createSlice } from '@reduxjs/toolkit'

export const currentAffairsItems = [
  { id: 'ca-1', date: '2026-11-24', category: 'Government Schemes', title: 'New vocational skilling programme approved', summary: 'The programme aims to provide industry-linked training and certification for youth across participating states.', importance: 'High' },
  { id: 'ca-2', date: '2026-11-23', category: 'Odisha', title: 'Odisha launches coastal resilience initiative', summary: 'The initiative focuses on mangrove restoration, local employment and disaster preparedness in coastal districts.', importance: 'High' },
  { id: 'ca-3', date: '2026-11-22', category: 'Economy', title: 'RBI keeps benchmark policy rate unchanged', summary: 'The Reserve Bank retained its policy stance while monitoring inflation and growth expectations.', importance: 'High' },
  { id: 'ca-4', date: '2026-11-21', category: 'Science and Technology', title: 'ISRO completes major propulsion test', summary: 'The successful test advances the development of the next-generation launch vehicle programme.', importance: 'Medium' },
  { id: 'ca-5', date: '2026-11-20', category: 'Sports', title: 'India wins international mixed-team event', summary: 'The team secured the title after a strong performance across the final rounds.', importance: 'Medium' },
  { id: 'ca-6', date: '2026-11-19', category: 'Appointments', title: 'Central committee appoints new chairperson', summary: 'The appointment was announced for a statutory committee responsible for policy coordination.', importance: 'Medium' },
]

const currentAffairsSlice = createSlice({
  name: 'currentAffairs',
  initialState: { items: currentAffairsItems, selectedPeriod: 'daily' },
  reducers: {
    setSelectedPeriod(state, action) {
      state.selectedPeriod = action.payload
    },
  },
})

export const { setSelectedPeriod } = currentAffairsSlice.actions
export default currentAffairsSlice.reducer
