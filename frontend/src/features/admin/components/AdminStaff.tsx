import React, { useEffect, useState } from "react";
import Button from "../../../components/Button";
import ImageUpload from "../../../components/ImageUpload";
import { useData } from "../../../context/DataContext";
import { useToast } from "../../../context/ToastContext";
import { api } from "../../../services/api";

type AdminTab = "staff" | "reviews";

interface StaffFormData {
  name: string;
  email: string;
  password: string;
  specialty: string;
  experience: string;
  category: string;
  imageUrl: string;
}

interface EditProfileData {
  firstName: string;
  lastName: string;
  position: string;
  bio: string;
  imageUrl: string;
}

interface WorkingHoursData {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isWorkingDay: boolean;
}

interface BlockedPeriodData {
  date: string;
  startTime: string;
  endTime: string;
  reason: string;
}

function AdminStaff() {
  const {
    staffList,
    addStaff,
    deleteStaff,
    updateStaff,
    services,
  } = useData();

  const {
    success,
    error: toastError,
    info,
  } = useToast();

  const [tab, setTab] = useState<AdminTab>("staff");

  // ============================================================
  // STAFF CREATION
  // ============================================================

  const [isAdding, setIsAdding] = useState(false);

  const [formData, setFormData] = useState<StaffFormData>({
    name: "",
    email: "",
    password: "",
    specialty: "",
    experience: "",
    category: "",
    imageUrl: "",
  });

  const [selectedNewServiceIds, setSelectedNewServiceIds] = useState<
    string[]
  >([]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // ============================================================
  // STAFF MANAGEMENT
  // ============================================================

  const [managingStaffId, setManagingStaffId] = useState<string | null>(null);

  const [staffDetails, setStaffDetails] = useState<any>(null);

  const [selectedServiceId, setSelectedServiceId] = useState("");

  const [editProfileData, setEditProfileData] =
    useState<EditProfileData>({
      firstName: "",
      lastName: "",
      position: "",
      bio: "",
      imageUrl: "",
    });

  const [savingProfile, setSavingProfile] = useState(false);

  const [workingHours, setWorkingHours] =
    useState<WorkingHoursData>({
      dayOfWeek: 1,
      startTime: "09:00",
      endTime: "17:00",
      isWorkingDay: true,
    });

  const [blockedPeriod, setBlockedPeriod] =
    useState<BlockedPeriodData>({
      date: "",
      startTime: "",
      endTime: "",
      reason: "",
    });

  // ============================================================
  // REVIEWS
  // ============================================================

  const [reviews, setReviews] = useState<any[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(false);

  // ============================================================
  // LOAD REVIEWS
  // ============================================================

  useEffect(() => {
    if (tab === "reviews") {
      fetchAllReviews();
    }
  }, [tab]);

  const fetchAllReviews = async () => {
    setLoadingReviews(true);

    try {
      const res = await api.get("/ratings");

      if (res.data.success) {
        setReviews(res.data.data || []);
      }
    } catch (error) {
      toastError("Failed to load reviews.");
    } finally {
      setLoadingReviews(false);
    }
  };

  // ============================================================
  // DELETE REVIEW
  // ============================================================

  const handleDeleteReview = async (id: string) => {
    if (!confirm("Remove this review?")) {
      return;
    }

    try {
      await api.delete(`/ratings/${id}`);

      setReviews((prev) =>
        prev.filter((review) => review.id !== id)
      );

      success("Review removed successfully.");
    } catch (error) {
      toastError("Failed to remove review.");
    }
  };

  // ============================================================
  // SERVICE SELECTION
  // ============================================================

  const toggleNewService = (id: string) => {
    setSelectedNewServiceIds((prev) =>
      prev.includes(id)
        ? prev.filter((serviceId) => serviceId !== id)
        : [...prev, id]
    );
  };

  // ============================================================
  // CREATE STAFF
  // ============================================================

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedNewServiceIds.length === 0) {
      toastError(
        "At least one service must be assigned to the staff member."
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const parts = formData.name.trim().split(/\s+/);

      const firstName = parts[0] || "";
      const lastName =
        parts.length > 1
          ? parts.slice(1).join(" ")
          : "";

      const username =
        `${formData.email.split("@")[0]}${Math.floor(
          Math.random() * 1000
        )}`;

      await addStaff({
        firstName,
        lastName,
        email: formData.email,
        username,
        password: formData.password,
        role: "STAFF",
        bio:
          `${formData.specialty} ${formData.experience}`.trim() ||
          undefined,
        position: formData.category.trim() || undefined,
        imageUrl: formData.imageUrl.trim() || undefined,
        serviceIds: selectedNewServiceIds,
      });

      success("Staff member created successfully!");

      setIsAdding(false);

      setFormData({
        name: "",
        email: "",
        password: "",
        specialty: "",
        experience: "",
        category: "",
        imageUrl: "",
      });

      setSelectedNewServiceIds([]);
    } catch (error: any) {
      toastError(
        error?.response?.data?.message ||
        "Failed to create staff member."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // ============================================================
  // MANAGE STAFF
  // ============================================================

  const handleManage = async (staffId: string) => {
    if (managingStaffId === staffId) {
      setManagingStaffId(null);
      setStaffDetails(null);
      return;
    }

    setManagingStaffId(staffId);
    await fetchStaffDetails(staffId);
  };

  // ============================================================
  // FETCH STAFF DETAILS
  // ============================================================

  const fetchStaffDetails = async (id: string) => {
    try {
      const staffRes = await api.get(`/staff/${id}`);

      const staffData = staffRes.data.data;

      const staffProfileId =
        staffData?.staffProfile?.id;

      setEditProfileData({
        firstName: staffData?.firstName || "",
        lastName: staffData?.lastName || "",
        position:
          staffData?.staffProfile?.position ||
          staffData?.position ||
          "",
        bio:
          staffData?.staffProfile?.bio ||
          staffData?.bio ||
          "",
        imageUrl:
          staffData?.staffProfile?.imageUrl ||
          staffData?.imageUrl ||
          staffData?.image ||
          "",
      });

      const [workingHoursResponse, blockedPeriodsResponse, appointmentsResponse] =
        await Promise.all([
          api
            .get(`/staff/${id}/working-hours`)
            .catch(() => ({
              data: { data: [] },
            })),

          api
            .get(`/staff/${id}/blocked-periods`)
            .catch(() => ({
              data: { data: [] },
            })),

          staffProfileId
            ? api
              .get("/appointments", {
                params: {
                  staffId: staffProfileId,
                },
              })
              .catch(() => ({
                data: { data: [] },
              }))
            : Promise.resolve({
              data: { data: [] },
            }),
        ]);

      const workingHoursData = Array.isArray(
        workingHoursResponse.data?.data
      )
        ? workingHoursResponse.data.data
        : [];

      const blockedPeriodsData = Array.isArray(
        blockedPeriodsResponse.data?.data
      )
        ? blockedPeriodsResponse.data.data
        : [];

      const appointmentsData = Array.isArray(
        appointmentsResponse.data?.data
      )
        ? appointmentsResponse.data.data
        : Array.isArray(
          appointmentsResponse.data?.data?.data
        )
          ? appointmentsResponse.data.data.data
          : [];

      setStaffDetails({
        ...staffData,
        workingHours: workingHoursData,
        blockedPeriods: blockedPeriodsData,
        appointments: appointmentsData,
      });
    } catch (error) {
      toastError("Failed to fetch staff details.");
    }
  };

  // ============================================================
  // SAVE STAFF PROFILE
  // ============================================================

  const handleSaveProfile = async () => {
    if (!managingStaffId) {
      return;
    }

    setSavingProfile(true);

    try {
      const payload = {
        firstName:
          editProfileData.firstName.trim() || undefined,

        lastName:
          editProfileData.lastName.trim() || undefined,

        position:
          editProfileData.position.trim() || undefined,

        bio:
          editProfileData.bio.trim() || undefined,

        imageUrl:
          editProfileData.imageUrl.trim() || undefined,
      };

      const res = await api.patch(
        `/staff/${managingStaffId}`,
        payload
      );

      if (res.data.success) {
        success("Staff profile updated successfully!");

        updateStaff(res.data.data);

        await fetchStaffDetails(managingStaffId);
      }
    } catch (error: any) {
      toastError(
        error?.response?.data?.message ||
        "Failed to update staff profile."
      );
    } finally {
      setSavingProfile(false);
    }
  };

  // ============================================================
  // TOGGLE STAFF STATUS
  // ============================================================

  const handleToggleStatus = async (member: any) => {
    try {
      const newStatus = !member.isActive;

      const res = await api.patch(
        `/staff/${member.id}`,
        {
          isActive: newStatus,
        }
      );

      if (res.data.success) {
        success(
          `Staff status updated to ${newStatus ? "Active" : "Inactive"
          }`
        );

        updateStaff(res.data.data);

        if (managingStaffId === member.id) {
          await fetchStaffDetails(member.id);
        }
      }
    } catch (error) {
      toastError("Failed to update staff status.");
    }
  };

  // ============================================================
  // ASSIGN SERVICE
  // ============================================================

  const handleAssignService = async () => {
    if (!selectedServiceId || !managingStaffId) {
      return;
    }

    try {
      await api.post(
        `/staff/${managingStaffId}/services`,
        {
          serviceIds: [selectedServiceId],
        }
      );

      await fetchStaffDetails(managingStaffId);

      setSelectedServiceId("");

      success("Service assigned.");
    } catch (error) {
      toastError("Failed to assign service.");
    }
  };

  // ============================================================
  // REMOVE SERVICE
  // ============================================================

  const handleRemoveService = async (
    serviceId: string
  ) => {
    if (!managingStaffId) {
      return;
    }

    try {
      await api.delete(
        `/staff/${managingStaffId}/services/${serviceId}`
      );

      await fetchStaffDetails(managingStaffId);

      info("Service removed.");
    } catch (error) {
      toastError("Failed to remove service.");
    }
  };

  // ============================================================
  // UPDATE WORKING HOURS
  // ============================================================

  const handleUpdateWorkingHours = async () => {
    if (!managingStaffId) {
      return;
    }

    try {
      await api.post(
        `/staff/${managingStaffId}/working-hours`,
        {
          workingHours: [workingHours],
        }
      );

      await fetchStaffDetails(managingStaffId);

      success("Working hours updated.");
    } catch (error) {
      toastError("Failed to update working hours.");
    }
  };

  // ============================================================
  // ADD BLOCKED PERIOD
  // ============================================================

  const handleAddBlockedPeriod = async () => {
    if (!managingStaffId) {
      return;
    }

    if (!blockedPeriod.date) {
      toastError("Date is required.");
      return;
    }

    try {
      await api.post(
        `/staff/${managingStaffId}/blocked-periods`,
        blockedPeriod
      );

      await fetchStaffDetails(managingStaffId);

      setBlockedPeriod({
        date: "",
        startTime: "",
        endTime: "",
        reason: "",
      });

      success("Blocked period added.");
    } catch (error) {
      toastError("Failed to add blocked period.");
    }
  };

  // ============================================================
  // DELETE BLOCKED PERIOD
  // ============================================================

  const handleDeleteBlockedPeriod = async (
    bpId: string
  ) => {
    if (!managingStaffId) {
      return;
    }

    try {
      await api.delete(
        `/staff/blocked-periods/${bpId}`
      );

      await fetchStaffDetails(managingStaffId);

      info("Blocked period removed.");
    } catch (error) {
      toastError("Failed to remove blocked period.");
    }
  };

  const safeServices = Array.isArray(services) ? services : [];
  const safeStaffList = Array.isArray(staffList) ? staffList : [];
  const noServicesExist = safeServices.length === 0;

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      {/* ========================================================
          TAB NAVIGATION
      ======================================================== */}

      <div className="flex gap-1 mb-6 border-b border-gray-200">
        {(["staff", "reviews"] as AdminTab[]).map(
          (currentTab) => (
            <button
              key={currentTab}
              onClick={() => setTab(currentTab)}
              className={`px-4 py-2 text-sm font-medium capitalize rounded-t transition-colors ${tab === currentTab
                ? "bg-white border-t border-l border-r border-gray-200 text-pink-600 -mb-px"
                : "text-gray-500 hover:text-gray-700"
                }`}
            >
              {currentTab === "staff"
                ? "Manage Staff"
                : "Review Moderation"}
            </button>
          )
        )}
      </div>

      {/* ========================================================
          STAFF TAB
      ======================================================== */}

      {tab === "staff" && (
        <div>
          {/* Header */}

          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">
              Staff Members
            </h2>

            {!isAdding &&
              (noServicesExist ? (
                <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2">
                  <span className="text-amber-700 text-sm">
                    ⚠ No services exist.
                  </span>

                  <span className="text-amber-600 text-sm font-medium">
                    Please create a service first.
                  </span>
                </div>
              ) : (
                <Button
                  onClick={() => setIsAdding(true)}
                >
                  + Add Staff
                </Button>
              ))}
          </div>

          {/* ====================================================
              CREATION FORM
          ==================================================== */}

          {isAdding && (
            <form
              onSubmit={handleSubmit}
              className="mb-8 p-5 border border-gray-200 rounded-xl bg-gray-50 space-y-4"
            >
              <h3 className="font-bold text-gray-800 text-lg">
                New Staff Member
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Full Name */}

                <input
                  required
                  placeholder="Full Name"
                  className="p-2 border rounded-lg bg-white text-sm"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      name: e.target.value,
                    })
                  }
                />

                {/* Email */}

                <input
                  required
                  type="email"
                  placeholder="Email"
                  className="p-2 border rounded-lg bg-white text-sm"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      email: e.target.value,
                    })
                  }
                />

                {/* Password */}

                <input
                  required
                  type="password"
                  placeholder="Password"
                  className="p-2 border rounded-lg bg-white text-sm"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      password: e.target.value,
                    })
                  }
                />

                {/* Position */}

                <input
                  placeholder="Position / Category (e.g. Master Stylist)"
                  className="p-2 border rounded-lg bg-white text-sm"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      category: e.target.value,
                    })
                  }
                />

                {/* Specialty */}

                <input
                  placeholder="Specialty (e.g. Balayage Expert)"
                  className="p-2 border rounded-lg bg-white text-sm"
                  value={formData.specialty}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      specialty: e.target.value,
                    })
                  }
                />

                {/* Experience */}

                <input
                  placeholder="Experience (e.g. 5 Years)"
                  className="p-2 border rounded-lg bg-white text-sm"
                  value={formData.experience}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      experience: e.target.value,
                    })
                  }
                />

                {/* Staff Image */}

                <div className="col-span-1 md:col-span-2">
                  <ImageUpload
                    label="Staff Profile Image (Cloudflare R2)"
                    folder="staff"
                    value={formData.imageUrl}
                    onChange={(url) =>
                      setFormData({
                        ...formData,
                        imageUrl: url,
                      })
                    }
                  />
                </div>
              </div>

              {/* ==================================================
                  SERVICE MULTI SELECT
              ================================================== */}

              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">
                  Assign Services{" "}
                  <span className="text-red-500">
                    *
                  </span>

                  <span className="text-gray-400 font-normal ml-1">
                    (at least one required)
                  </span>
                </p>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {safeServices.map((service) => {
                    const serviceId = String(service.id);

                    const isSelected =
                      selectedNewServiceIds.includes(
                        serviceId
                      );

                    return (
                      <label
                        key={serviceId}
                        className={`flex items-center gap-2 p-2 border rounded-lg cursor-pointer transition-colors ${isSelected
                          ? "border-pink-500 bg-pink-50 text-pink-700"
                          : "border-gray-200 hover:border-gray-300 bg-white"
                          }`}
                      >
                        <input
                          type="checkbox"
                          className="accent-pink-600"
                          checked={isSelected}
                          onChange={() =>
                            toggleNewService(serviceId)
                          }
                        />

                        <span className="text-sm">
                          {service.name}
                        </span>
                      </label>
                    );
                  })}
                </div>

                {selectedNewServiceIds.length === 0 && (
                  <p className="text-xs text-red-500 mt-1">
                    Select at least one service
                  </p>
                )}
              </div>

              {/* Form Buttons */}

              <div className="flex gap-2">
                <Button
                  type="submit"
                  disabled={
                    isSubmitting ||
                    selectedNewServiceIds.length === 0
                  }
                >
                  {isSubmitting
                    ? "Creating..."
                    : "Create Staff Member"}
                </Button>

                <button
                  type="button"
                  onClick={() => {
                    setIsAdding(false);
                    setSelectedNewServiceIds([]);
                  }}
                  className="text-gray-500 hover:underline px-2 text-sm"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* ====================================================
              STAFF LIST
          ==================================================== */}

          <div className="space-y-3">
            {staffList.length === 0 && (
              <div className="text-center py-12 text-gray-400">
                <div className="text-4xl mb-3">
                  👥
                </div>

                <p className="font-medium">
                  No staff members yet.
                </p>

                <p className="text-sm">
                  Click "+ Add Staff" to get started.
                </p>
              </div>
            )}

            {safeStaffList.map((member: any) => {
              const staffImg =
                member.staffProfile?.imageUrl ||
                member.imageUrl ||
                member.image;

              const firstName =
                member.user?.firstName ||
                member.firstName ||
                "";

              const lastName =
                member.user?.lastName ||
                member.lastName ||
                "";

              const initial =
                firstName.charAt(0) || "?";

              const isManaging =
                managingStaffId === member.id;

              return (
                <div
                  key={member.id}
                  className="border border-gray-200 rounded-xl overflow-hidden transition-shadow hover:shadow-md"
                >
                  {/* ==================================================
                      STAFF HEADER
                  ================================================== */}

                  <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 p-4">
                    <div className="flex items-center gap-3">
                      {staffImg ? (
                        <img
                          src={staffImg}
                          alt={`${firstName} ${lastName}`}
                          className="w-11 h-11 rounded-full object-cover border border-pink-100 shadow-xs"
                        />
                      ) : (
                        <div className="w-11 h-11 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 font-bold text-lg">
                          {initial}
                        </div>
                      )}

                      <div>
                        <p className="font-bold text-gray-800">
                          {firstName} {lastName}

                          <span
                            className={`ml-2 text-xs font-semibold px-2 py-0.5 rounded ${member.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                              }`}
                          >
                            {member.isActive
                              ? "Active"
                              : "Inactive"}
                          </span>
                        </p>

                        <p className="text-sm text-gray-500">
                          {member.staffProfile?.position ||
                            member.position ||
                            "Staff"}
                        </p>
                      </div>
                    </div>

                    {/* Staff Actions */}

                    <div className="flex flex-wrap gap-2">
                      <Button
                        onClick={() =>
                          handleManage(member.id)
                        }
                        variant="secondary"
                      >
                        {isManaging
                          ? "✕ Close"
                          : "⚙ Manage"}
                      </Button>

                      <button
                        onClick={() =>
                          handleToggleStatus(member)
                        }
                        className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg border transition-colors ${member.isActive
                          ? "border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100"
                          : "border-green-200 bg-green-50 text-green-700 hover:bg-green-100"
                          }`}
                      >
                        {member.isActive
                          ? "Deactivate"
                          : "Activate"}
                      </button>

                      <button
                        onClick={() => {
                          if (
                            confirm(
                              "Remove this staff member?"
                            )
                          ) {
                            deleteStaff(member.id);
                          }
                        }}
                        className="text-red-500 hover:text-red-700 hover:underline text-sm px-2 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  {/* ==================================================
                      EXPANDED MANAGEMENT PANEL
                  ================================================== */}

                  {isManaging && staffDetails && (
                    <div className="border-t border-gray-100 bg-gray-50 p-5 space-y-6">
                      {/* ==================================================
                          PROFILE EDITOR
                      ================================================== */}

                      <div className="bg-white p-4 rounded-xl border border-gray-200">
                        <h4 className="font-bold text-gray-700 mb-3 text-sm uppercase tracking-wide">
                          Edit Profile & Photo
                        </h4>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          {/* First Name */}

                          <input
                            placeholder="First Name"
                            className="p-2 border rounded-lg text-sm"
                            value={
                              editProfileData.firstName
                            }
                            onChange={(e) =>
                              setEditProfileData({
                                ...editProfileData,
                                firstName:
                                  e.target.value,
                              })
                            }
                          />

                          {/* Last Name */}

                          <input
                            placeholder="Last Name"
                            className="p-2 border rounded-lg text-sm"
                            value={
                              editProfileData.lastName
                            }
                            onChange={(e) =>
                              setEditProfileData({
                                ...editProfileData,
                                lastName:
                                  e.target.value,
                              })
                            }
                          />

                          {/* Position */}

                          <input
                            placeholder="Position (e.g. Master Stylist)"
                            className="p-2 border rounded-lg text-sm md:col-span-2"
                            value={
                              editProfileData.position
                            }
                            onChange={(e) =>
                              setEditProfileData({
                                ...editProfileData,
                                position:
                                  e.target.value,
                              })
                            }
                          />

                          {/* Bio */}

                          <textarea
                            placeholder="Bio & Specialties"
                            rows={2}
                            className="p-2 border rounded-lg text-sm md:col-span-2"
                            value={editProfileData.bio}
                            onChange={(e) =>
                              setEditProfileData({
                                ...editProfileData,
                                bio: e.target.value,
                              })
                            }
                          />

                          {/* Image */}

                          <div className="md:col-span-2">
                            <ImageUpload
                              label="Profile Image (Cloudflare R2)"
                              folder="staff"
                              value={
                                editProfileData.imageUrl
                              }
                              onChange={(url) =>
                                setEditProfileData({
                                  ...editProfileData,
                                  imageUrl: url,
                                })
                              }
                            />
                          </div>
                        </div>

                        <Button
                          onClick={handleSaveProfile}
                          disabled={savingProfile}
                        >
                          {savingProfile
                            ? "Saving Profile..."
                            : "Save Profile Changes"}
                        </Button>
                      </div>

                      {/* ==================================================
                          SERVICES + WORKING HOURS
                      ================================================== */}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* ==================================================
                            SERVICES
                        ================================================== */}

                        <div>
                          <h4 className="font-bold text-gray-700 mb-3 text-sm uppercase tracking-wide">
                            Assigned Services
                          </h4>

                          <ul className="mb-3 space-y-1">
                            {staffDetails.staffProfile?.services?.map(
                              (staffService: any) => (
                                <li
                                  key={
                                    staffService.serviceId
                                  }
                                  className="flex justify-between items-center text-sm bg-white p-2 rounded-lg border border-gray-100"
                                >
                                  <span>
                                    {
                                      staffService.service
                                        ?.name
                                    }
                                  </span>

                                  <button
                                    onClick={() =>
                                      handleRemoveService(
                                        staffService.serviceId
                                      )
                                    }
                                    className="text-red-400 hover:text-red-600 text-xs transition-colors"
                                  >
                                    Remove
                                  </button>
                                </li>
                              )
                            )}

                            {!staffDetails.staffProfile
                              ?.services?.length && (
                                <li className="text-sm text-gray-400 italic">
                                  No services assigned
                                </li>
                              )}
                          </ul>

                          <div className="flex gap-2">
                            <select
                              value={selectedServiceId}
                              onChange={(e) =>
                                setSelectedServiceId(
                                  e.target.value
                                )
                              }
                              className="border p-1 rounded-lg text-sm flex-grow"
                            >
                              <option value="">
                                Select service to add
                              </option>

                              {safeServices
                                .filter(
                                  (service: any) =>
                                    !staffDetails.staffProfile?.services?.some(
                                      (staffService: any) =>
                                        String(
                                          staffService.serviceId
                                        ) ===
                                        String(
                                          service.id
                                        )
                                    )
                                )
                                .map(
                                  (service: any) => (
                                    <option
                                      key={service.id}
                                      value={service.id}
                                    >
                                      {service.name}
                                    </option>
                                  )
                                )}
                            </select>

                            <button
                              type="button"
                              onClick={
                                handleAssignService
                              }
                              className="bg-pink-600 hover:bg-pink-700 text-white px-3 py-1 rounded-lg text-sm transition-colors"
                            >
                              Assign
                            </button>
                          </div>
                        </div>

                        {/* ==================================================
                            WORKING HOURS
                        ================================================== */}

                        <div>
                          <h4 className="font-bold text-gray-700 mb-3 text-sm uppercase tracking-wide">
                            Working Hours
                          </h4>

                          <div className="bg-white p-3 rounded-lg border border-gray-100 space-y-2">
                            <div className="flex gap-2 items-center">
                              <select
                                value={
                                  workingHours.dayOfWeek
                                }
                                onChange={(e) =>
                                  setWorkingHours({
                                    ...workingHours,
                                    dayOfWeek: Number(
                                      e.target.value
                                    ),
                                  })
                                }
                                className="border p-1 text-sm rounded-lg flex-grow"
                              >
                                {[
                                  "Sunday",
                                  "Monday",
                                  "Tuesday",
                                  "Wednesday",
                                  "Thursday",
                                  "Friday",
                                  "Saturday",
                                ].map(
                                  (day, index) => (
                                    <option
                                      key={index}
                                      value={index}
                                    >
                                      {day}
                                    </option>
                                  )
                                )}
                              </select>

                              <label className="flex items-center gap-1 text-sm whitespace-nowrap">
                                <input
                                  type="checkbox"
                                  className="accent-pink-600"
                                  checked={
                                    workingHours.isWorkingDay
                                  }
                                  onChange={(e) =>
                                    setWorkingHours({
                                      ...workingHours,
                                      isWorkingDay:
                                        e.target.checked,
                                    })
                                  }
                                />

                                Working Day
                              </label>
                            </div>

                            {workingHours.isWorkingDay && (
                              <div className="flex gap-2 items-center">
                                <input
                                  type="time"
                                  value={
                                    workingHours.startTime
                                  }
                                  onChange={(e) =>
                                    setWorkingHours({
                                      ...workingHours,
                                      startTime:
                                        e.target.value,
                                    })
                                  }
                                  className="border p-1 text-sm rounded-lg flex-grow"
                                />

                                <span className="text-gray-400 text-sm">
                                  →
                                </span>

                                <input
                                  type="time"
                                  value={
                                    workingHours.endTime
                                  }
                                  onChange={(e) =>
                                    setWorkingHours({
                                      ...workingHours,
                                      endTime:
                                        e.target.value,
                                    })
                                  }
                                  className="border p-1 text-sm rounded-lg flex-grow"
                                />
                              </div>
                            )}

                            <button
                              type="button"
                              onClick={
                                handleUpdateWorkingHours
                              }
                              className="w-full bg-pink-600 hover:bg-pink-700 text-white py-1.5 rounded-lg text-sm transition-colors"
                            >
                              Save
                            </button>
                          </div>
                        </div>

                        {/* ==================================================
                            BLOCKED PERIODS
                        ================================================== */}

                        <div className="md:col-span-2 border-t border-gray-200 pt-5">
                          <h4 className="font-bold text-gray-700 mb-3 text-sm uppercase tracking-wide">
                            Blocked Periods (Time Off)
                          </h4>

                          <div className="flex flex-wrap gap-2 mb-3">
                            <input
                              type="date"
                              value={blockedPeriod.date}
                              onChange={(e) =>
                                setBlockedPeriod({
                                  ...blockedPeriod,
                                  date: e.target.value,
                                })
                              }
                              className="border p-1 text-sm rounded-lg"
                            />

                            <input
                              type="time"
                              value={
                                blockedPeriod.startTime
                              }
                              onChange={(e) =>
                                setBlockedPeriod({
                                  ...blockedPeriod,
                                  startTime:
                                    e.target.value,
                                })
                              }
                              className="border p-1 text-sm rounded-lg"
                            />

                            <span className="text-gray-400 self-center text-sm">
                              →
                            </span>

                            <input
                              type="time"
                              value={
                                blockedPeriod.endTime
                              }
                              onChange={(e) =>
                                setBlockedPeriod({
                                  ...blockedPeriod,
                                  endTime:
                                    e.target.value,
                                })
                              }
                              className="border p-1 text-sm rounded-lg"
                            />

                            <input
                              type="text"
                              placeholder="Reason (e.g. Vacation)"
                              value={
                                blockedPeriod.reason
                              }
                              onChange={(e) =>
                                setBlockedPeriod({
                                  ...blockedPeriod,
                                  reason:
                                    e.target.value,
                                })
                              }
                              className="border p-1 text-sm rounded-lg flex-grow min-w-32"
                            />

                            <button
                              type="button"
                              onClick={
                                handleAddBlockedPeriod
                              }
                              className="bg-pink-600 hover:bg-pink-700 text-white px-3 py-1 rounded-lg text-sm transition-colors"
                            >
                              Add
                            </button>
                          </div>

                          <ul className="space-y-1">
                            {staffDetails.blockedPeriods?.map(
                              (blocked: any) => (
                                <li
                                  key={blocked.id}
                                  className="flex justify-between items-center text-sm bg-white p-2 rounded-lg border border-gray-100"
                                >
                                  <span>
                                    {blocked.date}

                                    {blocked.startTime && (
                                      <>
                                        {" "}
                                        {
                                          blocked.startTime
                                        }{" "}
                                        →{" "}
                                        {blocked.endTime ||
                                          "?"}
                                      </>
                                    )}

                                    {blocked.reason && (
                                      <span className="text-gray-400 ml-2">
                                        ({blocked.reason})
                                      </span>
                                    )}
                                  </span>

                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleDeleteBlockedPeriod(
                                        blocked.id
                                      )
                                    }
                                    className="text-red-400 hover:text-red-600 text-xs transition-colors"
                                  >
                                    Remove
                                  </button>
                                </li>
                              )
                            )}

                            {!staffDetails.blockedPeriods
                              ?.length && (
                                <li className="text-sm text-gray-400 italic">
                                  No blocked periods
                                </li>
                              )}
                          </ul>
                        </div>

                        {/* ==================================================
                            ASSIGNED APPOINTMENTS
                        ================================================== */}

                        <div className="md:col-span-2 border-t border-gray-200 pt-5">
                          <h4 className="font-bold text-gray-700 mb-3 text-sm uppercase tracking-wide">
                            Assigned Appointments
                          </h4>

                          {!staffDetails.appointments
                            ?.length ? (
                            <p className="text-sm text-gray-400 italic">
                              No appointments assigned to
                              this stylist
                            </p>
                          ) : (
                            <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto">
                              <table className="w-full text-left text-sm">
                                <thead>
                                  <tr className="bg-gray-50 border-b border-gray-200">
                                    <th className="py-2.5 px-3 text-gray-600 font-semibold">
                                      Customer
                                    </th>

                                    <th className="py-2.5 px-3 text-gray-600 font-semibold">
                                      Service
                                    </th>

                                    <th className="py-2.5 px-3 text-gray-600 font-semibold">
                                      Schedule
                                    </th>

                                    <th className="py-2.5 px-3 text-gray-600 font-semibold">
                                      Status
                                    </th>
                                  </tr>
                                </thead>

                                <tbody>
                                  {(Array.isArray(staffDetails.appointments) ? staffDetails.appointments : []).map(
                                    (appointment: any) => (
                                      <tr
                                        key={
                                          appointment.id
                                        }
                                        className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50"
                                      >
                                        {/* Customer */}

                                        <td className="py-2 px-3">
                                          <div className="font-medium text-gray-800">
                                            {appointment.customerName ||
                                              `${appointment
                                                .user
                                                ?.firstName ||
                                              "Customer"
                                              } ${appointment
                                                .user
                                                ?.lastName ||
                                              ""
                                              }`}
                                          </div>

                                          <div className="text-xs text-gray-400">
                                            {appointment.customerPhone ||
                                              "No phone"}
                                          </div>
                                        </td>

                                        {/* Service */}

                                        <td className="py-2 px-3 text-gray-700">
                                          {appointment.service
                                            ?.name ||
                                            "Unknown Service"}
                                        </td>

                                        {/* Schedule */}

                                        <td className="py-2 px-3 text-gray-600 whitespace-nowrap">
                                          {appointment.date ||
                                            "N/A"}{" "}
                                          at{" "}
                                          {appointment.startTime ||
                                            "N/A"}
                                        </td>

                                        {/* Status */}

                                        <td className="py-2 px-3">
                                          <span
                                            className={`px-2 py-0.5 rounded text-xs font-semibold ${appointment.status ===
                                              "COMPLETED"
                                              ? "bg-green-50 text-green-700"
                                              : appointment.status ===
                                                "CANCELLED"
                                                ? "bg-red-50 text-red-700"
                                                : "bg-yellow-50 text-yellow-700"
                                              }`}
                                          >
                                            {appointment.status ||
                                              "PENDING"}
                                          </span>
                                        </td>
                                      </tr>
                                    )
                                  )}
                                </tbody>
                              </table>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================
          REVIEWS TAB
      ======================================================== */}

      {tab === "reviews" && (
        <div>
          {/* Reviews Header */}

          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">
              Customer Reviews
            </h2>

            <button
              type="button"
              onClick={fetchAllReviews}
              className="text-sm text-pink-600 hover:underline"
            >
              ↻ Refresh
            </button>
          </div>

          {/* Loading */}

          {loadingReviews ? (
            <div className="space-y-3">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-20 bg-gray-100 rounded-xl animate-pulse"
                />
              ))}
            </div>
          ) : (Array.isArray(reviews) ? reviews : []).length === 0 ? (
            /* Empty */

            <div className="text-center py-12 text-gray-400">
              <div className="text-4xl mb-3">
                ⭐
              </div>

              <p className="font-medium">
                No reviews yet.
              </p>
            </div>
          ) : (
            /* Reviews */

            <div className="space-y-3">
              {(Array.isArray(reviews) ? reviews : []).map((review: any) => {
                const score = Math.max(
                  0,
                  Math.min(5, Number(review.score) || 0)
                );

                return (
                  <div
                    key={review.id}
                    className="border border-gray-200 rounded-xl p-4 hover:shadow-sm transition-shadow"
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-grow">
                        {/* Reviewer / Staff / Rating */}

                        <div className="flex flex-wrap items-center gap-3 mb-1">
                          <span className="font-semibold text-gray-800">
                            {review.user?.firstName ||
                              "Customer"}{" "}
                            {review.user?.lastName || ""}
                          </span>

                          <span className="text-gray-400 text-xs">
                            →
                          </span>

                          <span className="text-gray-600 text-sm">
                            {review.staff?.user
                              ?.firstName || "Staff"}{" "}
                            {review.staff?.user
                              ?.lastName || ""}
                          </span>

                          <span className="text-yellow-400 text-sm">
                            {"★".repeat(score)}
                            {"☆".repeat(5 - score)}
                          </span>

                          <span className="text-xs text-gray-400 font-semibold">
                            {score}/5
                          </span>

                          {review.satisfaction && (
                            <span
                              className={`px-2 py-0.5 rounded text-xs font-semibold ${review.satisfaction ===
                                "Satisfied"
                                ? "bg-green-100 text-green-700"
                                : review.satisfaction ===
                                  "Medium"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-red-100 text-red-700"
                                }`}
                            >
                              {review.satisfaction}
                            </span>
                          )}
                        </div>

                        {/* Review Metadata */}

                        <p className="text-xs text-gray-400 mb-2">
                          {review.service?.name ||
                            "Service"}{" "}
                          ·{" "}
                          {review.appointment?.date ||
                            "N/A"}{" "}
                          {review.appointment
                            ?.startTime || ""}{" "}
                          ·{" "}
                          {review.user?.email ||
                            "No email"}
                        </p>

                        {/* Comment */}

                        {review.comment && (
                          <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded-lg italic">
                            "{review.comment}"
                          </p>
                        )}
                      </div>

                      {/* Delete Review */}

                      <button
                        type="button"
                        onClick={() =>
                          handleDeleteReview(
                            review.id
                          )
                        }
                        className="text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap"
                      >
                        🗑 Remove
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AdminStaff;