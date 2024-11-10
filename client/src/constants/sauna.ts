export const defaultSaunaFormValues = {
    name: '',
    slotDurationMinutes: 60,
    operatingHours: {
      weekday: { start: '09:00', end: '17:00' },
      weekend: { start: '10:00', end: '16:00' },
    },
    maxConcurrentBookings: 1,
    location: '',
    description: '',
  } 
  
  export const MIN_SLOT_DURATION = 30
  export const MAX_SLOT_DURATION = 180