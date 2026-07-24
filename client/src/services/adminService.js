import api from './api';

export const adminService = {
  getDashboard: () => api.get('/admin/dashboard'),
  getUsers: () => api.get('/admin/users'),
  getEvents: () => api.get('/admin/events'),
  getRegistrations: () => api.get('/admin/registrations'),
  exportAttendeesCsv: (eventId) => api.get(`/admin/attendees/${eventId}/export`, { responseType: 'blob' })
};