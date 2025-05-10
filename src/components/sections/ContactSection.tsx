
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Github, Linkedin, Twitter, Send } from 'lucide-react';
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from 'react';


const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

const iconHoverVariants = {
  hover: {
    scale: 1.2,
    color: "hsl(var(--primary))",
    backgroundColor: "hsla(var(--accent-rgb), 0.2)",
    transition: { type: "spring", stiffness: 300 }
  },
  initial: {
    scale: 1,
    color: "hsl(var(--muted-foreground))",
    backgroundColor: "transparent",
  }
};


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

  const variants = isReducedMotionActive ? {} : iconHoverVariants;

  async function onSubmit(data: ContactFormValues) {
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      toast({
        title: "Message Sent!",
        description: "Thanks for reaching out. I'll get back to you soon.",
      });
      form.reset();
    } catch (error) {
      toast({
        title: "Uh oh! Something went wrong.",
        description: "There was a problem sending your message. Please try again.",
        variant: "destructive",
      });
    }
  }

  return (
    <Section id="contact" title="Get In Touch">
      <div className="grid md:grid-cols-2 gap-12">
        <Card className="bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl gradient-text">Send a Message</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your Name" {...field} className="bg-input/50" />
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
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="your.email@example.com" {...field} className="bg-input/50" />
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
                      <FormLabel>Your Message</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Let's talk about..." rows={5} {...field} className="bg-input/50" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full gradient-button" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? "Sending..." : <><Send size={18} className="mr-2"/>Send Message</>}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
        <div className="space-y-8 flex flex-col justify-center">
          <div>
            <h3 className="text-2xl font-semibold text-foreground mb-4">Contact Information</h3>
            <p className="text-muted-foreground mb-2">Feel free to reach out via email or connect with me on social media.</p>
            <p className="text-lg gradient-text font-medium">your.email@example.com</p>
          </div>
          <div>
            <h3 className="text-2xl font-semibold text-foreground mb-4">Connect With Me</h3>
            <div className="flex space-x-4">
              <motion.div initial="initial" whileHover="hover" variants={variants} className="p-2 rounded-full">
                <Link href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer" >
                  <Github size={32} /> <span className="sr-only">GitHub</span>
                </Link>
              </motion.div>
              <motion.div initial="initial" whileHover="hover" variants={variants} className="p-2 rounded-full">
                <Link href="https://linkedin.com/in/yourusername" target="_blank" rel="noopener noreferrer" >
                  <Linkedin size={32} /> <span className="sr-only">LinkedIn</span>
                </Link>
              </motion.div>
              <motion.div initial="initial" whileHover="hover" variants={variants} className="p-2 rounded-full">
                <Link href="https://twitter.com/yourusername" target="_blank" rel="noopener noreferrer" >
                  <Twitter size={32} /> <span className="sr-only">Twitter</span>
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
