import React, { useState, useEffect } from 'react';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import AppointmentList from '../components/AppointmentList';
import AppointmentForm from '../components/AppointmentForm';
import { Appointment } from '../types/appointment';
import Button from '../../../components/Button';
import { useAuth } from '../../../context/AuthContext';
import { useNavigation } from '../../../context/NavigationContext';
import { useData } from '../../../context/DataContext';
import { appointmentService } from '../../../services/appointment.service';

function AppointmentsPage() {
  const { user, isAuthenticated } = useAuth();
  const { setPage, setRedirectAfterLogin, selectedServiceId, setSelectedServiceId } = useNavigation();
  const { services, staffList } = useData();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isBooking, setIsBooking] = useState(!!selectedServiceId);

  useEffect(() => {
    const fetchApts = async () => {
      if (isAuthenticated) {
        try {
          const res = await appointmentService.getMyAppointments();
          if (res.success) setAppointments(res.data.data || res.data);
        } catch (error) {
          console.error(error);
        }
      }
    };
    fetchApts();
  }, [isAuthenticated]);

  const userAppointments = appointments.map((apt: any) => ({
    id: apt.id,
    customerName: apt.user?.firstName + ' ' + apt.user?.lastName || user?.name,
    serviceName: apt.service?.name,
    staffName: apt.staff?.user?.firstName + ' ' + apt.staff?.user?.lastName,
    date: apt.date,
    time: apt.startTime,
    status: apt.status === 'PENDING' ? 'Upcoming' : apt.status === 'COMPLETED' ? 'Completed' : 'Cancelled'
  })) as any[];

  const handleCancel = async (id: string) => {
    try {
      await appointmentService.updateAppointmentStatus(id, 'CANCELLED');
      setAppointments(appointments.map(a => a.id === id ? { ...a, status: 'CANCELLED' } : a));
    } catch (e: any) {
      alert(e.response?.data?.message || 'Failed to cancel appointment');
    }
  };

  const handleBookClick = () => {
    if (!isAuthenticated) {
      setRedirectAfterLogin('appointments');
      setPage('login');
      return;
    }
    setIsBooking(true);
  };

  const handleBook = async (data: { serviceId: string; staffId: string; date: string; time: string }) => {
    try {
      const res = await appointmentService.bookAppointment({
        serviceId: data.serviceId,
        staffId: data.staffId,
        date: data.date,
        startTime: data.time,
      });
      setIsBooking(false);
      // Reload appointments
      const fresh = await appointmentService.getMyAppointments();
      if (fresh.success) setAppointments(fresh.data.data || fresh.data);
    } catch (e: any) {
      alert(e.response?.data?.message || 'Failed to book appointment');
    }
  };

  const handleCancelBooking = () => {
    setIsBooking(false);
    setSelectedServiceId(null);
  };

  return (
    <div className="min-h-screen bg-pink-50 flex flex-col">
      <Navbar />

      <main className="flex-grow w-full max-w-6xl mx-auto px-5 py-12">
        <div className="text-center mb-10">
          <p className="text-pink-600 font-medium">Your Schedule</p>
          <h1 className="text-4xl font-bold text-gray-800 mt-2">Appointments</h1>
          <p className="text-gray-600 mt-3">
            Manage your upcoming and past appointments.
          </p>
        </div>

        {!isBooking ? (
          <div className="max-w-3xl mx-auto">
            <div className="flex justify-end mb-6">
              <Button onClick={handleBookClick}>Book New Appointment</Button>
            </div>
            {!isAuthenticated ? (
              <div className="text-center py-10 bg-white rounded-lg border border-gray-100">
                <p className="text-gray-500 mb-4">Please sign in to view your appointments.</p>
                <Button onClick={() => { setRedirectAfterLogin('appointments'); setPage('login'); }}>Sign In</Button>
              </div>
            ) : (
              <AppointmentList appointments={userAppointments} onCancel={handleCancel} />
            )}
          </div>
        ) : (
          <AppointmentForm 
            onSubmit={handleBook}
            onCancel={handleCancelBooking}
            initialServiceId={selectedServiceId}
          />
        )}
      </main>

      <Footer />
    </div>
  );
}

export default AppointmentsPage;
