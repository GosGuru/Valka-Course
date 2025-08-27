import { useState } from "react";
import { Menu, X } from "lucide-react";

const logoUrl = `${import.meta.env.BASE_URL}logo.png`;

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <header className="sticky top-0 z-50 flex items-center justify-between w-full h-16 px-5 border-b bg-black/80 border-zinc-800 backdrop-blur-sm">
        {/* Logo */}
        <a 
          href="#" 
          onClick={() => window.location.hash = ''}
          className="z-10"
        >
          <img
            className="w-24 h-auto transition-opacity hover:opacity-80"
            src={logoUrl}
            alt="Valka Logo"
          />
        </a>

        {/* Desktop Navigation */}
        <nav className="items-center justify-center flex-1 hidden md:flex">
          <a 
            href="#cursos" 
            onClick={() => window.location.hash = 'cursos'}
            className="text-white text-xl font-['Bebas_Neue'] tracking-wider hover:text-stone-300 transition-colors"
          >
            CURSOS
          </a>
        </nav>

        {/* Mobile Menu Button */}
        <button 
          onClick={toggleMenu}
          className="z-10 p-2 text-white transition-colors rounded-md md:hidden hover:bg-zinc-800"
        >
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </header>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center md:hidden bg-black/95 backdrop-blur-sm">
          <nav className="text-center">
            <a 
              href="#cursos" 
              onClick={() => {
                window.location.hash = 'cursos';
                toggleMenu();
              }}
              className="block text-white text-3xl font-['Bebas_Neue'] tracking-wider hover:text-stone-300 transition-colors"
            >
              CURSOS
            </a>
          </nav>
        </div>
      )}
    </>
  );
};

export default Header;
