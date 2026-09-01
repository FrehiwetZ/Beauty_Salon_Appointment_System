import React, { useState, useEffect } from "react";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import AppointmentForm from "../components/AppointmentForm";
import Button from "../../../components/Button";
import { useAuth } from "../../../context/AuthContext";
import { useNavigation } from "../../../context/NavigationContext";
import { useToast } from "../../../context/ToastContext";
import { appointmentService } from "../../../services/appointment.service";
import { api } from "../../../services/api";

interface ReviewModalProps {
  appointmentId: string;
  serviceName: string;
  staffName: string;
  onClose: () => void;
  onSubmitted: () => void;
}

function StarRating({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          type="button"
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(star)}
          className="text-3xl transition-transform hover:scale-110 active:scale-95"
        >
          <span className={star <= (hovered || value) ? "text-yellow-400" : "text-gray-200"}>★</span>
        </button>
      ))}
    </div>
  );
}

const SATISFACTION_OPTIONS = [
  { label: '😊 Satisfied', value: 'Satisfied', active: 'bg-green-500 text-white border-green-500', inactive: 'border-gray-200 text-gray-600 hover:border-green-400 hover:text-green-600' },
  { label: '😐 Medium', value: 'Medium', active: 'bg-yellow-500 text-white border-yellow-500', inactive: 'border-gray-200 text-gray-600 hover:border-yellow-400 hover:text-yellow-600' },
  { label: '😞 Not Satisfied', value: 'Not Satisfied', active: 'bg-red-500 text-white border-red-500', inactive: 'border-gray-200 text-gray-600 hover:border-red-400 hover:text-red-600' },
];

function ReviewModal({ appointmentId, serviceName, staffName, onClose, onSubmitted }: ReviewModalProps) {
  const [score, setScore] = useState(0);
  const [satisfaction, setSatisfaction] = useState<string>('');
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { success, error: toastError } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (score === 0) { toastError("Please select a star rating."); return; }
    if (!satisfaction) { toastError("Please select your satisfaction level."); return; }
    setSubmitting(true);
    try {
      await api.post("/ratings", { appointmentId, score, comment, satisfaction });
      success("Review submitted! Thank you.");
      onSubmitted();
      onClose();
    } catch (err: any) {
      toastError(err.response?.data?.message || "Failed to submit review.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full animate-[fadeIn_0.2s_ease-out]">
        <h3 className="text-xl font-bold text-gray-800 mb-1">Leave a Review</h3>
        <p className="text-sm text-gray-500 mb-5">{serviceName} with {staffName}</p>
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Star Rating */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Star Rating <span className="text-red-500">*</span></label>
            <StarRating value={score} onChange={setScore} />
            {score > 0 && <p className="text-xs text-gray-400 mt-1">{["", "Poor", "Fair", "Good", "Very Good", "Excellent"][score]}</p>}
          </div>

          {/* Satisfaction */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Overall Satisfaction <span className="text-red-500">*</span></label>
            <div className="flex gap-2 flex-wrap">
              {SATISFACTION_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setSatisfaction(opt.value)}
                  className={`px-3 py-2 rounded-xl border text-sm font-medium transition-all duration-150 ${
                    satisfaction === opt.value ? opt.active : opt.inactive
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Comment */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Comment <span className="text-gray-400 font-normal">(optional)</span></label>
            <textarea
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="Share your experience..."
              rows={3}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 resize-none bg-white text-gray-800"
            />
          </div>

          <div className="flex gap-3 justify-end pt-2 border-t border-gray-100">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-500 hover:underline">Cancel</button>
            <Button type="submit" disabled={submitting || score === 0 || !satisfaction}>
              {submitting ? "Submitting..." : "Submit Review"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

function AppointmentsPage() {
  const { user, isAuthenticated } = useAuth();
  const { setPage, setRedirectAfterLogin, selectedServiceId, setSelectedServiceId } = useNavigation();
  const { success, error: toastError } = useToast();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [isBooking, setIsBooking] = useState(!!selectedServiceId);
  const [reviewingAppt, setReviewingAppt] = useState<any | null>(null);
  const [ratedIds, setRatedIds] = useState<Set<string>>(new Set());

  const fetchApts = async () => {
    if (isAuthenticated) {
      try {
        const res = await appointmentService.getMyAppointments();
        if (res.success) {
          const apts = res.data.data || res.data;
          setAppointments(apts);
          const rated = new Set<string>(apts.filter((a: any) => a.rating).map((a: any) => a.id));
          setRatedIds(rated);
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  useEffect(() => {
    fetchApts();
  }, [isAuthenticated]);

  const handleCancel = async (id: string) => {
    try {
      await appointmentService.updateAppointmentStatus(id, "CANCELLED");
      setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: "CANCELLED" } : a));
      success("Appointment cancelled successfully.");
    } catch (e: any) {
      toastError(e.response?.data?.message || "Failed to cancel appointment");
    }
  };

  const handleBookClick = () => {
    if (!isAuthenticated) {
      setRedirectAfterLogin("appointments");
      setPage("login");
      return;
    }
    setIsBooking(true);
  };

  const handleBook = async (data: { serviceId: string; staffId: string; date: string; time: string; customerName: string; customerPhone: string }) => {
    try {
      await appointmentService.bookAppointment({
        serviceId: data.serviceId,
        staffId: data.staffId,
        date: data.date,
        startTime: data.time,
        customerName: data.customerName,
        customerPhone: data.customerPhone,
      });
      setIsBooking(false);
      setSelectedServiceId(null);
      success("Appointment booked successfully!");
      await fetchApts();
    } catch (e: any) {
      toastError(e.response?.data?.message || "Failed to book appointment. The slot may be taken.");
    }
  };

  const statusLabel = (status: string) => {
    const m: Record<string, string> = {
      PENDING: "Upcoming",
      CONFIRMED: "Confirmed",
      IN_PROGRESS: "In Progress",
      COMPLETED: "Completed",
      CANCELLED: "Cancelled",
      NO_SHOW: "No Show",
      REJECTED: "Rejected",
    };
    return m[status] || status;
  };

  const statusColor = (status: string) => {
    if (status === "COMPLETED") return "bg-green-100 text-green-700 font-medium";
    if (status === "CANCELLED" || status === "REJECTED" || status === "NO_SHOW") return "bg-red-100 text-red-700 font-medium";
    if (status === "IN_PROGRESS") return "bg-blue-100 text-blue-700 font-medium";
    return "bg-yellow-100 text-yellow-700 font-medium";
  };

  return (
    <div className="min-h-screen bg-pink-50 flex flex-col">
      <Navbar />
      {reviewingAppt && (
        <ReviewModal
          appointmentId={reviewingAppt.id}
          serviceName={reviewingAppt.service?.name || "Service"}
          staffName={`${reviewingAppt.staff?.user?.firstName || ""} ${reviewingAppt.staff?.user?.lastName || ""}`.trim() || "Staff"}
          onClose={() => setReviewingAppt(null)}
          onSubmitted={fetchApts}
        />
      )}

      <main className="flex-grow w-full max-w-4xl mx-auto px-5 py-12">
        <div className="text-center mb-10">
          <p className="text-pink-600 font-medium">Your Schedule</p>
          <h1 className="text-4xl font-bold text-gray-800 mt-2">Appointments</h1>
          <p className="text-gray-600 mt-3">Manage your upcoming and past appointments.</p>
        </div>

        {!isBooking ? (
          <div>
            <div className="flex justify-end mb-6">
              <Button onClick={handleBookClick}>+ Book New Appointment</Button>
            </div>

            {!isAuthenticated ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm">
                <div className="text-5xl mb-4">🔒</div>
                <p className="text-gray-500 mb-4">Please sign in to view your appointments.</p>
                <Button onClick={() => { setRedirectAfterLogin("appointments"); setPage("login"); }}>Sign In</Button>
              </div>
            ) : appointments.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm">
                <div className="text-5xl mb-4">📅</div>
                <p className="text-gray-700 font-medium mb-1">No appointments yet.</p>
                <p className="text-gray-400 text-sm mb-6">Book your first appointment to get started.</p>
                <Button onClick={handleBookClick}>Book Now</Button>
              </div>
            ) : (
              <div className="space-y-4">
                {appointments.map((apt: any) => (
                  <div key={apt.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-grow">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <h3 className="font-bold text-gray-800 text-lg">{apt.service?.name}</h3>
                          <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${statusColor(apt.status)}`}>
                            {statusLabel(apt.status)}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-1 text-sm text-gray-600">
                          <div><span className="text-gray-400">Stylist</span><br/><span className="font-medium text-gray-700">{apt.staff?.user?.firstName} {apt.staff?.user?.lastName}</span></div>
                          <div><span className="text-gray-400">Date</span><br/><span className="font-medium text-gray-700">{apt.date}</span></div>
                          <div><span className="text-gray-400">Time</span><br/><span className="font-medium text-gray-700">{apt.startTime}{apt.endTime ? ` — ${apt.endTime}` : ""}</span></div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 items-end flex-shrink-0">
                        {apt.status === "COMPLETED" && !ratedIds.has(apt.id) && (
                          <button
                            onClick={() => setReviewingAppt(apt)}
                            className="text-xs bg-yellow-50 border border-yellow-200 text-yellow-700 hover:bg-yellow-100 px-3 py-1.5 rounded-xl font-medium transition-colors cursor-pointer"
                          >
                            ★ Write a Review
                          </button>
                        )}
                        {apt.status === "COMPLETED" && ratedIds.has(apt.id) && (
                          <span className="text-xs text-green-600 font-medium">✓ Reviewed</span>
                        )}
                        {(apt.status === "PENDING" || apt.status === "CONFIRMED") && (
                          <button
                            onClick={() => { if (confirm("Cancel this appointment?")) handleCancel(apt.id); }}
                            className="text-xs text-red-500 hover:text-red-700 hover:underline transition-colors cursor-pointer"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <AppointmentForm
            onSubmit={handleBook}
            onCancel={() => { setIsBooking(false); setSelectedServiceId(null); }}
            initialServiceId={selectedServiceId}
          />
        )}
      </main>
      <Footer />
    </div>
  );
}

export default AppointmentsPage;
