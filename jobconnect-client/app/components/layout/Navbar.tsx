"use client";
import React, { useState } from "react";

function Navbar() {
  const [IsAuth, setIsAuth] = useState<boolean>(true);
 

  return (
    <main className="flex gap-2 justify-between flex-row">
      {/* Logo */}
      <div>
        <h1>Board connect</h1>
      </div>

      {/* Naviagtion */}
      <div>
        <nav className="border px-3 w-full">
          <ul className="flex px-3">
            <li>Home</li>
            <li>Jobs</li>
            <li>Application</li>
            <li>Contact us</li>
          </ul>
        </nav>
      </div>

      {/* Search and prfile icon */}
      {/* search  which will be hidden on mobile nav bar */}
      <div className="border">
        <input type="text" placeholder="Search for job" />
      </div>
      <div className="gap-4">{IsAuth ? <div>
        <button>

        login 
        </button>
        <button>
            Profile
        </button>
        </div> : <button>register</button>}</div>

     
    </main>
  );
}

export default Navbar;
