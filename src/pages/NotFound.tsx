
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FileSearch } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 animate-fade-in">
      <div className="max-w-md w-full text-center">
        <div className="h-24 w-24 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6">
          <FileSearch className="h-12 w-12 text-gray-400" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">404</h1>
        <p className="text-xl text-gray-600 mb-6">Page non trouvée</p>
        <p className="text-gray-500 mb-8">
          La page que vous recherchez n'existe pas ou a été déplacée.
        </p>
        <Button className="btn-primary" onClick={() => window.location.href = "/"}>
          Retour à l'accueil
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
