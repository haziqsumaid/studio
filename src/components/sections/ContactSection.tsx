"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
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
import { siteConfig } from "@/config/content";
import { cn } from "@/lib/utils";

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
    backgroundColor: "hsla(var(--accent-rgb), 0.1)", // Use accent-rgb for hsla
    transition: { type: "spring", stiffness: 300 }
  },
  initial: {
    scale: 1,
    color: "hsl(var(--muted-fg))",
    backgroundColor: "transparent",
  }
};

const FloatingLabelInput = ({ field, label, placeholder, type = "text", error }: any) => (
  <div className="relative">
    <Input
      {...field}
      type={type}
      placeholder=" " // Important: must be a space for :placeholder-shown to work
      className={cn(
        "peer pt-6 bg-bg border transition-colors", // bg-bg for themed background
        error ? "border-destructive focus-visible:ring-destructive" : "border-input focus-visible:ring-ring"
      )}
    />
    <FormLabel
      className={cn(
        "absolute left-3 top-1/2 -translate-y-1/2 text-muted-fg transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-focus:top-3 peer-focus:-translate-y-0 peer-focus:text-xs peer-focus:text-primary",
        field.value && "top-3 -translate-y-0 text-xs text-primary" // Handle filled state
      )}
    >
      {label}
    </FormLabel>
  </div>
);

const FloatingLabelTextarea = ({ field, label, placeholder, error }: any) => (
  <div className="relative">
    <Textarea
      {...field}
      placeholder=" "
      rows={5}
      className={cn(
        "peer pt-6 bg-bg border transition-colors min-h-[120px]", // bg-bg
        error ? "border-destructive focus-visible:ring-destructive" : "border-input focus-visible:ring-ring"
      )}
    />
    <FormLabel
      className={cn(
        "absolute left-3 top-5 -translate-y-1/2 text-muted-fg transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-focus:top-3 peer-focus:-translate-y-0 peer-focus:text-xs peer-focus:text-primary",
         field.value && "top-3 -translate-y-0 text-xs text-primary"
      )}
    >
      {label}
    </FormLabel>
  </div>
);


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
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Network response was not ok');
      }

      toast({
        title: siteConfig.contact.successToastTitle,
        description: siteConfig.contact.successToastDescription,
        variant: 'default', // Explicitly success, can add custom variant later
        duration: 5000,
      });
      form.reset();
    } catch (error: any) {
      toast({
        title: siteConfig.contact.errorToastTitle,
        description: error.message || siteConfig.contact.errorToastDescription,
        variant: "destructive",
        duration: 7000,
      });
    }
  }
  
  const buttonTapAnimation = isReducedMotionActive ? {} : { scale: 0.95 };

  return (
    <Section id="contact" title={siteConfig.contact.heading}>
      <div className="grid md:grid-cols-2 gap-12">
        <Card className="bg-card/50 backdrop-blur-sm shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl gradient-text">{siteConfig.contact.formTitle}</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8"> {/* Increased space-y */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FloatingLabelInput field={field} label={siteConfig.contact.nameLabel} placeholder={siteConfig.contact.namePlaceholder} error={fieldState.error} />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field, fieldState }) => (
                    <FormItem>
                       <FloatingLabelInput field={field} type="email" label={siteConfig.contact.emailLabel} placeholder={siteConfig.contact.emailPlaceholder} error={fieldState.error} />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FloatingLabelTextarea field={field} label={siteConfig.contact.messageLabel} placeholder={siteConfig.contact.messagePlaceholder} error={fieldState.error}/>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <motion.div whileTap={buttonTapAnimation}>
                  <Button type="submit" className="w-full gradient-button text-lg py-3" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? siteConfig.contact.submittingText : (
                      <>
                        <Send size={18} className="mr-2"/>{siteConfig.contact.submitButtonText}
                      </>
                    )}
                  </Button>
                </motion.div>
              </form>
            </Form>
          </CardContent>
        </Card>
        <div className="space-y-8 flex flex-col justify-center">
          <div>
            <h3 className="text-subheadline-md text-fg mb-4">{siteConfig.contact.connectTitle}</h3>
            <p className="text-muted-fg mb-2">{siteConfig.contact.connectDescription}</p>
            <a href={`mailto:${siteConfig.email}`} className="text-lg gradient-text font-medium hover:underline">{siteConfig.email}</a>
          </div>
          <div>
            <h3 className="text-subheadline-md text-fg mb-4">Socials</h3>
            <div className="flex space-x-4">
              <motion.div initial="initial" whileHover="hover" variants={variants} className="p-2 rounded-full">
                <Link href={siteConfig.socialLinks.github} target="_blank" rel="noopener noreferrer" >
                  <Github size={32} /> <span className="sr-only">GitHub</span>
                </Link>
              </motion.div>
              <motion.div initial="initial" whileHover="hover" variants={variants} className="p-2 rounded-full">
                <Link href={siteConfig.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" >
                  <Linkedin size={32} /> <span className="sr-only">LinkedIn</span>
                </Link>
              </motion.div>
              <motion.div initial="initial" whileHover="hover" variants={variants} className="p-2 rounded-full">
                <Link href={siteConfig.socialLinks.twitter} target="_blank" rel="noopener noreferrer" >
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

    