import { useState } from "react";
import { useNavigation } from "../context/NavigationContext";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const [open, setOpen] = useState(false);
  const { setPage } = useNavigation();
  const { isAuthenticated, user, logout } = useAuth();

  // Base navigation for normal users
  const navItems = [
    { id: 'dashboard', label: 'Home' },
    { id: 'services', label: 'Services' },
    { id: 'staff', label: 'Staff' },
    { id: 'appointments', label: 'Appointments' },
  ];

  if (isAuthenticated && user?.role === 'USER') {
    navItems.push({ id: 'profile', label: 'Profile' });
  }

  const handleNav = (id: string) => {
    setPage(id);
    setOpen(false);
  };

  const handleLogout = () => {
    logout();
    setOpen(false);
  };

  // If the user is an admin, they should ideally be in the Admin Dashboard which has its own sidebar.
  // But if they somehow see the Navbar, we shouldn't show them standard user navigation.
  // The requirement says: "Admin should NOT simply appear as: Home | Services | Stuff | Appointments | Admin"
  // And: "The admin dashboard should be clearly different from the normal customer dashboard."
  if (user?.role === 'ADMIN') {
    return (
      <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center relative z-50">
        <h1 className="text-2xl font-bold text-gray-800">Admin Control</h1>
        <button onClick={handleLogout} className="text-pink-600 hover:underline font-medium">Logout</button>
      </nav>
    );
  }

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center relative z-50">
      
      <h1 
        className="text-2xl font-bold text-pink-600 cursor-pointer"
        onClick={() => setPage('dashboard')}
      >
        BeautyCare
      </h1>

      <div className="hidden md:flex gap-6 text-gray-700 font-medium items-center">
        {navItems.map(item => (
          <button 
            key={item.id} 
            onClick={() => handleNav(item.id)}
            className="hover:text-pink-600 transition-colors"
          >
            {item.label}
          </button>
        ))}

        <div className="border-l border-gray-300 h-6 mx-2"></div>

        {!isAuthenticated ? (
          <>
            <button onClick={() => handleNav('login')} className="hover:text-pink-600 transition-colors">Sign In</button>
            <button onClick={() => handleNav('register')} className="bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700 transition-colors">Register</button>
          </>
        ) : (
          <button onClick={handleLogout} className="text-gray-500 hover:text-red-600 transition-colors">Logout</button>
        )}
      </div>

      <button 
        className="md:hidden text-2xl text-gray-800 focus:outline-none"
        onClick={() => setOpen(!open)}
      >
        ☰
      </button>

      {open && (
        <div className="absolute top-16 left-0 w-full bg-white shadow-lg p-5 flex flex-col gap-4 md:hidden border-t border-gray-100">
          {navItems.map(item => (
            <button 
              key={item.id} 
              onClick={() => handleNav(item.id)}
              className="text-left text-gray-700 hover:text-pink-600 font-medium py-2"
            >
              {item.label}
            </button>
          ))}
          
          <div className="border-t border-gray-100 pt-2 flex flex-col gap-4">
            {!isAuthenticated ? (
              <>
                <button onClick={() => handleNav('login')} className="text-left text-gray-700 hover:text-pink-600 font-medium">Sign In</button>
                <button onClick={() => handleNav('register')} className="text-left text-pink-600 font-bold">Register</button>
              </>
            ) : (
              <button onClick={handleLogout} className="text-left text-red-600 font-medium">Logout</button>
            )}
          </div>
        </div>
      )}

    </nav>
  );
}

export default Navbar;