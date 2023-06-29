import React from 'react'
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div>
        <nav>
          <ul>
            <li>
              <Link to="/signup">Signup</Link>
            </li>
            <li>
              <Link to="/login">Login</Link>
            </li>
          </ul>
        </nav>
    </div>
  )
}

export default HomePage