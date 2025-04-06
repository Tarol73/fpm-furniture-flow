
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

const ContactForm = () => {
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Here we would normally handle the API call to send the email
    console.log('Form data submitted:', formData);
    
    // Show success message
    toast({
      title: "Сообщение отправлено",
      description: "Спасибо! Мы свяжемся с вами в ближайшее время.",
      variant: "default",
    });
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      message: ''
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium">
          Имя
        </label>
        <Input
          id="name"
          name="name"
          placeholder="Ваше имя"
          value={formData.name}
          onChange={handleInputChange}
          required
          className="w-full"
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium">
          Email
        </label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="Ваш email"
          value={formData.email}
          onChange={handleInputChange}
          required
          className="w-full"
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="phone" className="text-sm font-medium">
          Телефон
        </label>
        <Input
          id="phone"
          name="phone"
          placeholder="Ваш телефон"
          value={formData.phone}
          onChange={handleInputChange}
          className="w-full"
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="message" className="text-sm font-medium">
          Сообщение
        </label>
        <Textarea
          id="message"
          name="message"
          placeholder="Ваше сообщение"
          value={formData.message}
          onChange={handleInputChange}
          required
          className="w-full min-h-[120px]"
        />
      </div>
      
      <div className="flex justify-end">
        <Button type="submit" className="bg-fpm-teal hover:bg-fpm-teal/90 text-white">
          Отправить сообщение
        </Button>
      </div>
    </form>
  );
};

export default ContactForm;
