import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Lightbulb, Target, Users, Zap, TrendingUp, Eye, Lock } from "lucide-react";
import { getTeamMembers, type TeamMember } from "@/lib/teamManager";

export default function AboutCompany() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  return (
    <Layout>
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-blue-50" style={{ paddingTop: "80px" }}>
        {/* Hero Section */}
        <div className="max-w-6xl mx-auto mb-20">
          <div className="text-center mb-12">
            <div className="flex justify-center" style={{ margin: "40px 0 24px" }}>
              <Lightbulb className="w-16 h-16 text-primary" />
            </div>
            <h1 className="text-5xl sm:text-6xl font-bold text-foreground mb-6">
              Nuestra Visión
            </h1>
            <p className="text-2xl font-semibold text-primary mb-4">
              Construyendo el Futuro de los Mercados de Capitales
            </p>
            <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
              Somos un equipo dedicados a crear un sistema financiero global más abierto, eficiente y accesible.
            </p>
          </div>
        </div>

        {/* Mission Section */}
        <div className="max-w-6xl mx-auto mb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="relative group overflow-hidden rounded-2xl transition-all duration-500 hover:shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-white to-blue-50/20 opacity-90 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute inset-0 rounded-2xl border border-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative p-8 h-full flex flex-col justify-center">
                <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-3">
                  <div>
                    Nuestra Misión
                  </div>
                </h2>
                <p className="text-foreground/70 leading-relaxed">
                  Cambiar la forma de invertir en activos financieros, simple, segura y accesible para todos
                </p>
              </div>
            </div>
            <div className="relative group overflow-hidden rounded-2xl transition-all duration-500 hover:shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-white to-blue-50/20 opacity-90 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute inset-0 rounded-2xl border border-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative p-8 h-full flex flex-col justify-center">
                <h3 className="text-2xl font-bold text-foreground mb-4">Nuestra Visión Futura</h3>
                <p className="text-foreground/70 leading-relaxed">
                  Convertirnos en la plataforma referente de tokenización y finanzas descentralizadas, facilitando inversiones seguras y accesibles.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Core Values Section */}
        <div className="max-w-6xl mx-auto mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Principios Fundamentales que nos Impulsan
            </h2>
            <p className="text-xl text-foreground/70">
              Nuestros valores son la base de nuestra cultura y guían cada decisión que tomamos. Definen quiénes somos y cómo operamos.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="relative group overflow-hidden rounded-2xl transition-all duration-500 hover:shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-white to-blue-50/20 opacity-90 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute inset-0 rounded-2xl border border-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative p-8">
                <div className="flex items-center gap-4 mb-4">
                  <Eye className="w-8 h-8 text-primary flex-shrink-0" />
                  <h3 className="text-2xl font-bold text-foreground">Democratizar el Acceso</h3>
                </div>
                <p className="text-foreground/70">
                  Rompemos barreras para que los mercados de capitales sean accesibles para todos, en todas partes.
                </p>
              </div>
            </div>

            <div className="relative group overflow-hidden rounded-2xl transition-all duration-500 hover:shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-white to-blue-50/20 opacity-90 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute inset-0 rounded-2xl border border-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative p-8">
                <div className="flex items-center gap-4 mb-4">
                  <Zap className="w-8 h-8 text-primary flex-shrink-0" />
                  <h3 className="text-2xl font-bold text-foreground">Impulsar la Innovación</h3>
                </div>
                <p className="text-foreground/70">
                  Somos pioneros, aprovechando la tecnología de vanguardia para redefinir los servicios financieros.
                </p>
              </div>
            </div>

            <div className="relative group overflow-hidden rounded-2xl transition-all duration-500 hover:shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-white to-blue-50/20 opacity-90 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute inset-0 rounded-2xl border border-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative p-8">
                <div className="flex items-center gap-4 mb-4">
                  <TrendingUp className="w-8 h-8 text-primary flex-shrink-0" />
                  <h3 className="text-2xl font-bold text-foreground">Potenciar el Crecimiento</h3>
                </div>
                <p className="text-foreground/70">
                  Proporcionamos las herramientas e infraestructura para que las empresas y los inversores prosperen.
                </p>
              </div>
            </div>

            <div className="relative group overflow-hidden rounded-2xl transition-all duration-500 hover:shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-white to-blue-50/20 opacity-90 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute inset-0 rounded-2xl border border-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative p-8">
                <div className="flex items-center gap-4 mb-4">
                  <Lock className="w-8 h-8 text-primary flex-shrink-0" />
                  <h3 className="text-2xl font-bold text-foreground">Fomentar la Transparencia</h3>
                </div>
                <p className="text-foreground/70">
                  Creemos en el poder de los mercados abiertos y transparentes, construidos sobre la confianza y la integridad.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Innovative Approach Section */}
        <div className="max-w-6xl mx-auto mb-20">
          <div className="relative group overflow-hidden rounded-2xl transition-all duration-500">
            <div className="absolute inset-0 bg-gradient-to-br from-white to-blue-50/20 opacity-90 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute inset-0 rounded-2xl border border-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative p-12">
              <h2 className="text-4xl font-bold text-foreground mb-6 text-center">Nuestro Enfoque Innovador</h2>
              <p className="text-xl text-foreground/70 leading-relaxed">
                Hemos diseñado un modelo de negocio transparente y sostenible que alinea nuestro éxito con el de nuestros clientes. Descubre cómo estamos creando valor en el ecosistema de activos digitales.
              </p>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4 flex items-center justify-center gap-3">
              <Users className="w-10 h-10 text-primary" />
              Conoce a la Fuerza Impulsora
            </h2>
            <p className="text-xl text-foreground/70">
              Nuestro equipo de liderazgo reúne décadas de experiencia en los sectores financiero, tecnológico y regulatorio.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
            {/* Exequiel Aravena */}
            <div className="bg-white rounded-lg border border-border/40 overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-64 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                <div className="w-32 h-32 rounded-full bg-primary/20 flex items-center justify-center">
                  <Users className="w-16 h-16 text-primary" />
                </div>
              </div>
              <div className="p-8 text-center">
                <h3 className="text-2xl font-bold text-foreground mb-2">Exequiel Aravena</h3>
                <p className="text-primary font-semibold mb-4">Cofundador</p>
                <p className="text-foreground/70">
                  Líder estratégico con visión en tecnología financiera y mercados de capitales.
                </p>
              </div>
            </div>

            {/* Ricardo Cañas */}
            <div className="bg-white rounded-lg border border-border/40 overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-64 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                <div className="w-32 h-32 rounded-full bg-primary/20 flex items-center justify-center">
                  <Users className="w-16 h-16 text-primary" />
                </div>
              </div>
              <div className="p-8 text-center">
                <h3 className="text-2xl font-bold text-foreground mb-2">Ricardo Cañas</h3>
                <p className="text-primary font-semibold mb-4">Cofundador</p>
                <p className="text-foreground/70">
                  Especialista en desarrollo tecnológico y arquitectura de soluciones blockchain.
                </p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center py-12">
            <h3 className="text-2xl font-bold text-foreground mb-6">
              Únete a Nuestro Equipo
            </h3>
            <p className="text-foreground/70 mb-8 max-w-2xl mx-auto">
              Si comparte nuestra visión de democratizar los mercados de capitales y tiene experiencia en finanzas o tecnología, nos encantaría conocerlo.
            </p>
            <a
              href="/nosotros/careers"
              className="inline-block px-8 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-bold"
            >
              Ver Empleos Disponibles
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
}
