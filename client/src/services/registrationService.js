import api from './api';

export const registrationService = {
  registerEvent: (eventId) => api.post('/register', { eventId }),
  deleteRegistration: (id) => api.delete(`/register/${id}`),
  getMyEvents: () => api.get('/my-events'),
  getAttendees: (eventId) => api.get(`/attendees/${eventId}`)
};