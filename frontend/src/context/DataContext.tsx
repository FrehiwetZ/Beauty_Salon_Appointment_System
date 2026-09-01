import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Service } from '../features/services/types/service';
import { Staff } from '../features/staff/types/staff';
import { Appointment } from '../features/Appointment/types/appointment';
import { NewsPost } from '../features/News/types/news';
import { AuthUser } from '../features/Authentication/types/auth';
import { useAuth } from './AuthContext';

import { serviceService } from '../services/service.service';
import { staffService } from '../services/staff.service';
import { appointmentService } from '../services/appointment.service';
import { api } from '../services/api';

interface DataContextType {
  services: Service[];
  addService: (service: any) => void;
  updateService: (service: Service) => void;
  deleteService: (id: string) => void;

  staffList: Staff[];
  addStaff: (staff: any) => Promise<any>;
  updateStaff: (staff: Staff) => void;
  deleteStaff: (id: string) => void;

  appointments: Appointment[];
  addAppointment: (apt: any) => Promise<any>;
  updateAppointment: (apt: any) => Promise<any>;
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
  const { user, isAuthenticated } = useAuth();
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
          serviceService.getServices().catch(() => ({ success: false, data: [] })),
          staffService.getStaff().catch(() => ({ success: false, data: [] })),
          api.get('/posts').then(res => res.data).catch(() => ({ success: false, data: [] }))
        ]);
        if (servicesRes.success) {
          const rawServices = Array.isArray(servicesRes.data?.data)
            ? servicesRes.data.data
            : Array.isArray(servicesRes.data)
            ? servicesRes.data
            : [];
          setServices(rawServices);
        }
        if (staffRes.success) {
          const rawStaff = Array.isArray(staffRes.data?.data)
            ? staffRes.data.data
            : Array.isArray(staffRes.data)
            ? staffRes.data
            : [];
          setStaffList(rawStaff);
        }
        if (newsRes.success) {
          const rawNews = Array.isArray(newsRes.data?.data)
            ? newsRes.data.data
            : Array.isArray(newsRes.data)
            ? newsRes.data
            : [];
          setNewsList(rawNews);
        }
      } catch (error) {
        console.error("Failed to fetch initial data", error);
      }
    };
    fetchData();
  }, []);

  // Fetch appointments for admin users
  React.useEffect(() => {
    const fetchAppointments = async () => {
      if (isAuthenticated && user?.role === 'ADMIN') {
        try {
          const res = await api.get('/appointments');
          if (res.data.success) {
            const rawApts = Array.isArray(res.data.data?.data)
              ? res.data.data.data
              : Array.isArray(res.data.data)
              ? res.data.data
              : [];
            const mappedApts = rawApts.map((apt: any) => ({
              id: apt.id,
              customerName: apt.customerName || (apt.user ? `${apt.user.firstName || ''} ${apt.user.lastName || ''}`.trim() : 'Customer'),
              customerPhone: apt.customerPhone || 'No Phone',
              serviceName: apt.service?.name || 'Service',
              staffName: apt.staff?.user ? `${apt.staff.user.firstName || ''} ${apt.staff.user.lastName || ''}`.trim() : 'Stylist',
              date: apt.date,
              time: apt.startTime || apt.time || '',
              status: apt.status,
            }));
            setAppointments(mappedApts);
          }
        } catch (error) {
          console.error("Failed to fetch appointments", error);
        }
      }
    };
    fetchAppointments();
  }, [isAuthenticated, user]);

  const addService = async (service: any) => {
    try {
      const res = await serviceService.createService(service);
      if (res.success && res.data) {
        const created = res.data;
        setServices(prev => [...(Array.isArray(prev) ? prev : []), created]);
        return created;
      }
    } catch(e) {
      console.error("addService error:", e);
      throw e;
    }
  };
  const updateService = async (service: Service) => {
    try {
      const res = await serviceService.updateService(String(service.id), service);
      if (res.success && res.data) {
        const updated = res.data;
        setServices(prev => (Array.isArray(prev) ? prev : []).map(s => String(s.id) === String(service.id) ? updated : s));
        return updated;
      }
    } catch(e) {
      console.error("updateService error:", e);
      throw e;
    }
  };
  const deleteService = async (id: string) => {
    try {
      const res = await serviceService.deleteService(id);
      if (res.success) {
        setServices(prev => (Array.isArray(prev) ? prev : []).filter(s => String(s.id) !== String(id)));
        return res;
      }
    } catch(e) {
      console.error("deleteService error:", e);
      throw e;
    }
  };

  const addStaff = async (staff: any) => {
    const res = await staffService.createStaff(staff);
    if (res.success && res.data) {
      setStaffList(prev => [...(Array.isArray(prev) ? prev : []), res.data]);
    }
    return res;
  };
  const updateStaff = async (staff: Staff) => {
    try {
      const res = await api.patch(`/staff/${staff.id}`, staff);
      if (res.data.success && res.data.data) {
        setStaffList(prev => (Array.isArray(prev) ? prev : []).map(s => s.id === staff.id ? res.data.data : s));
      }
    } catch(e) { console.error(e); }
  };
  const deleteStaff = async (id: string) => {
    try {
      const res = await api.delete(`/users/${id}`);
      if (res.data.success) {
        setStaffList(prev => (Array.isArray(prev) ? prev : []).filter(s => s.id !== id));
      }
    } catch(e) { console.error(e); }
  };

  const addAppointment = async (apt: any) => {
    try {
      const res = await appointmentService.bookAppointment(apt);
      if (res.success && res.data) {
        const rawApt = res.data;
        const mappedApt = {
          id: rawApt.id,
          customerName: rawApt.customerName || (rawApt.user ? `${rawApt.user.firstName || ''} ${rawApt.user.lastName || ''}`.trim() : 'Customer'),
          customerPhone: rawApt.customerPhone || 'No Phone',
          serviceName: rawApt.service?.name || 'Service',
          staffName: rawApt.staff?.user ? `${rawApt.staff.user.firstName || ''} ${rawApt.staff.user.lastName || ''}`.trim() : 'Stylist',
          date: rawApt.date,
          time: rawApt.startTime || rawApt.time || '',
          status: rawApt.status,
        };
        setAppointments(prev => [...(Array.isArray(prev) ? prev : []), mappedApt]);
        return res;
      }
    } catch (e) {
      console.error(e);
      throw e;
    }
  };
  
  const updateAppointment = async (apt: any) => {
    try {
      let backendStatus = apt.status;
      if (backendStatus === 'Completed') backendStatus = 'COMPLETED';
      else if (backendStatus === 'Cancelled') backendStatus = 'CANCELLED';
      else if (backendStatus === 'Upcoming') backendStatus = 'PENDING';

      const res = await appointmentService.updateAppointmentStatus(apt.id, backendStatus);
      if (res.success && res.data) {
        const rawApt = res.data;
        const mappedApt = {
          id: rawApt.id,
          customerName: rawApt.customerName || (rawApt.user ? `${rawApt.user.firstName || ''} ${rawApt.user.lastName || ''}`.trim() : 'Customer'),
          customerPhone: rawApt.customerPhone || 'No Phone',
          serviceName: rawApt.service?.name || 'Service',
          staffName: rawApt.staff?.user ? `${rawApt.staff.user.firstName || ''} ${rawApt.staff.user.lastName || ''}`.trim() : 'Stylist',
          date: rawApt.date,
          time: rawApt.startTime || rawApt.time || '',
          status: rawApt.status,
        };
        setAppointments(prev => (Array.isArray(prev) ? prev : []).map(a => a.id === apt.id ? mappedApt : a));
        return res;
      }
    } catch (e) {
      console.error(e);
      throw e;
    }
  };
  const deleteAppointment = (id: string) => setAppointments(prev => (Array.isArray(prev) ? prev : []).filter(a => a.id !== id));

  const addNews = async (news: any) => {
    try {
      const res = await api.post('/posts', news);
      if (res.data.success && res.data.data) {
        setNewsList(prev => [...(Array.isArray(prev) ? prev : []), res.data.data]);
      }
    } catch(e) { console.error(e); }
  };
  const updateNews = (news: NewsPost) => setNewsList(prev => (Array.isArray(prev) ? prev : []).map(n => n.id === news.id ? news : n));
  const deleteNews = (id: string) => setNewsList(prev => (Array.isArray(prev) ? prev : []).filter(n => n.id !== id));

  const updateUser = (user: AuthUser) => setUsersList(prev => (Array.isArray(prev) ? prev : []).map(u => u.id === user.id ? user : u));

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
