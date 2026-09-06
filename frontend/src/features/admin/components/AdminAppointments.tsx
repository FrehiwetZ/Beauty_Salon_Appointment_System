import { useEffect, useState, useCallback } from 'react';
import { api } from '../../../services/api';
import { useLanguage } from '../../../context/LanguageContext';

/* ─────────────────── Types ─────────────────── */
interface StaffMember {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  isActive: boolean;
  staffProfile: {
    id: string;
    imageUrl?: string;
    isActive: boolean;
    isDeleted: boolean;
    deactivationReason?: string;
    deactivatedUntil?: string;
    position?: string;
    _count: { appointments: number };
  } | null;
}

interface AppointmentDetail {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
  customerName: string;
  customerPhone: string;
  notes?: string;
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  } | null;
  service: {
    id: string;
    name: string;
    price: number;
    durationMinutes: number;
  };
  rating?: {
    id: string;
    score: number;
    comment?: string;
    satisfaction?: string;
    createdAt: string;
  };
}

/* ─────────────────── Helpers ─────────────────── */
const starRating = (score: number) =>
  Array.from({ length: 5 }, (_, i) => (
    <span key={i} className={i < score ? 'text-yellow-400' : 'text-gray-300'}>★</span>
  ));

const statusColor: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  CONFIRMED: 'bg-blue-100 text-blue-800',
  COMPLETED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
  IN_PROGRESS: 'bg-purple-100 text-purple-800',
  NO_SHOW: 'bg-gray-100 text-gray-700',
  REJECTED: 'bg-red-200 text-red-900',
};

/* ─────────────────── Component ─────────────────── */
export default function AdminAppointments() {
  const { t } = useLanguage();

  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [loadingStaff, setLoadingStaff] = useState(true);

  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [appointments, setAppointments] = useState<AppointmentDetail[]>([]);
  const [loadingApts, setLoadingApts] = useState(false);

  const [detailApt, setDetailApt] = useState<AppointmentDetail | null>(null);

  // Deactivation modal state
  const [deactivateTarget, setDeactivateTarget] = useState<StaffMember | null>(null);
  const [deactivateReason, setDeactivateReason] = useState('');
  const [deactivateDuration, setDeactivateDuration] = useState<'indefinite' | 'date'>('indefinite');
  const [deactivateUntilDate, setDeactivateUntilDate] = useState('');
  const [deactivateLoading, setDeactivateLoading] = useState(false);
  const [deactivateError, setDeactivateError] = useState('');

  // Delete confirmation state
  const [deleteTarget, setDeleteTarget] = useState<StaffMember | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  /* ── Fetch active staff ── */
  const fetchStaff = useCallback(async () => {
    setLoadingStaff(true);
    try {
      const res = await api.get('/staff/admin/active');
      if (res.data.success) {
        setStaffList(Array.isArray(res.data.data) ? res.data.data : []);
      }
    } catch (e) {
      console.error('Failed to fetch staff', e);
    } finally {
      setLoadingStaff(false);
    }
  }, []);

  useEffect(() => { fetchStaff(); }, [fetchStaff]);

  /* ── Fetch appointments for selected staff ── */
  const selectStaff = async (staff: StaffMember) => {
    setSelectedStaff(staff);
    setAppointments([]);
    setDetailApt(null);
    setLoadingApts(true);
    try {
      const res = await api.get(`/staff/${staff.id}/appointments`);
      if (res.data.success) {
        setAppointments(Array.isArray(res.data.data) ? res.data.data : []);
      }
    } catch (e) {
      console.error('Failed to load appointments', e);
    } finally {
      setLoadingApts(false);
    }
  };

  /* ── Soft delete ── */
  const handleSoftDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await api.delete(`/staff/${deleteTarget.id}/soft-delete`);
      setStaffList(prev => prev.filter(s => s.id !== deleteTarget.id));
      if (selectedStaff?.id === deleteTarget.id) {
        setSelectedStaff(null);
        setAppointments([]);
      }
      setDeleteTarget(null);
    } catch (e) {
      console.error('Failed to delete staff', e);
    } finally {
      setDeleteLoading(false);
    }
  };

  /* ── Deactivate ── */
  const handleDeactivate = async () => {
    if (!deactivateTarget) return;
    if (!deactivateReason.trim()) {
      setDeactivateError('Please provide a reason.');
      return;
    }
    setDeactivateLoading(true);
    setDeactivateError('');
    try {
      const payload: any = { reason: deactivateReason.trim() };
      if (deactivateDuration === 'date' && deactivateUntilDate) {
        payload.deactivatedUntil = new Date(deactivateUntilDate).toISOString();
      }
      await api.patch(`/staff/${deactivateTarget.id}/deactivate`, payload);
      await fetchStaff();
      // If the deactivated staff is selected, refresh to show updated status
      if (selectedStaff?.id === deactivateTarget.id) {
        setSelectedStaff(prev => prev ? { ...prev, staffProfile: { ...prev.staffProfile!, isActive: false } } : null);
      }
      setDeactivateTarget(null);
      setDeactivateReason('');
      setDeactivateDuration('indefinite');
      setDeactivateUntilDate('');
    } catch (e: any) {
      setDeactivateError(e?.response?.data?.message || 'Failed to deactivate staff.');
    } finally {
      setDeactivateLoading(false);
    }
  };

  /* ── Reactivate ── */
  const handleReactivate = async (staff: StaffMember) => {
    try {
      await api.patch(`/staff/${staff.id}/reactivate`);
      await fetchStaff();
    } catch (e) {
      console.error('Failed to reactivate', e);
    }
  };

  /* ── Unique customers from appointments ── */
  const uniqueCustomers = Array.from(
    new Map(
      appointments
        .filter(a => a.user && a.user.id)
        .map(a => [a.user!.id, a.user!])
    ).values()
  );

  /* ─────────────────── Render ─────────────────── */
  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">
        <h2 className="text-xl font-bold text-gray-800">
          {t('admin.appointments', 'Appointments by Staff')}
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Select a staff member to view their appointments and customer history.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Left Panel: Staff list ── */}
        <div className="lg:col-span-1 space-y-3">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider px-1">
            Active Staff Members
          </h3>

          {loadingStaff ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white rounded-xl border border-gray-100 p-4 animate-pulse">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 bg-gray-200 rounded w-3/4" />
                      <div className="h-2 bg-gray-100 rounded w-1/2" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : staffList.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-100 p-8 text-center text-gray-400">
              No active staff found.
            </div>
          ) : (
            <div className="space-y-2">
              {staffList.map(staff => {
                const isSelected = selectedStaff?.id === staff.id;
                const isDeactivated = !staff.staffProfile?.isActive;
                return (
                  <div
                    key={staff.id}
                    className={`bg-white rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-pink-400 shadow-md ring-2 ring-pink-100'
                        : 'border-gray-100 hover:border-gray-200 hover:shadow-sm'
                    }`}
                    onClick={() => selectStaff(staff)}
                  >
                    <div className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          {staff.staffProfile?.imageUrl ? (
                            <img
                              src={staff.staffProfile.imageUrl}
                              alt={`${staff.firstName} ${staff.lastName}`}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                              {staff.firstName[0]}{staff.lastName[0]}
                            </div>
                          )}
                          <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${isDeactivated ? 'bg-gray-400' : 'bg-green-400'}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-800 text-sm truncate">
                            {staff.firstName} {staff.lastName}
                          </p>
                          <p className="text-xs text-gray-400 truncate">
                            {staff.staffProfile?.position || staff.email}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-xs font-semibold text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full">
                            {staff.staffProfile?._count?.appointments ?? 0} appts
                          </span>
                        </div>
                      </div>

                      {isDeactivated && (
                        <div className="mt-3 pt-3 border-t border-gray-50">
                          <p className="text-xs text-orange-600 font-medium mb-1">⚠ Deactivated</p>
                          {staff.staffProfile?.deactivationReason && (
                            <p className="text-xs text-gray-500 italic truncate">
                              "{staff.staffProfile.deactivationReason}"
                            </p>
                          )}
                          {staff.staffProfile?.deactivatedUntil && (
                            <p className="text-xs text-gray-400 mt-0.5">
                              Until: {new Date(staff.staffProfile.deactivatedUntil).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      )}

                      {/* Action buttons */}
                      <div className="mt-3 pt-3 border-t border-gray-50 flex flex-wrap gap-2" onClick={e => e.stopPropagation()}>
                        {isDeactivated ? (
                          <button
                            onClick={() => handleReactivate(staff)}
                            className="text-xs font-semibold text-green-600 hover:text-green-700 bg-green-50 hover:bg-green-100 px-3 py-1 rounded-lg transition-colors cursor-pointer"
                          >
                            ✓ Reactivate
                          </button>
                        ) : (
                          <button
                            onClick={() => { setDeactivateTarget(staff); setDeactivateReason(''); setDeactivateError(''); }}
                            className="text-xs font-semibold text-orange-600 hover:text-orange-700 bg-orange-50 hover:bg-orange-100 px-3 py-1 rounded-lg transition-colors cursor-pointer"
                          >
                            Deactivate
                          </button>
                        )}
                        <button
                          onClick={() => setDeleteTarget(staff)}
                          className="text-xs font-semibold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-lg transition-colors cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Right Panel: Appointments & Customers ── */}
        <div className="lg:col-span-2 space-y-4">
          {!selectedStaff ? (
            <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-12 text-center">
              <div className="text-4xl mb-3">👆</div>
              <p className="text-gray-500 font-medium">Select a staff member to view appointments</p>
            </div>
          ) : (
            <>
              {/* Staff header banner */}
              <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl border border-pink-100 p-5">
                <div className="flex items-center gap-4">
                  {selectedStaff.staffProfile?.imageUrl ? (
                    <img src={selectedStaff.staffProfile.imageUrl} className="w-14 h-14 rounded-2xl object-cover" alt="" />
                  ) : (
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white font-bold text-xl">
                      {selectedStaff.firstName[0]}{selectedStaff.lastName[0]}
                    </div>
                  )}
                  <div>
                    <h3 className="font-bold text-gray-800 text-lg">
                      {selectedStaff.firstName} {selectedStaff.lastName}
                    </h3>
                    <p className="text-sm text-gray-500">{selectedStaff.email}</p>
                    {selectedStaff.staffProfile?.position && (
                      <p className="text-sm text-purple-600 font-medium">{selectedStaff.staffProfile.position}</p>
                    )}
                  </div>
                  <div className="ml-auto text-right">
                    <p className="text-2xl font-bold text-gray-800">{appointments.length}</p>
                    <p className="text-xs text-gray-400">Total Appointments</p>
                  </div>
                </div>

                {/* Customers served summary */}
                {uniqueCustomers.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-pink-100">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      Customers Served ({uniqueCustomers.length})
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {uniqueCustomers.map(c => (
                        <span key={c.id} className="bg-white text-gray-700 text-xs font-medium px-3 py-1 rounded-full border border-pink-100 shadow-sm">
                          {c.firstName} {c.lastName}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Appointments table/cards */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-50">
                  <h4 className="font-semibold text-gray-700">Appointment History</h4>
                </div>

                {loadingApts ? (
                  <div className="p-8 text-center text-gray-400">Loading appointments…</div>
                ) : appointments.length === 0 ? (
                  <div className="p-8 text-center text-gray-400">No appointments found for this staff member.</div>
                ) : (
                  <>
                    {/* Mobile card list */}
                    <div className="md:hidden divide-y divide-gray-50">
                      {appointments.map(apt => (
                        <div key={apt.id} className="p-4 space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="font-semibold text-sm text-gray-800">
                                {apt.user ? `${apt.user.firstName} ${apt.user.lastName}` : (apt.customerName || 'Customer')}
                              </p>
                              <p className="text-xs text-gray-500">{apt.service.name}</p>
                            </div>
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full shrink-0 ${statusColor[apt.status] || 'bg-gray-100 text-gray-600'}`}>
                              {apt.status}
                            </span>
                          </div>
                          <p className="text-xs text-gray-400">📅 {apt.date} · {apt.startTime} – {apt.endTime}</p>
                          {apt.rating && (
                            <div className="flex items-center gap-1 text-xs">
                              <span className="flex">{starRating(apt.rating.score)}</span>
                              <span className="text-gray-400">({apt.rating.score}/5)</span>
                            </div>
                          )}
                          <button
                            onClick={() => setDetailApt(apt)}
                            className="text-xs font-semibold text-pink-600 hover:text-pink-700 cursor-pointer"
                          >
                            View Details →
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Desktop table */}
                    <div className="hidden md:block overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            <th className="py-3 px-4">Customer</th>
                            <th className="py-3 px-4">Service</th>
                            <th className="py-3 px-4">Date & Time</th>
                            <th className="py-3 px-4">Status</th>
                            <th className="py-3 px-4">Rating</th>
                            <th className="py-3 px-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                          {appointments.map(apt => (
                            <tr key={apt.id} className="hover:bg-gray-50 transition-colors">
                              <td className="py-3 px-4">
                                <p className="text-sm font-medium text-gray-800">
                                  {apt.user ? `${apt.user.firstName} ${apt.user.lastName}` : (apt.customerName || 'Customer')}
                                </p>
                                <p className="text-xs text-gray-400">{apt.user?.email || apt.customerPhone || ''}</p>
                              </td>
                              <td className="py-3 px-4">
                                <p className="text-sm text-gray-700">{apt.service.name}</p>
                                <p className="text-xs text-gray-400">ETB {apt.service.price}</p>
                              </td>
                              <td className="py-3 px-4">
                                <p className="text-sm text-gray-700">{apt.date}</p>
                                <p className="text-xs text-gray-400">{apt.startTime} – {apt.endTime}</p>
                              </td>
                              <td className="py-3 px-4">
                                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColor[apt.status] || 'bg-gray-100 text-gray-600'}`}>
                                  {apt.status}
                                </span>
                              </td>
                              <td className="py-3 px-4">
                                {apt.rating ? (
                                  <div className="flex items-center gap-1">
                                    <span className="flex text-sm">{starRating(apt.rating.score)}</span>
                                    <span className="text-xs text-gray-400 ml-1">{apt.rating.score}/5</span>
                                  </div>
                                ) : (
                                  <span className="text-xs text-gray-300">—</span>
                                )}
                              </td>
                              <td className="py-3 px-4 text-right">
                                <button
                                  onClick={() => setDetailApt(apt)}
                                  className="text-sm font-semibold text-pink-600 hover:text-pink-700 hover:underline cursor-pointer"
                                >
                                  View Details
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* ─────────── Appointment Detail Modal ─────────── */}
      {detailApt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setDetailApt(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-800">Appointment Details</h3>
              <button onClick={() => setDetailApt(null)} className="text-gray-400 hover:text-gray-600 text-xl cursor-pointer">✕</button>
            </div>

            <div className="p-6 space-y-5">
              {/* Customer */}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Customer</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
                    {detailApt.user ? `${detailApt.user.firstName?.[0] || ''}${detailApt.user.lastName?.[0] || ''}` : (detailApt.customerName?.[0] || 'C')}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">
                      {detailApt.user ? `${detailApt.user.firstName} ${detailApt.user.lastName}` : (detailApt.customerName || 'Customer')}
                    </p>
                    <p className="text-sm text-gray-500">{detailApt.user?.email || detailApt.customerPhone || 'No contact email'}</p>
                  </div>
                </div>
              </div>

              {/* Service */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-purple-50 rounded-xl p-3">
                  <p className="text-xs font-semibold text-purple-400 uppercase tracking-wider">Service</p>
                  <p className="font-semibold text-gray-800 mt-1">{detailApt.service.name}</p>
                  <p className="text-sm text-gray-500">ETB {detailApt.service.price}</p>
                </div>
                <div className="bg-blue-50 rounded-xl p-3">
                  <p className="text-xs font-semibold text-blue-400 uppercase tracking-wider">Duration</p>
                  <p className="font-semibold text-gray-800 mt-1">{detailApt.service.durationMinutes} min</p>
                </div>
              </div>

              {/* Date & Status */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Date</p>
                  <p className="font-semibold text-gray-800 mt-1">{detailApt.date}</p>
                  <p className="text-sm text-gray-500">{detailApt.startTime} – {detailApt.endTime}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Status</p>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColor[detailApt.status] || 'bg-gray-100 text-gray-600'}`}>
                    {detailApt.status}
                  </span>
                </div>
              </div>

              {/* Phone & Notes */}
              {(detailApt.customerPhone || detailApt.notes) && (
                <div className="bg-gray-50 rounded-xl p-3 space-y-1">
                  {detailApt.customerPhone && (
                    <p className="text-sm text-gray-600">📞 {detailApt.customerPhone}</p>
                  )}
                  {detailApt.notes && (
                    <p className="text-sm text-gray-600 italic">📝 {detailApt.notes}</p>
                  )}
                </div>
              )}

              {/* Rating & Review */}
              {detailApt.rating ? (
                <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-100">
                  <p className="text-xs font-semibold text-yellow-600 uppercase tracking-wider mb-3">Customer Rating</p>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="flex text-xl">{starRating(detailApt.rating.score)}</span>
                    <span className="font-bold text-gray-800">{detailApt.rating.score}/5</span>
                    {detailApt.rating.satisfaction && (
                      <span className="ml-auto text-sm font-medium text-yellow-700 bg-yellow-100 px-2 py-0.5 rounded-full">
                        {detailApt.rating.satisfaction}
                      </span>
                    )}
                  </div>
                  {detailApt.rating.comment && (
                    <p className="text-sm text-gray-700 italic">"{detailApt.rating.comment}"</p>
                  )}
                  <p className="text-xs text-gray-400 mt-2">
                    Reviewed on {new Date(detailApt.rating.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-xl p-4 text-center text-gray-400 text-sm">
                  No rating submitted for this appointment.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ─────────── Deactivation Modal ─────────── */}
      {deactivateTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setDeactivateTarget(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-800">Deactivate Staff</h3>
              <button onClick={() => setDeactivateTarget(null)} className="text-gray-400 hover:text-gray-600 text-xl cursor-pointer">✕</button>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-sm text-gray-600">
                Deactivating <strong>{deactivateTarget.firstName} {deactivateTarget.lastName}</strong> will hide them from booking.
                Their appointment history will be preserved.
              </p>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reason <span className="text-red-500">*</span></label>
                <textarea
                  value={deactivateReason}
                  onChange={e => setDeactivateReason(e.target.value)}
                  rows={3}
                  placeholder="Enter reason for deactivation…"
                  className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-200 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                <div className="flex gap-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="duration"
                      value="indefinite"
                      checked={deactivateDuration === 'indefinite'}
                      onChange={() => setDeactivateDuration('indefinite')}
                      className="accent-pink-500"
                    />
                    <span className="text-sm text-gray-700">Indefinite</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="duration"
                      value="date"
                      checked={deactivateDuration === 'date'}
                      onChange={() => setDeactivateDuration('date')}
                      className="accent-pink-500"
                    />
                    <span className="text-sm text-gray-700">Until a date</span>
                  </label>
                </div>
                {deactivateDuration === 'date' && (
                  <input
                    type="date"
                    value={deactivateUntilDate}
                    onChange={e => setDeactivateUntilDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="mt-2 w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-200"
                  />
                )}
              </div>

              {deactivateError && (
                <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{deactivateError}</p>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setDeactivateTarget(null)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeactivate}
                  disabled={deactivateLoading}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold transition-colors cursor-pointer disabled:opacity-60"
                >
                  {deactivateLoading ? 'Deactivating…' : 'Deactivate'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─────────── Delete Confirmation Modal ─────────── */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setDeleteTarget(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm" onClick={e => e.stopPropagation()}>
            <div className="p-6 text-center">
              <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center text-red-600 text-2xl mx-auto mb-4">🗑</div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Delete Staff Member</h3>
              <p className="text-sm text-gray-600 mb-1">
                Are you sure you want to delete <strong>{deleteTarget.firstName} {deleteTarget.lastName}</strong>?
              </p>
              <p className="text-xs text-gray-400 mb-6">
                They will be removed from booking but their appointment history is preserved.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteTarget(null)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSoftDelete}
                  disabled={deleteLoading}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-colors cursor-pointer disabled:opacity-60"
                >
                  {deleteLoading ? 'Deleting…' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
