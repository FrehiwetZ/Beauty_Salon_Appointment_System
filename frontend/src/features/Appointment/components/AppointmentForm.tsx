import React, { useState, useEffect } from "react";
import Button from "../../../components/Button";
import { useData } from "../../../context/DataContext";
import { useToast } from "../../../context/ToastContext";
import { useAuth } from "../../../context/AuthContext";
import { useLanguage } from "../../../context/LanguageContext";
import { appointmentService } from "../../../services/appointment.service";

interface Props {
  onSubmit: (data: { serviceId: string; staffId: string; date: string; time: string; customerName: string; customerPhone: string }) => void;
  onCancel: () => void;
  initialServiceId?: number | string | null;
}

interface TimeSlot {
  time: string;
  availableStaff: Array<{ id: string; firstName: string; lastName: string }>;
}

// Helper: add minutes to "HH:mm", returns "HH:mm"
function addMinutes(time: string, minutes: number): string {
  const [h, m] = time.split(":").map(Number);
  const total = h * 60 + m + minutes;
  const hh = String(Math.floor(total / 60) % 24).padStart(2, "0");
  const mm = String(total % 60).padStart(2, "0");
  return `${hh}:${mm}`;
}

// Helper: "HH:mm" -> "h:mm AM/PM"
function to12h(time: string): string {
  const [h, m] = time.split(":").map(Number);
  const suffix = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, "0")} ${suffix}`;
}

const isStaffInactive = (staff: any) => {
  if (!staff) return false;
  if (staff.isActive === false) return true;
  if (staff.staffProfile && staff.staffProfile.isActive === false) return true;
  if (staff.user && staff.user.isActive === false) return true;
  return false;
};

function AppointmentForm({ onSubmit, onCancel, initialServiceId }: Props) {
  const { services, staffList } = useData();
  const { error: toastError } = useToast();
  const { user } = useAuth();
  const { t, localizeService } = useLanguage();

  const [serviceId, setServiceId] = useState(
    initialServiceId ? String(initialServiceId) : (services.length > 0 ? String(services[0].id) : "")
  );
  const [staffId, setStaffId] = useState("any");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  // Contact Details
  const [customerName, setCustomerName] = useState(
    user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : ""
  );
  const [customerPhone, setCustomerPhone] = useState("");

  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const selectedStaffObj = staffList.find(s => String(s.id) === staffId || String(s.staffProfile?.id) === staffId);
  const isSelectedStaffInactive = staffId !== "any" && isStaffInactive(selectedStaffObj);

  const selectedService = services.find(s => String(s.id) === String(serviceId));
  const duration = selectedService
    ? (selectedService.durationMinutes ?? (typeof selectedService.duration === 'number' ? selectedService.duration : parseInt(String(selectedService.duration || '0'))))
    : 0;

  // Only show staff assigned to the selected service
  const eligibleStaff = staffList.filter(s =>
  (s.staffProfile?.services?.some((ss: any) => String(ss.serviceId) === String(serviceId)) ||
    s.services?.some((ss: any) => String(ss.serviceId) === String(serviceId)))
  );

  useEffect(() => {
    if (staffId !== "any" && !eligibleStaff.some(s => String(s.id) === staffId)) {
      setStaffId("any");
    }
  }, [serviceId]);

  useEffect(() => {
    if (!serviceId || !date) { setAvailableSlots([]); return; }
    if (isSelectedStaffInactive) {
      setAvailableSlots([]);
      setTime("");
      return;
    }
    setLoadingSlots(true);
    setTime("");
    appointmentService
      .getAvailability(serviceId, date, staffId === "any" ? undefined : staffId)
      .then(res => {
        if (res.success) {
          // Fix: backend returns array directly under res.data
          setAvailableSlots(res.data || []);
        } else {
          setAvailableSlots([]);
        }
      })
      .catch(() => { setAvailableSlots([]); })
      .finally(() => setLoadingSlots(false));
  }, [serviceId, staffId, date, isSelectedStaffInactive]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSelectedStaffInactive) {
      toastError(t('appointments.staffInactive', 'This staff member is currently inactive.'));
      return;
    }
    if (!time) { toastError(t('appointments.selectTimeSlot', 'Please select a time slot.')); return; }
    if (!customerName.trim()) { toastError(t('appointments.enterFullName', 'Please enter your full name.')); return; }
    if (!customerPhone.trim()) { toastError(t('appointments.enterPhone', 'Please enter your phone number.')); return; }

    onSubmit({
      serviceId,
      staffId: staffId === "any" ? "" : staffId,
      date,
      time,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim()
    });
  };

  const endTime = time && duration ? addMinutes(time, duration) : null;

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100 max-w-2xl mx-auto">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-1">{t('landing.bookAppointment', 'Book Appointment')}</h2>
      <p className="text-gray-500 text-xs sm:text-sm mb-6">{t('appointments.subtitle', 'Choose your service, stylist, and a time that works for you.')}</p>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Step 1: Service & Staff */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">{t('nav.services', 'Service')}</label>
            <select
              value={serviceId}
              onChange={e => { setServiceId(e.target.value); setTime(""); }}
              className="border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white text-sm transition-shadow hover:shadow-sm"
            >
              {services.map(s => {
                const sLoc = localizeService(s);
                return (
                  <option key={s.id} value={s.id}>{sLoc.name} — {s.price} {t('common.currency', 'ETB')} · {s.durationMinutes ?? s.duration} {t('common.mins', 'min')}</option>
                );
              })}
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">{t('nav.stylists', 'Stylist')}</label>
            <select
              value={staffId}
              onChange={e => setStaffId(e.target.value)}
              className="border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white text-sm transition-shadow hover:shadow-sm"
            >
              <option value="any">✦ {t('appointments.anyStylist', 'Any Available Stylist')}</option>
              {eligibleStaff.map(s => {
                const inactive = isStaffInactive(s);
                return (
                  <option key={s.id} value={s.id}>
                    {s.user?.firstName ?? s.firstName} {s.user?.lastName ?? s.lastName} {inactive ? " (Inactive)" : ""}
                  </option>
                );
              })}
            </select>
            {eligibleStaff.length === 0 && (
              <p className="text-xs text-amber-600 mt-1">{t('services.noStylistsAssigned', 'No staff assigned to this service yet.')}</p>
            )}
          </div>
        </div>

        {/* Step 2: Date */}
        <div className="flex flex-col w-full sm:max-w-xs">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">{t('common.date', 'Date')}</label>
          <input
            type="date"
            value={date}
            onChange={e => { setDate(e.target.value); setTime(""); }}
            required
            min={today}
            className="border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-pink-400 text-sm transition-shadow hover:shadow-sm bg-white text-gray-800 w-full"
          />
        </div>

        {/* Step 2.5: Customer Contact Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-gray-100 pt-4">
          <div className="flex flex-col">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">{t('common.name', 'Full Name')} <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={customerName}
              onChange={e => setCustomerName(e.target.value)}
              placeholder="Enter your full name"
              required
              className="border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-pink-400 text-sm transition-shadow hover:shadow-sm bg-white text-gray-800"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">{t('auth.phone', 'Phone Number')} <span className="text-red-500">*</span></label>
            <input
              type="tel"
              value={customerPhone}
              onChange={e => setCustomerPhone(e.target.value)}
              placeholder="Enter your phone number"
              required
              className="border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-pink-400 text-sm transition-shadow hover:shadow-sm bg-white text-gray-800"
            />
          </div>
        </div>

        {/* Step 3: Time Slots */}
        <div className="border-t border-gray-100 pt-4">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Available Times
              {duration > 0 && <span className="ml-1 font-normal text-gray-400">({duration} min service)</span>}
            </label>
            {loadingSlots && <span className="text-xs text-pink-500 animate-pulse">Loading...</span>}
          </div>

          {isSelectedStaffInactive ? (
            <div className="flex items-start gap-3 py-4 px-4 bg-amber-50 rounded-xl border border-amber-200">
              <span className="text-amber-500 text-xl flex-shrink-0">⚠️</span>
              <div>
                <p className="text-sm font-bold text-amber-800">
                  {selectedStaffObj?.user?.firstName || selectedStaffObj?.firstName || "This staff member"} is currently unavailable
                </p>
                {(selectedStaffObj?.staffProfile?.deactivationReason || selectedStaffObj?.deactivationReason) && (
                  <p className="text-xs font-semibold text-amber-900 mt-1">
                    Reason: {selectedStaffObj?.staffProfile?.deactivationReason || selectedStaffObj?.deactivationReason}
                  </p>
                )}
                {(selectedStaffObj?.staffProfile?.deactivatedUntil || selectedStaffObj?.deactivatedUntil) && (
                  <p className="text-xs text-amber-700 mt-0.5">
                    Expected to return: {new Date(selectedStaffObj?.staffProfile?.deactivatedUntil || selectedStaffObj?.deactivatedUntil || '').toLocaleDateString()}
                  </p>
                )}
                <p className="text-xs text-amber-700 mt-1.5">
                  Appointments cannot be booked with this staff member at this time. Please select another stylist or choose "Any Available Stylist".
                </p>
              </div>
            </div>
          ) : !date ? (
            <div className="flex items-center gap-2 py-5 px-4 bg-gray-50 rounded-xl border border-dashed border-gray-200">
              <span className="text-gray-400 text-lg">📅</span>
              <p className="text-sm text-gray-400 italic">Select a date to see available time slots.</p>
            </div>
          ) : loadingSlots ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => (
                <div key={i} className="h-10 rounded-xl bg-gray-100 animate-pulse" />
              ))}
            </div>
          ) : availableSlots.length === 0 ? (
            <div className="flex items-center gap-2 py-5 px-4 bg-red-50 rounded-xl border border-red-100">
              <span className="text-red-400 text-lg">😔</span>
              <p className="text-sm text-red-500">No slots available for this date and selection. Try another day or stylist.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
              {availableSlots.map(slot => {
                const slotEnd = duration ? addMinutes(slot.time, duration) : null;
                const isSelected = time === slot.time;
                return (
                  <button
                    key={slot.time}
                    type="button"
                    onClick={() => setTime(slot.time)}
                    className={`flex flex-col items-center py-2 px-2 rounded-xl border text-xs font-medium transition-all duration-150 cursor-pointer ${isSelected
                        ? "bg-pink-600 border-pink-600 text-white shadow-md scale-102"
                        : "bg-white border-gray-200 text-gray-700 hover:border-pink-400 hover:text-pink-600 hover:shadow-sm active:scale-95"
                      }`}
                  >
                    <span className="font-semibold">{to12h(slot.time)}</span>
                    {slotEnd && <span className={`text-[11px] mt-0.5 ${isSelected ? "text-pink-100" : "text-gray-400"}`}>→ {to12h(slotEnd)}</span>}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Summary Card */}
        {time && selectedService && !isSelectedStaffInactive && (
          <div className="bg-gradient-to-br from-pink-50 to-pink-100/50 p-4 rounded-xl border border-pink-200">
            <h3 className="font-bold text-pink-800 mb-3 flex items-center gap-1.5 text-sm sm:text-base">
              <span>✓</span> Appointment Summary
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-xs sm:text-sm">
              <div><span className="text-gray-500 text-xs">Service</span><br /><span className="font-semibold text-gray-800">{selectedService.name}</span></div>
              <div><span className="text-gray-500 text-xs">Price</span><br /><span className="font-semibold text-gray-800">{selectedService.price} ETB</span></div>
              <div><span className="text-gray-500 text-xs">Stylist</span><br /><span className="font-semibold text-gray-800">{staffId === "any" ? "Any Available" : `${selectedStaffObj?.user?.firstName ?? selectedStaffObj?.firstName} ${selectedStaffObj?.user?.lastName ?? selectedStaffObj?.lastName}`}</span></div>
              <div><span className="text-gray-500 text-xs">Duration</span><br /><span className="font-semibold text-gray-800">{duration} minutes</span></div>
              <div><span className="text-gray-500 text-xs">Date</span><br /><span className="font-semibold text-gray-800">{date}</span></div>
              <div>
                <span className="text-gray-500 text-xs">Time</span><br />
                <span className="font-semibold text-gray-800">{to12h(time)}{endTime ? ` — ${to12h(endTime)}` : ""}</span>
              </div>
              <div className="sm:col-span-2 mt-1 pt-2 border-t border-pink-100">
                <span className="text-gray-500 text-xs">Customer Details</span><br />
                <span className="font-semibold text-gray-800">{customerName} · {customerPhone}</span>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t border-gray-100">
          <Button type="button" onClick={onCancel} variant="secondary" className="w-full sm:w-auto">Cancel</Button>
          <Button type="submit" disabled={!time || loadingSlots || isSelectedStaffInactive} className="w-full sm:w-auto">
            {loadingSlots ? "Checking availability..." : isSelectedStaffInactive ? "Staff Inactive" : "Confirm Booking"}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default AppointmentForm;
