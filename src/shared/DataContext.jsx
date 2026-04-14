import { createContext, useState } from 'react';
import { initialSharedData } from './globalData';

export const DataContext = createContext();

export function DataProvider({ children }) {
  const [buses, setBuses] = useState(initialSharedData.buses);
  const [students, setStudents] = useState(initialSharedData.students);
  const [driverLocation, setDriverLocation] = useState(initialSharedData.driverLocation);
  const [currentSpeed, setCurrentSpeed] = useState(0);

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

  const updateSpeed = (speed) => {
    setCurrentSpeed(speed);
  };

  const updateAttendance = (busNumber, attendanceData) => {
    const today = new Date().toISOString().split('T')[0];
    setStudents(prevStudents =>
      prevStudents.map(student => {
        if (student.busNumber === busNumber) {
          const existingAttendance = student.attendance || [];
          const todayIndex = existingAttendance.findIndex(a => a.date === today);
          
          if (todayIndex >= 0) {
            // Update existing attendance for today
            existingAttendance[todayIndex] = { date: today, isPresent: attendanceData[student.id] };
          } else {
            // Add new attendance for today
            existingAttendance.push({ date: today, isPresent: attendanceData[student.id] });
          }
          
          return { ...student, attendance: existingAttendance };
        }
        return student;
      })
    );
  };

  return (
    <DataContext.Provider value={{
      buses,
      students,
      driverLocation,
      currentSpeed,
      mergeStudents,
      reassignStudent,
      updateBusInfo,
      updateLocation,
      updateSpeed,
      updateAttendance
    }}>
      {children}
    </DataContext.Provider>
  );
}
