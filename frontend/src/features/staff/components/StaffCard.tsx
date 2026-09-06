import Button from "../../../components/Button";
import Avatar from "../../../components/Avatar";
import { useLanguage } from "../../../context/LanguageContext";

interface StaffCardProps {
  staff: any;
  onSelect: (staff: any) => void;
}

function StaffCard({ staff, onSelect }: StaffCardProps) {
  const { t, localizeStaff } = useLanguage();
  const staffImg = staff.staffProfile?.imageUrl || staff.imageUrl || staff.image;
  const firstName = staff.user?.firstName || staff.firstName || '';
  const lastName = staff.user?.lastName || staff.lastName || '';
  const loc = localizeStaff(staff);
  const ratingLen = staff.staffProfile?.ratings?.length || 0;

  const isDeactivated = staff.isActive === false || staff.staffProfile?.isActive === false || staff.user?.isActive === false;
  const deactivationReason = staff.staffProfile?.deactivationReason || staff.deactivationReason;

  return (
    <div className="bg-white rounded-xl border border-pink-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col h-full relative">

      <div className="h-52 bg-pink-50 flex items-center justify-center overflow-hidden flex-shrink-0 relative">
        {staffImg ? (
          <img
            src={staffImg}
            alt={`${firstName} ${lastName}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-pink-300 font-bold text-4xl">
            {firstName?.[0]}{lastName?.[0]}
          </span>
        )}
        {isDeactivated && (
          <span className="absolute top-2 right-2 bg-amber-500/90 text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-xs backdrop-blur-xs">
            {t('staff.unavailable', 'Unavailable')}
          </span>
        )}
      </div>

      <div className="p-5 flex flex-col flex-grow justify-between">

        <div>
          <div className="flex items-center gap-3">
            <Avatar name={`${firstName} ${lastName}`} />

            <div>
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <span>{firstName} {lastName}</span>
                {isDeactivated && (
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-amber-100 text-amber-700">
                    {t('staff.onLeave', 'On Leave')}
                  </span>
                )}
              </h3>

              <p className="text-sm text-pink-600 font-medium">
                {loc.position}
              </p>
            </div>
          </div>

          <div className="mt-4 text-sm text-gray-600">
            <p className="line-clamp-2">
              <span className="font-medium text-gray-500">{t('staff.bio', 'Bio:')}</span>{" "}
              {loc.bio}
            </p>

            <p className="mt-2 text-sm text-gray-600">
              <span className="font-medium text-gray-500">{t('staff.rating', 'Rating:')}</span>{" "}
              {staff.averageRating ? (
                <span className="inline-flex items-center gap-1">
                  <span className="text-yellow-500">★</span>
                  <span className="font-semibold text-gray-800">{staff.averageRating.toFixed(1)}</span>
                  <span className="text-gray-400">({ratingLen} {ratingLen === 1 ? t('staff.review', 'review') : t('staff.reviews', 'reviews')})</span>
                </span>
              ) : (
                <span className="text-gray-400 italic text-xs">{t('staff.newNoReviews', 'New (No reviews)')}</span>
              )}
            </p>

            {isDeactivated && deactivationReason && (
              <p className="mt-2.5 text-xs bg-amber-50 text-amber-800 border border-amber-200 rounded-lg px-2.5 py-1.5">
                <span className="font-semibold">Unavailable:</span> {deactivationReason}
              </p>
            )}
          </div>
        </div>

        <Button
          variant="primary"
          size="sm"
          className="w-full mt-5"
          onClick={() => onSelect(staff)}
        >
          {t('staff.viewProfile', 'View Profile')}
        </Button>

      </div>
    </div>
  );
}

export default StaffCard;