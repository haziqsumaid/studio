
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Section } from '@/components/Section';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Github, Linkedin, Twitter, Send, Mail, Phone, MapPin } from 'lucide-react';
import Link from "next/link";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from 'react';
import { cn } from "@/lib/utils";


const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }).max(100),
  email: z.string().email({ message: "Please enter a valid email address." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }).max(1000),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

const iconHoverVariants = {
  rest: { scale: 1, color: "hsl(var(--muted-foreground))", backgroundColor: "transparent" },
  hover: {
    scale: 1.2,
    color: "hsl(var(--primary))",
    backgroundColor: "hsla(var(--primary-rgb), 0.1)", // Use primary with low opacity
    transition: { type: "spring", stiffness: 300, damping: 15 }
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

const inputFocusVariants = {
  rest: { scale: 1, borderColor: "hsl(var(--input))" },
  focus: { scale: 1.02, borderColor: "hsl(var(--ring))", boxShadow: "0 0 0 2px hsl(var(--ring) / 0.2)" },
};

const contactInfoItems = [
  { icon: <Mail size={20} className="text-primary" />, text: "haziqsumaid4@gmail.com", href: "mailto:haziqsumaid4@gmail.com", label: "Email" },
  { icon: <Phone size={20} className="text-primary" />, text: "+92 315 1518001", href: "tel:+923151518001", label: "Phone" },
  { icon: <MapPin size={20} className="text-primary" />, text: "Rawalpindi, Pakistan", label: "Location" },
];

export function ContactSection() {
  const { toast } = useToast();
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  const framerReducedMotion = useReducedMotion();
  const [isReducedMotionActive, setIsReducedMotionActive] = useState(false);

  useEffect(() => {
    setIsReducedMotionActive(framerReducedMotion ?? false);
  }, [framerReducedMotion]);

  const socialIconResolvedVariants = isReducedMotionActive ? {} : iconHoverVariants;

  async function onSubmit(data: ContactFormValues) {
    form.control.disabled = true; // Visually disable form during submission
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Network response was not ok');
      }

      toast({
        title: "Message Sent!",
        description: "Thanks for reaching out. I'll get back to you soon.",
      });
      form.reset();
    } catch (error) {
      toast({
        title: "Uh oh! Something went wrong.",
        description: error instanceof Error ? error.message : "There was a problem sending your message. Please try again.",
        variant: "destructive",
      });
    } finally {
       form.control.disabled = false; // Re-enable form
    }
  }

  return (
    <Section id="contact" title="Let's Connect">
      <div className="grid lg:grid-cols-5 gap-12 lg:gap-16 items-start">
        
        <motion.div
          className="lg:col-span-3"
          variants={cardVariants}
          initial={isReducedMotionActive ? "visible" : "hidden"}
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <Card className="bg-card/60 backdrop-blur-md shadow-xl border-border/20 transform transition-all duration-300 hover:shadow-2xl">
            <CardHeader>
              <CardTitle className="text-2xl md:text-3xl gradient-text flex items-center">
                <Send size={26} className="mr-3 transform -rotate-12"/> Send a Message
              </CardTitle>
              <CardDescription className="text-muted-foreground pt-1">
                Have a project in mind or just want to say hi? Fill out the form below.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground/90">Full Name</FormLabel>
                        <FormControl>
                          <motion.div variants={inputFocusVariants} initial="rest" whileFocus="focus" transition={{ duration: 0.2}}>
                            <Input placeholder="Your Name" {...field} className="bg-input/70 backdrop-blur-sm border-border/50 focus:bg-input" disabled={form.formState.isSubmitting} />
                          </motion.div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground/90">Email Address</FormLabel>
                        <FormControl>
                           <motion.div variants={inputFocusVariants} initial="rest" whileFocus="focus" transition={{ duration: 0.2}}>
                            <Input type="email" placeholder="your.email@example.com" {...field} className="bg-input/70 backdrop-blur-sm border-border/50 focus:bg-input" disabled={form.formState.isSubmitting}/>
                           </motion.div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground/90">Your Message</FormLabel>
                        <FormControl>
                          <motion.div variants={inputFocusVariants} initial="rest" whileFocus="focus" transition={{ duration: 0.2}}>
                            <Textarea placeholder="Let's discuss your project or ideas..." rows={5} {...field} className="bg-input/70 backdrop-blur-sm border-border/50 focus:bg-input" disabled={form.formState.isSubmitting}/>
                          </motion.div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button 
                    type="submit" 
                    className="w-full gradient-button text-lg py-3 shadow-lg hover:shadow-xl focus:ring-2 focus:ring-ring focus:ring-offset-2" 
                    disabled={form.formState.isSubmitting}
                    // @ts-ignore Framer motion props not fully compatible with asChild button
                    whileTap={!isReducedMotionActive ? { scale: 0.97 } : {}}
                    transition={!isReducedMotionActive ? { type: "spring", stiffness: 400, damping: 17 } : {}}
                    as={motion.button}
                  >
                    <AnimatePresence mode="wait">
                      {form.formState.isSubmitting ? (
                        <motion.span key="sending" initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }}>
                          Sending...
                        </motion.span>
                      ) : (
                        <motion.span key="send" initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }} className="flex items-center">
                          <Send size={18} className="mr-2.5"/>Send Message
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div 
          className="lg:col-span-2 space-y-8 lg:space-y-10 lg:pt-8"
          variants={cardVariants}
          initial={isReducedMotionActive ? "visible" : "hidden"}
          whileInView="visible"
          viewport={{ once: true, amount: 0.2, delay: isReducedMotionActive ? 0 : 0.2 }}
        >
          <div className="bg-card/40 backdrop-blur-sm p-6 rounded-xl shadow-lg border-border/20">
            <h3 className="text-xl md:text-2xl font-semibold text-foreground mb-4 flex items-center">
              <Mail size={24} className="mr-3 text-primary"/>Direct Contact
            </h3>
            <ul className="space-y-3">
              {contactInfoItems.map((item, index) => (
                <motion.li 
                  key={index} 
                  className="flex items-center text-muted-foreground hover:text-foreground transition-colors group"
                  initial={!isReducedMotionActive ? { opacity: 0, x: -20 } : {}}
                  whileInView={!isReducedMotionActive ? { opacity: 1, x: 0, transition: { delay: index * 0.1 + 0.3, duration: 0.4 } } : {}}
                  viewport={{ once: true }}
                >
                  {item.icon}
                  {item.href ? (
                    <Link href={item.href} className="ml-3 group-hover:text-primary transition-colors" target={item.href.startsWith('http') ? '_blank' : undefined} rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}>
                      {item.text}
                    </Link>
                  ) : (
                    <span className="ml-3">{item.text}</span>
                  )}
                </motion.li>
              ))}
            </ul>
          </div>
          
          <div className="bg-card/40 backdrop-blur-sm p-6 rounded-xl shadow-lg border-border/20">
            <h3 className="text-xl md:text-2xl font-semibold text-foreground mb-5 flex items-center">
              <Users size={24} className="mr-3 text-primary"/>Find Me Online
            </h3>
            <div className="flex space-x-4">
              {[
                { href: "https://github.com/haziqsumaid", icon: Github, label: "GitHub" },
                { href: "https://linkedin.com/in/haziqsumaid", icon: Linkedin, label: "LinkedIn" },
                { href: "https://twitter.com/haziqsumaid", icon: Twitter, label: "Twitter" },
              ].map((social, index) => (
                <motion.div 
                  key={social.label}
                  initial={!isReducedMotionActive ? { opacity: 0, y: 20 } : {}}
                  whileInView={!isReducedMotionActive ? { opacity: 1, y: 0, transition: { delay: index * 0.1 + 0.5, duration: 0.4 } } : {}}
                  viewport={{ once: true }}
                  className="p-2 rounded-full"
                  variants={socialIconResolvedVariants}
                  initial="rest"
                  whileHover="hover"
                  whileTap="hover"
                >
                  <Link href={social.href} target="_blank" rel="noopener noreferrer" aria-label={social.label}>
                    <social.icon size={30} /> 
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </Section>
  );
}
