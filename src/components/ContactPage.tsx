import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card, CardContent } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', inquiryType: 'general', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();


  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email';
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const { data, error } = await supabase.functions.invoke('send-contact-auto-reply', {
        body: formData
      });


      if (error) {
        throw error;
      }

      // Show success message
      setSubmitted(true);
      toast({
        title: "Message Sent!",
        description: "Thank you for contacting us. We'll get back to you soon.",
      });

      // Reset form after 5 seconds
      setTimeout(() => {
        setSubmitted(false);
        setFormData({ name: '', email: '', inquiryType: 'general', subject: '', message: '' });
      }, 5000);


    } catch (error: any) {
      console.error('Error sending contact form:', error);
      
      toast({
        title: "Failed to Send Message",
        description: error.message || "Please try again or contact us directly via phone or email.",
        variant: "destructive",
      });

      setErrors({ 
        submit: 'Failed to send message. Please try again or contact us directly.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50">
      <div className="relative h-64 bg-cover bg-center" style={{ backgroundImage: 'url(https://d64gsuwffb70l.cloudfront.net/68e1fc3eae390c5be0b91092_1760090562884_a357438c.webp)' }}>
        <div className="absolute inset-0 bg-blue-900/70 flex items-center justify-center">
          <h1 className="text-5xl font-bold text-white">Contact Us</h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-3xl font-bold mb-6">Get In Touch</h2>
            <p className="text-gray-600 mb-8">Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
            
            <div className="space-y-6">
              <Card>
                <CardContent className="flex items-start gap-4 p-6">
                  <Mail className="w-6 h-6 text-blue-600 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Email</h3>
                    <a href="mailto:alaskapaynotification@gmail.com" className="text-blue-600 hover:underline">alaskapaynotification@gmail.com</a>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="flex items-start gap-4 p-6">
                  <Phone className="w-6 h-6 text-blue-600 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Phone</h3>
                    <a href="tel:+2349015765610" className="text-blue-600 hover:underline">+234 901 576 5610</a>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="flex items-start gap-4 p-6">
                  <MapPin className="w-6 h-6 text-blue-600 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Address</h3>
                    <p className="text-gray-600">100 Suleiman Barau Road<br />Opposite FIRS, Suleja<br />Niger State, Nigeria</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <Card>
            <CardContent className="p-8">
              {submitted ? (
                <div className="text-center py-12">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Message Sent!</h3>
                  <p className="text-gray-600">We'll get back to you soon.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {errors.submit && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                      <p className="text-red-800 text-sm">{errors.submit}</p>
                    </div>
                  )}
                  
                  <div>
                    <Input 
                      placeholder="Your Name" 
                      value={formData.name} 
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      disabled={isSubmitting}
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                  </div>
                  
                  <div>
                    <Input 
                      type="email" 
                      placeholder="Your Email" 
                      value={formData.email} 
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      disabled={isSubmitting}
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                  </div>
                  
                  <div>
                    <Select 
                      value={formData.inquiryType} 
                      onValueChange={(value) => setFormData({...formData, inquiryType: value})}
                      disabled={isSubmitting}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Inquiry Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General Inquiry</SelectItem>
                        <SelectItem value="support">Technical Support</SelectItem>
                        <SelectItem value="sales">Sales & Pricing</SelectItem>
                        <SelectItem value="partnership">Partnership Opportunity</SelectItem>
                        <SelectItem value="billing">Billing & Payments</SelectItem>
                        <SelectItem value="feedback">Feedback & Suggestions</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  
                  <div>
                    <Input 
                      placeholder="Subject" 
                      value={formData.subject} 
                      onChange={(e) => setFormData({...formData, subject: e.target.value})}
                      disabled={isSubmitting}
                    />
                    {errors.subject && <p className="text-red-500 text-sm mt-1">{errors.subject}</p>}
                  </div>
                  
                  <div>
                    <Textarea 
                      placeholder="Your Message" 
                      rows={6} 
                      value={formData.message} 
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      disabled={isSubmitting}
                    />
                    {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>

              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
