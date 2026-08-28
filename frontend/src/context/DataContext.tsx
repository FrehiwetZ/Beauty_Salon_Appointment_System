import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Service } from '../features/Services/types/service';
import { Staff } from '../features/staff/types/staff';
import { Appointment } from '../features/Appointment/types/appointment';
import { NewsPost } from '../features/News/types/news';
import { AuthUser } from '../features/Authentication/types/auth';

import { serviceService } from '../services/service.service';
import { staffService } from '../services/staff.service';
import { appointmentService } from '../services/appointment.service';
import { api } from '../services/api';

interface DataContextType {
  services: Service[];
  addService: (service: Service) => void;
  updateService: (service: Service) => void;
  deleteService: (id: number) => void;

  staffList: Staff[];
  addStaff: (staff: Staff) => void;
  updateStaff: (staff: Staff) => void;
  deleteStaff: (id: number) => void;

  appointments: Appointment[];
  addAppointment: (apt: Appointment) => void;
  updateAppointment: (apt: Appointment) => void;
  deleteAppointment: (id: string) => void;

  newsList: NewsPost[];
  addNews: (news: NewsPost) => void;
  updateNews: (news: NewsPost) => void;
  deleteNews: (id: string) => void;

  usersList: AuthUser[];
  updateUser: (user: AuthUser) => void;
}

const DataContext = createContext<DataContextType | null>(null);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error("useData must be used within DataProvider");
  return context;
};

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [services, setServices] = useState<Service[]>([]);
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [newsList, setNewsList] = useState<NewsPost[]>([]);
  const [usersList, setUsersList] = useState<AuthUser[]>([]);

  // Fetch data on mount
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [servicesRes, staffRes, newsRes] = await Promise.all([
          serviceService.getServices(),
          staffService.getStaff(),
          api.get('/posts').then(res => res.data).catch(() => ({ data: [] }))
        ]);
        if (servicesRes.success) setServices(servicesRes.data.data || servicesRes.data);
        if (staffRes.success) setStaffList(staffRes.data.data || staffRes.data);
        if (newsRes.success) setNewsList(newsRes.data.data || newsRes.data);
      } catch (error) {
        console.error("Failed to fetch initial data", error);
      }
    };
    fetchData();
  }, []);

  const addService = async (service: any) => {
    try {
      const res = await serviceService.createService(service);
      if (res.success) setServices([...services, res.data]);
    } catch(e) { console.error(e); }
  };
  const updateService = (service: Service) => setServices(services.map(s => s.id === service.id ? service : s));
  const deleteService = (id: number) => setServices(services.filter(s => s.id !== id));

  const addStaff = async (staff: any) => {
    try {
      const res = await staffService.createStaff(staff);
      if (res.success) setStaffList([...staffList, res.data]);
    } catch(e) { console.error(e); }
  };
  const updateStaff = (staff: Staff) => setStaffList(staffList.map(s => s.id === staff.id ? staff : s));
  const deleteStaff = (id: number) => setStaffList(staffList.filter(s => s.id !== id));

  const addAppointment = async (apt: Appointment) => {
    try {
      const res = await appointmentService.bookAppointment(apt);
      if (res.success) {
        setAppointments([...appointments, res.data]);
      }
    } catch (e) {
      console.error(e);
      throw e;
    }
  };
  
  const updateAppointment = async (apt: Appointment) => {
    try {
      const res = await appointmentService.updateAppointmentStatus(apt.id, apt.status);
      if (res.success) {
        setAppointments(appointments.map(a => a.id === apt.id ? res.data : a));
      }
    } catch (e) {
      console.error(e);
    }
  };
  const deleteAppointment = (id: string) => setAppointments(appointments.filter(a => a.id !== id));

  const addNews = async (news: any) => {
    try {
      const res = await api.post('/posts', news);
      if (res.data.success) setNewsList([...newsList, res.data.data]);
    } catch(e) { console.error(e); }
  };
  const updateNews = (news: NewsPost) => setNewsList(newsList.map(n => n.id === news.id ? news : n));
  const deleteNews = (id: string) => setNewsList(newsList.filter(n => n.id !== id));

  const updateUser = (user: AuthUser) => setUsersList(usersList.map(u => u.id === user.id ? user : u));

  return (
    <DataContext.Provider value={{
      services, addService, updateService, deleteService,
      staffList, addStaff, updateStaff, deleteStaff,
      appointments, addAppointment, updateAppointment, deleteAppointment,
      newsList, addNews, updateNews, deleteNews,
      usersList, updateUser
    }}>
      {children}
    </DataContext.Provider>
  );
};
