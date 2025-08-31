import { User } from 'lucide-react';    
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <header className="bg-red-900 border-b border-base-300 text-base-content p-4 shadow-sm">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">
          <img src="/logo-counsel.png" alt="Logo" className="h-10" />
        </Link>
      </div>
    </header>
  )
}

export default Navbar