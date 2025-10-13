import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom';
import './Header.css'
import { Menu, X } from 'lucide-react';

export default function Header () {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();

    const navItems = [
        { path: '/', label: 'Home'},
        { path: '/projects', label: 'Projects'},
        { path: '/about', label: 'About'},
        { path: '/contact', label: 'Contact'},
    ]
  return (
    <header className="header">
        <div className="container">
            <Link 
            to="/" className="logo">
                Portfolio
            </Link>

            <nav className={`nav ${isMenuOpen? 'nav-open':''}`}>
                {navItems.map((item)=>
                    <Link 
                    key={item.path}
                    to={item.path}
                    className = {`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                    onClick = {() => setIsMenuOpen(false)}
                    >
                        {item.label}
                    </Link>          
                )}
            </nav>
            <button>
                {isMenuOpen ? <X size={24}/> : <Menu size={24}/>}
            </button>
        </div>
    </header>
  )
}
