import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Search, ShoppingBag } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import SearchDialog from "@/components/SearchDialog";
import logo from "@/assets/scent-studio-logo-gold.png";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { totalItems } = useCart();
  const location = useLocation();

  const navLinks = [
  { label: "Home", path: "/" },
  { label: "Men", path: "/catalog/men" },
  { label: "Women", path: "/catalog/women" },
  { label: "About", path: "/about" },
  { label: "Contact", path: "/contact" }];


  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-6 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <img
              alt="Scent Studio"
              className="h-16 w-auto brightness-125 contrast-110 drop-shadow-[0_0_8px_hsl(40,60%,55%,0.4)]"
              src="/lovable-uploads/21cc2a8c-4744-49c6-bcf6-2f67fee9f74c.png" />
            
          </Link>

          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((item) =>
            <Link
              key={item.label}
              to={item.path}
              className={`font-sans text-sm tracking-[0.2em] uppercase transition-colors duration-300 ${
              location.pathname === item.path ?
              "text-primary" :
              "text-muted-foreground hover:text-primary"}`
              }>
              
                {item.label}
              </Link>
            )}
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setSearchOpen(true)}
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label="Search">
              
              <Search size={20} />
            </button>

            <Link to="/cart" className="relative text-muted-foreground hover:text-primary transition-colors">
              <ShoppingBag size={20} />
              {totalItems > 0 &&
              <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-sans font-semibold">
                  {totalItems}
                </span>
              }
            </Link>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden text-foreground"
              aria-label="Toggle menu">
              
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {isOpen &&
        <div className="md:hidden bg-background border-b border-border">
            <div className="px-6 py-6 flex flex-col gap-6">
              {navLinks.map((item) =>
            <Link
              key={item.label}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className="font-sans text-sm tracking-[0.2em] uppercase text-muted-foreground hover:text-primary transition-colors">
              
                  {item.label}
                </Link>
            )}
            </div>
          </div>
        }
      </nav>

      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </>);

};

export default Header;