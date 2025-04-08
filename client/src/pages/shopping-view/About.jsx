import React, { useEffect, useRef, useState } from 'react';
import { Award, Clock, Heart, Package, Shield, Star, Truck, Users } from 'lucide-react';
import Footer from '@/components/shopping-view/Footer';
import aboutHero from '../../assets/hero.webp'; // You'll need to add this image
import teamMember1 from '../../assets/team1.jpg'; // You'll need to add these team images
import teamMember2 from '../../assets/team2.jpg';
import teamMember3 from '../../assets/team3.jpg';

function About() {
  const historyRef = useRef(null);
  const missionRef = useRef(null);
  const teamRef = useRef(null);
  const brandsRef = useRef(null);
  
  const [historyVisible, setHistoryVisible] = useState(false);
  const [missionVisible, setMissionVisible] = useState(false);
  const [teamVisible, setTeamVisible] = useState(false);
  const [brandsVisible, setBrandsVisible] = useState(false);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.3,
    };

    const createObserver = (ref, setVisibleFunction) => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisibleFunction(true);
            observer.unobserve(ref.current);
          }
        },
        observerOptions
      );

      if (ref.current) {
        observer.observe(ref.current);
      }

      return observer;
    };

    const historyObserver = createObserver(historyRef, setHistoryVisible);
    const missionObserver = createObserver(missionRef, setMissionVisible);
    const teamObserver = createObserver(teamRef, setTeamVisible);
    const brandsObserver = createObserver(brandsRef, setBrandsVisible);

    return () => {
      if (historyRef.current) historyObserver.unobserve(historyRef.current);
      if (missionRef.current) missionObserver.unobserve(missionRef.current);
      if (teamRef.current) teamObserver.unobserve(teamRef.current);
      if (brandsRef.current) brandsObserver.unobserve(brandsRef.current);
    };
  }, []);

  const values = [
    { icon: <Heart className="h-10 w-10 text-rose-500" />, title: "Passion for Fashion", description: "We're driven by our love for style and design." },
    { icon: <Users className="h-10 w-10 text-blue-500" />, title: "Customer First", description: "Your satisfaction is at the center of everything we do." },
    { icon: <Shield className="h-10 w-10 text-green-500" />, title: "Quality Promise", description: "We never compromise on the quality of our products." },
    { icon: <Star className="h-10 w-10 text-yellow-500" />, title: "Trendsetting", description: "We stay ahead of fashion trends to bring you the latest styles." }
  ];

  const team = [
    { name: "Alex Johnson", role: "Founder & CEO", image: teamMember1, quote: "Fashion is about dreaming and making other people dream."},
    { name: "Samantha Lee", role: "Creative Director", image: teamMember2, quote: "Style is a way to say who you are without having to speak." },
    { name: "David Martinez", role: "Head of Operations", image: teamMember3, quote: "Quality is remembered long after price is forgotten." }
  ];

  const brand =[
    {image:"https://img.freepik.com/free-vector/gradient-culture-logo-template_23-2149840309.jpg?ga=GA1.1.2063178488.1736256701&semt=ais_hybrid"},
    {image:"https://img.freepik.com/free-vector/bird-colorful-logo-gradient-vector_343694-1365.jpg?ga=GA1.1.2063178488.1736256701&semt=ais_hybrid"},
    {image:"https://img.freepik.com/premium-vector/lettering-calligraphic-vintage-composition_949698-697.jpg?ga=GA1.1.2063178488.1736256701&semt=ais_hybrid"},
    {image:"https://img.freepik.com/free-vector/logo-with-abstract-colorful-shape_1043-50.jpg?ga=GA1.1.2063178488.1736256701&semt=ais_hybrid"},
    {image:"https://img.freepik.com/premium-vector/premium-typography-logo-vector-template_714421-120.jpg?ga=GA1.1.2063178488.1736256701&semt=ais_hybrid"},
  ]

  return (
    <div className="flex flex-col min-h-screen pt-[11.3vh]">
      {/* Hero Section */}
      <div className="relative w-full h-[60vh] overflow-hidden">
        <div 
          className="absolute inset-0 bg-black/40 flex items-center justify-center z-10"
        >
          <div className="text-center px-4">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 animate-scale-up opacity-0" style={{ animationDuration: "1500ms" }}>About Leo Fashion</h1>
            <p className="text-xl text-white max-w-2xl mx-auto animate-scale-up opacity-0" style={{ animationDuration: "1500ms", animationDelay: "300ms" }}>
              Redefining style since 2015, bringing you the best in fashion from around the world
            </p>
          </div>
        </div>
        <img 
          src={aboutHero} 
          alt="About Leo Fashion" 
          className="w-full h-full object-cover"
        />
      </div>

      {/* Our History Section */}
      <section ref={historyRef} className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className={`text-3xl font-bold opacity-0 text-center mb-8 ${historyVisible ? 'animate-slide-down' : 'opacity-0'}`} style={{ animationDuration: "1000ms" }}>Our Journey</h2>
            <div className={`space-y-6 ${historyVisible ? 'animate-scale-up' : 'opacity-0'}`} style={{ animationDuration: "1200ms", animationDelay: "200ms" }}>
              <p className="text-lg leading-relaxed">
                Leo Fashion was founded in 2015 with a simple yet ambitious vision: to create a fashion brand that combines quality, style, and accessibility. What started as a small boutique in the heart of Surat has now grown into one of India's most recognized fashion retailers.
              </p>
              <p className="text-lg leading-relaxed">
                Our founder, Alex Johnson, noticed a gap in the market for high-quality fashion that didn't break the bank. Drawing from years of experience in the textile industry, Alex assembled a team of passionate designers and fashion experts to create the first Leo Fashion collection.
              </p>
              <p className="text-lg leading-relaxed">
                Today, we're proud to serve customers across the country, offering a curated selection of clothing and accessories that help people express their unique style. Our growth is a testament to our commitment to quality and customer satisfaction.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section ref={missionRef} className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className={`text-3xl font-bold opacity-0 mb-4 ${missionVisible ? 'animate-slide-down' : 'opacity-0'}`} style={{ animationDuration: "1000ms", animationDelay:"200ms" }}>Our Mission & Values</h2>
            <p className={`text-lg opacity-0 ${missionVisible ? 'animate-slide-down' : 'opacity-0'}`} style={{ animationDuration: "1200ms", animationDelay: "200ms" }}>
              We believe fashion should be accessible to everyone while maintaining the highest standards of quality and ethical production.
            </p>
          </div>
          
          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 ${missionVisible ? 'animate-slide-up' : 'opacity-0'}`} style={{ animationDuration: "1200ms", animationDelay: "400ms" }}>
            {values.map((value, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-xl transition-shadow">
                <div className="inline-block p-4 rounded-full bg-gray-100 mb-4">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Leo Fashion</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg text-center hover:bg-gray-100 transition-colors">
              <Truck className="h-12 w-12 mx-auto mb-4 text-indigo-600" />
              <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
              <p className="text-gray-600">Orders dispatched within 24 hours with nationwide delivery</p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg text-center hover:bg-gray-100 transition-colors">
              <Package className="h-12 w-12 mx-auto mb-4 text-indigo-600" />
              <h3 className="text-xl font-semibold mb-2">Easy Returns</h3>
              <p className="text-gray-600">Hassle-free 30-day return policy for all purchases</p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg text-center hover:bg-gray-100 transition-colors">
              <Award className="h-12 w-12 mx-auto mb-4 text-indigo-600" />
              <h3 className="text-xl font-semibold mb-2">Premium Quality</h3>
              <p className="text-gray-600">Rigorous quality checks ensure long-lasting products</p>
            </div>
          </div>
        </div>
      </section>

      {/* Meet Our Team */}
      <section ref={teamRef} className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className={`text-3xl font-bold text-center mb-12 opacity-0 ${teamVisible ? 'animate-slide-down' : 'opacity-0'}`} style={{ animationDuration: "1000ms" }}>Meet Our Team</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div 
                key={index} 
                className={`bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow opacity-0 ${teamVisible ? 'animate-slide-down' : 'opacity-0'}`}
                style={{ animationDuration: "10y00ms", animationDelay: `${200 * (index + 1)}ms` }}
              >
                <img 
                  src={member.image} 
                  alt={member.name} 
                  className="w-full h-[50vh] object-cover object-top"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                  <p className="text-indigo-600 mb-4">{member.role}</p>
                  <p className="text-gray-600 italic">"{member.quote}"</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Brands */}
      <section ref={brandsRef} className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className={`text-3xl font-bold text-center mb-12 ${brandsVisible ? 'animate-slide-down' : 'opacity-0'}`} style={{ animationDuration: "1000ms" }}>Brands We Partner With</h2>
          
          <div className={`flex flex-wrap justify-center items-center gap-8 md:gap-16 ${brandsVisible ? 'animate-slide-up' : 'opacity-0'}`} style={{ animationDuration: "1200ms", animationDelay: "200ms" }}>
            {brand.map((e, index) => (
              <div key={index} className="w-32 h-32 p-4 grayscale hover:grayscale-0 transition-all duration-300">
                <img 
                  src={e.image} 
                  alt={`Brand Partner ${index + 1}`} 
                  className="w-full h-full object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Achievement Timeline */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Milestones</h2>
          
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-indigo-200"></div>
              
              {/* Timeline items */}
              <div className="space-y-16">
                <div className="relative">
                  <div className="absolute left-1/2 transform -translate-x-1/2 -mt-3">
                    <div className="w-6 h-6 rounded-full bg-indigo-600"></div>
                  </div>
                  <div className="ml-auto mr-8 md:mr-auto md:ml-8 md:pl-10 max-w-xs">
                    <div className="bg-white p-4 rounded-lg shadow-md">
                      <h3 className="text-lg font-semibold">2015</h3>
                      <p className="text-gray-600">Leo Fashion was founded in Surat</p>
                    </div>
                  </div>
                </div>
                
                <div className="relative">
                  <div className="absolute left-1/2 transform -translate-x-1/2 -mt-3">
                    <div className="w-6 h-6 rounded-full bg-indigo-600"></div>
                  </div>
                  <div className="mr-auto ml-8 md:ml-auto md:mr-8 md:pr-10 max-w-xs md:text-right">
                    <div className="bg-white p-4 rounded-lg shadow-md">
                      <h3 className="text-lg font-semibold">2018</h3>
                      <p className="text-gray-600">Expanded to 10 retail locations across India</p>
                    </div>
                  </div>
                </div>
                
                <div className="relative">
                  <div className="absolute left-1/2 transform -translate-x-1/2 -mt-3">
                    <div className="w-6 h-6 rounded-full bg-indigo-600"></div>
                  </div>
                  <div className="ml-auto mr-8 md:mr-auto md:ml-8 md:pl-10 max-w-xs">
                    <div className="bg-white p-4 rounded-lg shadow-md">
                      <h3 className="text-lg font-semibold">2020</h3>
                      <p className="text-gray-600">Launched our e-commerce platform</p>
                    </div>
                  </div>
                </div>
                
                <div className="relative">
                  <div className="absolute left-1/2 transform -translate-x-1/2 -mt-3">
                    <div className="w-6 h-6 rounded-full bg-indigo-600"></div>
                  </div>
                  <div className="mr-auto ml-8 md:ml-auto md:mr-8 md:pr-10 max-w-xs md:text-right">
                    <div className="bg-white p-4 rounded-lg shadow-md">
                      <h3 className="text-lg font-semibold">2023</h3>
                      <p className="text-gray-600">Achieved 1 million+ satisfied customers</p>
                    </div>
                  </div>
                </div>
                
                <div className="relative">
                  <div className="absolute left-1/2 transform -translate-x-1/2 -mt-3">
                    <div className="w-6 h-6 rounded-full bg-indigo-600"></div>
                  </div>
                  <div className="ml-auto mr-8 md:mr-auto md:ml-8 md:pl-10 max-w-xs">
                    <div className="bg-white p-4 rounded-lg shadow-md">
                      <h3 className="text-lg font-semibold">2025</h3>
                      <p className="text-gray-600">Launched sustainable fashion collection</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default About;