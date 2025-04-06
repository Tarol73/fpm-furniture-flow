
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

const ContactDialog = () => {
  const [open, setOpen] = useState(false);
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
    
    // Close the dialog and reset form
    setOpen(false);
    setFormData({
      name: '',
      email: '',
      phone: '',
      message: ''
    });
  };

  // Listen for custom events to open the dialog
  useEffect(() => {
    const handleOpenDialog = () => {
      setOpen(true);
    };
    
    document.addEventListener('open-contact-dialog', handleOpenDialog);
    
    // Add click event listener to contact buttons
    const contactButtons = document.querySelectorAll('.contact-btn');
    contactButtons.forEach(button => {
      button.addEventListener('click', handleOpenDialog);
    });
    
    return () => {
      document.removeEventListener('open-contact-dialog', handleOpenDialog);
      contactButtons.forEach(button => {
        button.removeEventListener('click', handleOpenDialog);
      });
    };
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-light text-fpm-blue">Связаться с нами</DialogTitle>
          <DialogDescription className="text-base">
            Заполните форму, и мы свяжемся с вами в ближайшее время
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
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
            <textarea
              id="message"
              name="message"
              placeholder="Ваше сообщение"
              value={formData.message}
              onChange={handleInputChange}
              required
              className="w-full min-h-[120px] p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-fpm-teal"
            />
          </div>
          
          <div className="flex justify-end">
            <Button type="submit" className="bg-fpm-teal hover:bg-fpm-teal/90 text-white">
              Отправить сообщение
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ContactDialog;
