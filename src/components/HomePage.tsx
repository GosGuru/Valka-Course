import { Dumbbell } from "lucide-react";
import Header from "./Header";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-black font-['Bebas_Neue']">
      <Header />
      
      {/* Hero Section */}
      <div className="relative flex items-center justify-center min-h-screen overflow-hidden">
        {/* Background Image with Gradient Overlay */}
        <div className="absolute inset-0">
          <img
            src="/hero.jpg"
            alt="Calistenia background"
            className="object-cover w-full h-full"
          />
          {/* Gradient overlay - similar to Amazon Prime style */}
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/50"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-4xl px-6 text-center">
          <h1 className="mb-8 text-6xl tracking-wider text-white md:text-8xl lg:text-9xl drop-shadow-2xl">
            APRENDE A<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
              ENTRENAR
            </span>
          </h1>
          
          <p className="max-w-2xl mx-auto mb-12 text-xl font-normal leading-relaxed text-gray-300 md:text-2xl">
            Domina los fundamentos del entrenamiento de calistenia y desarrollo personal
          </p>

          {/* Call to Action */}
          <a
            href="#cursos"
            onClick={() => window.location.hash = 'cursos'}
            className="inline-flex items-center gap-4 px-8 py-4 text-2xl tracking-wider text-black transition-all duration-300 transform bg-white rounded-lg shadow-2xl hover:bg-gray-100 hover:scale-105"
          >
            <span>CURSOS</span>
            <Dumbbell className="w-8 h-8" />
          </a>
        </div>

        {/* Decorative elements */}
        <div className="absolute transform -translate-x-1/2 bottom-10 left-1/2 text-white/50">
          <div className="animate-bounce">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section className="px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="mb-16 text-4xl tracking-wider text-center text-white md:text-6xl">
            ¿POR QUÉ VALKA?
          </h2>
          
          <div className="grid gap-8 md:grid-cols-3">
            <div className="p-8 transition-colors border bg-zinc-900 rounded-2xl border-zinc-800 hover:border-zinc-700">
              <div className="flex items-center justify-center w-16 h-16 mb-6 bg-white rounded-lg">
                <Dumbbell className="w-8 h-8 text-black" />
              </div>
              <h3 className="mb-4 text-2xl tracking-wider text-white">TÉCNICA PERFECTA</h3>
              <p className="font-normal text-gray-400">
                Aprende la forma correcta desde el primer día. Evita lesiones y maximiza resultados.
              </p>
            </div>

            <div className="p-8 transition-colors border bg-zinc-900 rounded-2xl border-zinc-800 hover:border-zinc-700">
              <div className="flex items-center justify-center w-16 h-16 mb-6 bg-white rounded-lg">
                <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="mb-4 text-2xl tracking-wider text-white">PROGRESO REAL</h3>
              <p className="font-normal text-gray-400">
                Sistema probado de progresión gradual. Ve resultados desde la primera semana.
              </p>
            </div>

            <div className="p-8 transition-colors border bg-zinc-900 rounded-2xl border-zinc-800 hover:border-zinc-700">
              <div className="flex items-center justify-center w-16 h-16 mb-6 bg-white rounded-lg">
                <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="mb-4 text-2xl tracking-wider text-white">SIN EQUIPOS</h3>
              <p className="font-normal text-gray-400">
                Solo necesitas tu cuerpo. Entrena en casa, en el parque, donde quieras.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
