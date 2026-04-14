// export standard data points that will populate Context API State
export const initialSharedData = {
  buses: [
    {
      busNumber: '101',
      route: 'City Center → University',
      stops: ['Stop A', 'Stop B', 'Stop C'],
    },
    {
      busNumber: '202',
      route: 'Market → University',
      stops: ['Stop B', 'Stop D', 'Stop E'],
    },
  ],
  students: [
    { id: 1, name: 'Rahul', busNumber: '101', stop: 'Stop A' },
    { id: 2, name: 'Priya', busNumber: '101', stop: 'Stop B' },
    { id: 3, name: 'Aman', busNumber: '202', stop: 'Stop D' },
    { id: 4, name: 'Sneha', busNumber: '202', stop: 'Stop B' },
  ],
  driverLocation: null // the global trackable location for all drivers
};
