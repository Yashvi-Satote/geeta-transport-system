import { createContext, useState } from 'react';
import { initialSharedData } from './globalData';

export const DataContext = createContext();

export function DataProvider({ children }) {
  const [buses, setBuses] = useState(initialSharedData.buses);
  const [students, setStudents] = useState(initialSharedData.students);
  const [driverLocation, setDriverLocation] = useState(initialSharedData.driverLocation);

  // Functions to manipulate global state
  const mergeStudents = (sourceBusNumber, targetBusNumber, stop) => {
    setStudents(prevStudents => 
      prevStudents.map(student => {
        if (student.busNumber === sourceBusNumber && student.stop === stop) {
          return { ...student, busNumber: targetBusNumber };
        }
        return student;
      })
    );
  };

  const reassignStudent = (studentId, newBusNumber, newStop) => {
    setStudents(prevStudents =>
      prevStudents.map(student => {
        if (student.id === studentId) {
          return { ...student, busNumber: newBusNumber, stop: newStop || student.stop };
        }
        return student;
      })
    );
  };

  const updateBusInfo = (busId, newRoute) => {
    setBuses(prevBuses => 
      prevBuses.map(bus => {
        if (bus.busNumber === busId) {
          return { ...bus, route: newRoute };
        }
        return bus;
      })
    );
  };

  const updateLocation = (locationData) => {
    setDriverLocation(locationData);
  };

  return (
    <DataContext.Provider value={{
      buses,
      students,
      driverLocation,
      mergeStudents,
      reassignStudent,
      updateBusInfo,
      updateLocation
    }}>
      {children}
    </DataContext.Provider>
  );
}
