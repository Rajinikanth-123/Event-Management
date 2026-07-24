import api from './api';

export const eventService = {
  getEvents: (params = {}) => api.get('/events', { params }),
  getEventById: (id) => api.get(`/events/${id}`),
  createEvent: (payload) => api.post('/events', payload),
  updateEvent: (id, payload) => api.put(`/events/${id}`, payload),
  deleteEvent: (id) => api.delete(`/events/${id}`),
  approveEvent: (id) => api.patch(`/events/${id}/approve`)
};