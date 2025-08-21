import { useState, useEffect } from "react";
import HomePage from "./components/HomePage";
import CoursePage from "./components/CoursePage";

function App() {
  const [currentRoute, setCurrentRoute] = useState(
    () => window.location.hash.slice(1) || ''
  );
  
  useEffect(() => {
    const handleHashChange = () => {
      setCurrentRoute(window.location.hash.slice(1));
    };
    
    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);
    
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);
  
  if (currentRoute === 'cursos') {
    return <CoursePage />;
  }
  
  // Default to HomePage
  return <HomePage />;
}

export default App;
