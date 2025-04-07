import React, { useState, useRef, useEffect } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, Clock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import Footer from '@/components/shopping-view/Footer';

function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const mapRef = useRef(null);
  const formRef = useRef(null);
  const infoRef = useRef(null);
  
  const [mapVisible, setMapVisible] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [infoVisible, setInfoVisible] = useState(false);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.2,
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

    const mapObserver = createObserver(mapRef, setMapVisible);
    const formObserver = createObserver(formRef, setFormVisible);
    const infoObserver = createObserver(infoRef, setInfoVisible);

    return () => {
      if (mapRef.current) mapObserver.unobserve(mapRef.current);
      if (formRef.current) formObserver.unobserve(formRef.current);
      if (infoRef.current) infoObserver.unobserve(infoRef.current);
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field if it exists
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = "Name is required";
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email address is invalid";
    }
    if (!formData.message.trim()) errors.message = "Message is required";
    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validateForm();
    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      setIsSubmitting(true);

      // Simulating form submission
      setTimeout(() => {
        toast({
          title: "Message Sent!",
          description: "Thank you for reaching out. We'll get back to you soon.",
        });
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: '',
        });
        setIsSubmitting(false);
      }, 1500);
    }
  };

  // FAQ data
  const faqs = [
    {
      question: "What are your shipping and delivery times?",
      answer: "We offer standard delivery (3-5 business days) and express delivery (1-2 business days) across India. International shipping typically takes 7-14 business days."
    },
    {
      question: "What is your return policy?",
      answer: "We accept returns within 30 days of purchase. Items must be in original condition with tags attached. Please visit our Returns page for more details."
    },
    {
      question: "Do you offer size exchanges?",
      answer: "Yes, we offer free size exchanges. Simply request an exchange through your account or contact our customer service team."
    },
    {
      question: "How can I track my order?",
      answer: "Once your order ships, you'll receive a tracking number via email. You can also track your order through your account dashboard."
    }
  ];

  return (
    <div className="flex flex-col min-h-screen pt-[11.3vh]">
      {/* Hero Section */}
      <div className="relative w-full h-[40vh] overflow-hidden">
        <div 
          className="absolute inset-0 bg-black/50 flex items-center justify-center z-10"
        >
          <div className="text-center px-4">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 animate-scale-up opacity-0" style={{ animationDuration: "1500ms" }}>Contact Us</h1>
            <p className="text-xl text-white max-w-2xl mx-auto animate-slide-down opacity-0" style={{ animationDuration: "1500ms", animationDelay: "300ms" }}>
              We're here to help with any questions or concerns
            </p>
          </div>
        </div>
        <img 
          src="https://images.pexels.com/photos/821754/pexels-photo-821754.jpeg?auto=compress&cs=tinysrgb&w=600" 
          alt="Contact Leo Fashion" 
          className="w-full h-full object-cover"
        />
      </div>

      {/* Contact Info Cards */}
      <section ref={infoRef} className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className={`p-6 shadow-md hover:shadow-lg transition-shadow ${infoVisible ? 'animate-slide-up' : 'opacity-0'}`} style={{ animationDuration: "1000ms" }}>
              <div className="flex flex-col items-center text-center">
                <div className="p-4 rounded-full bg-indigo-100 mb-4">
                  <Phone className="h-6 w-6 text-indigo-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Call Us</h3>
                <p className="text-gray-600 mb-4">Our team is available Monday to Saturday, 9am to 6pm</p>
                <a href="tel:+911234567890" className="text-indigo-600 font-medium">+91 123 456 7890</a>
              </div>
            </Card>
            
            <Card className={`p-6 shadow-md hover:shadow-lg transition-shadow ${infoVisible ? 'animate-slide-up' : 'opacity-0'}`} style={{ animationDuration: "1000ms", animationDelay: "200ms" }}>
              <div className="flex flex-col items-center text-center">
                <div className="p-4 rounded-full bg-indigo-100 mb-4">
                  <Mail className="h-6 w-6 text-indigo-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Email Us</h3>
                <p className="text-gray-600 mb-4">We'll respond to your inquiry within 24 hours</p>
                <a href="mailto:info@leofashion.com" className="text-indigo-600 font-medium">info@leofashion.com</a>
              </div>
            </Card>
            
            <Card className={`p-6 shadow-md hover:shadow-lg transition-shadow ${infoVisible ? 'animate-slide-up' : 'opacity-0'}`} style={{ animationDuration: "1000ms", animationDelay: "400ms" }}>
              <div className="flex flex-col items-center text-center">
                <div className="p-4 rounded-full bg-indigo-100 mb-4">
                  <MapPin className="h-6 w-6 text-indigo-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Visit Us</h3>
                <p className="text-gray-600 mb-4">Our headquarters and flagship store</p>
                <address className="not-italic text-indigo-600 font-medium">
                  123 Fashion Street, Surat, Gujarat 345006
                </address>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Form and Map */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div ref={formRef} className={`${formVisible ? 'animate-slide-right' : 'opacity-0'}`} style={{ animationDuration: "1200ms" }}>
              <h2 className="text-3xl font-bold mb-6">Send Us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="name">Your Name</Label>
                  <Input 
                    id="name"
                    name="name" 
                    value={formData.name} 
                    onChange={handleChange}
                    className={formErrors.name ? "border-red-500" : ""}
                  />
                  {formErrors.name && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {formErrors.name}
                    </p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="email">Your Email</Label>
                  <Input 
                    id="email"
                    name="email" 
                    type="email" 
                    value={formData.email} 
                    onChange={handleChange}
                    className={formErrors.email ? "border-red-500" : ""}
                  />
                  {formErrors.email && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {formErrors.email}
                    </p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="subject">Subject (Optional)</Label>
                  <Input 
                    id="subject"
                    name="subject" 
                    value={formData.subject} 
                    onChange={handleChange}
                  />
                </div>
                
                <div>
                  <Label htmlFor="message">Your Message</Label>
                  <Textarea 
                    id="message"
                    name="message" 
                    rows={5} 
                    value={formData.message} 
                    onChange={handleChange}
                    className={formErrors.message ? "border-red-500" : ""}
                  />
                  {formErrors.message && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {formErrors.message}
                    </p>
                  )}
                </div>
                
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full"
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <Send className="h-5 w-5 mr-2" />
                      Send Message
                    </span>
                  )}
                </Button>
              </form>
            </div>
            
            {/* Map */}
            <div ref={mapRef} className={`${mapVisible ? 'animate-slide-left' : 'opacity-0'}`} style={{ animationDuration: "1200ms" }}>
              <h2 className="text-3xl font-bold mb-6">Our Location</h2>
              <div className="rounded-lg overflow-hidden shadow-md h-96 bg-gray-200">
                {/* Placeholder for map - in a real application, this would be replaced with an actual map component */}
                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                  <img 
                    src="https://img.freepik.com/free-vector/street-map-desing-with-catering-sector-pins_23-2147618798.jpg?ga=GA1.1.2063178488.1736256701&semt=ais_hybrid" 
                    alt="Store Location Map" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              
              <div className="mt-6 space-y-4">
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-indigo-600 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium">Address</h3>
                    <p className="text-gray-600">123 Fashion Street, Surat, Gujarat 345006, India</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Clock className="h-5 w-5 text-indigo-600 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium">Business Hours</h3>
                    <p className="text-gray-600">Monday - Saturday: 10:00 AM - 8:00 PM</p>
                    <p className="text-gray-600">Sunday: 11:00 AM - 6:00 PM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Find quick answers to common questions about our services, shipping, and policies
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {faqs.map((faq, index) => (
              <Card key={index} className="p-6 shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-full bg-indigo-100 flex-shrink-0">
                    <MessageSquare className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{faq.question}</h3>
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">Still have questions?</p>
            <Button variant="outline" className="group">
              <Mail className="h-4 w-4 mr-2 group-hover:text-indigo-600" />
              <span className="group-hover:text-indigo-600">Contact Our Support Team</span>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default ContactUs;