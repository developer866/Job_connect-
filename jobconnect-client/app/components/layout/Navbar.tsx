"use client";

import { useState } from "react";
import { Search, User } from "lucide-react";

function Navbar() {
  const [isAuth] = useState(false);

  return (
    <header className="">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <h1 className="text-2xl font-bold">Board Connect</h1>

        {/* Navigation */}
        <nav className="hidden md:block">
          <ul className="flex items-center gap-8">
            <li className="cursor-pointer hover:text-green-700">Home</li>
            <li className="cursor-pointer hover:text-green-700">Jobs</li>
            <li className="cursor-pointer hover:text-green-700">
              Applications
            </li>
            <li className="cursor-pointer hover:text-green-700">Contact</li>
          </ul>
        </nav>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-green" />

            <input
              type="text"
              placeholder="Search for jobs..."
              className="w-full rounded-full border border-green bg-white py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-lavender"
            />
          </div>

          {/* Auth Buttons */}
          {isAuth ? (
            <>
              <button className="flex items-center gap-2 rounded-lg border px-4 py-2">
                <User className="h-5 w-5" />
                <span>Profile</span>
              </button>
              <button className="rounded-lg bg-green-700 px-4 py-2 text-white">
                Logout
              </button>
            </>
          ) : (
            <>
              <button className="rounded-lg border px-4 py-2">Login</button>

              <button className="rounded-lg bg-green-400 px-4 py-2 text-white">
                Register
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
