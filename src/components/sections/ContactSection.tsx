
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
import { Github, Linkedin, Twitter, Send, Mail, Phone, MapPin, Users, Lightbulb, RefreshCcw } from 'lucide-react';
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
    backgroundColor: "hsla(var(--primary-rgb), 0.1)", 
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

const aiSuggestionPrompts = [
    "Suggest a friendly opening for a project inquiry.",
    "Rephrase this for a more professional tone: 'Your project sounds cool, let's chat.'",
    "Shorten this message while keeping the core idea: 'I'm very interested in collaborating on your upcoming backend initiative and believe my skills in Node.js and microservices would be a great asset. I'd love to learn more about the specific challenges and how I can contribute to its success.'",
    "Make this sound more enthusiastic: 'I saw your portfolio, it's good.'",
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
  const [isAiPanelOpen, setIsAiPanelOpen] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [isGeneratingSuggestions, setIsGeneratingSuggestions] = useState(false);
  const [currentMessage, setCurrentMessage] = useState("");

  useEffect(() => {
    setIsReducedMotionActive(framerReducedMotion ?? false);
  }, [framerReducedMotion]);

  const socialIconResolvedVariants = isReducedMotionActive ? {} : iconHoverVariants;
  
  const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "your.email@example.com";
  const contactPhone = process.env.NEXT_PUBLIC_CONTACT_PHONE || "+1234567890";
  const contactLocation = process.env.NEXT_PUBLIC_CONTACT_LOCATION || "City, Country";

  const socialGithub = process.env.NEXT_PUBLIC_SOCIAL_GITHUB || "https://github.com/yourusername";
  const socialLinkedin = process.env.NEXT_PUBLIC_SOCIAL_LINKEDIN || "https://linkedin.com/in/yourusername";
  const socialTwitter = process.env.NEXT_PUBLIC_SOCIAL_TWITTER || "https://twitter.com/yourusername";


  const contactInfoItems = [
    { icon: <Mail size={20} className="text-primary" />, text: contactEmail, href: `mailto:${contactEmail}`, label: "Email" },
    { icon: <Phone size={20} className="text-primary" />, text: contactPhone, href: `tel:${contactPhone.replace(/\s/g, '')}`, label: "Phone" },
    { icon: <MapPin size={20} className="text-primary" />, text: contactLocation, label: "Location" },
  ];


  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newMessage = e.target.value;
    form.setValue("message", newMessage);
    setCurrentMessage(newMessage);
  };

  const toggleAiPanel = () => {
    const newPanelState = !isAiPanelOpen;
    setIsAiPanelOpen(newPanelState);
  };
  
  const applySuggestion = (suggestion: string) => {
    const actualSuggestionText = suggestion.startsWith("Click to generate:") 
      ? suggestion.substring("Click to generate: ".length).replace(/"/g, "") 
      : suggestion.substring(suggestion.indexOf('"') + 1, suggestion.lastIndexOf('"'));

    form.setValue("message", actualSuggestionText);
    setCurrentMessage(actualSuggestionText);
    setIsAiPanelOpen(false); 
  };


  async function onSubmit(data: ContactFormValues) {
    form.control.disabled = true;
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        let errorMessage = result.error || `Server error: ${response.status} ${response.statusText}`;
        if (result.issues && Array.isArray(result.issues)) { 
          errorMessage += `: ${result.issues.map((issue: any) => issue.message).join(', ')}`;
        }
        throw new Error(errorMessage);
      }
      
      toast({
        title: "Message Sent!",
        description: result.message || "Thanks for reaching out. I'll get back to you soon.",
        variant: "default",
        className: "bg-green-500/20 border-green-500 text-foreground"
      });
      form.reset();
      setCurrentMessage("");
      setIsAiPanelOpen(false);

    } catch (error) {
      let displayMessage = "An unexpected error occurred. Please try again.";
      if (error instanceof Error) {
        const lowerCaseErrorMessage = error.message.toLowerCase();
        if (lowerCaseErrorMessage.includes("failed to fetch")) {
          displayMessage = "Cannot connect to the server. Please check your internet connection and try again.";
        } else if (lowerCaseErrorMessage.includes("unexpected end of json input") || 
                   lowerCaseErrorMessage.includes("unexpected token") ||
                   lowerCaseErrorMessage.includes("invalid json")) {
          displayMessage = "Received an invalid response from the server. Please try again later.";
          console.error("Detailed error for invalid server response:", error); 
        } else {
          displayMessage = error.message; 
        }
      }
      
      toast({
        title: "Uh oh! Something went wrong.",
        description: displayMessage,
        variant: "destructive",
      });
    } finally {
      form.control.disabled = false;
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
          <Card className="bg-card/60 backdrop-blur-md shadow-xl border-border/20 transform transition-all duration-300 hover:shadow-2xl relative overflow-hidden">
             <motion.div 
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: 'radial-gradient(circle at 20% 20%, hsl(var(--primary)/0.5) 0%, transparent 30%), radial-gradient(circle at 80% 70%, hsl(var(--accent)/0.4) 0%, transparent 30%)',
                filter: 'blur(60px)',
                zIndex:0
              }}
              animate={{
                x: ["-5%", "5%", "-5%"],
                y: ["2%", "-2%", "2%"],
                scale: [1, 1.05, 1],
                opacity: [0.15, 0.3, 0.15]
              }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            />
            <div className="relative z-10"> {/* Content wrapper */}
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
                          <div className="flex justify-between items-center">
                            <FormLabel className="text-foreground/90">Your Message</FormLabel>
                            <Button type="button" variant="ghost" size="sm" onClick={toggleAiPanel} className="text-xs text-primary hover:text-primary/80 px-2 py-1" aria-expanded={isAiPanelOpen}>
                              <Lightbulb size={14} className="mr-1.5" /> AI Suggestions
                            </Button>
                          </div>
                          <FormControl>
                            <motion.div variants={inputFocusVariants} initial="rest" whileFocus="focus" transition={{ duration: 0.2}}>
                              <Textarea 
                                placeholder="Let's discuss your project or ideas..." 
                                rows={5} 
                                {...field} 
                                onChange={handleMessageChange}
                                className="bg-input/70 backdrop-blur-sm border-border/50 focus:bg-input" 
                                disabled={form.formState.isSubmitting}
                              />
                            </motion.div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <AnimatePresence>
                    {isAiPanelOpen && (
                        <motion.div 
                            initial={{ opacity: 0, height: 0, y: -10 }}
                            animate={{ opacity: 1, height: 'auto', y: 0 }}
                            exit={{ opacity: 0, height: 0, y: -10 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="bg-muted/30 p-3 rounded-md border border-border/30"
                        >
                            <div className="flex justify-between items-center mb-2">
                                <h4 className="text-sm font-semibold text-foreground">AI Rewording Suggestions</h4>
                                <Button type="button" variant="ghost" size="icon" onClick={() => { /* getAiSuggestions(currentMessage) */ }} className="h-6 w-6" disabled={isGeneratingSuggestions}>
                                    <RefreshCcw size={14} className={cn(isGeneratingSuggestions && "animate-spin")}/>
                                </Button>
                            </div>
                            {isGeneratingSuggestions ? (
                                <p className="text-xs text-muted-foreground text-center py-2">Generating ideas...</p>
                            ) : (
                                <ul className="space-y-1.5 text-xs">
                                    {aiSuggestions.length > 0 ? aiSuggestions.map((s, i) => (
                                        <li key={i}>
                                            <button type="button" onClick={() => applySuggestion(s)} className="w-full text-left p-1.5 rounded hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors">
                                                {s}
                                            </button>
                                        </li>
                                    )) : <p className="text-xs text-muted-foreground text-center py-1">Type a message or click refresh for suggestions.</p>}
                                </ul>
                            )}
                        </motion.div>
                    )}
                    </AnimatePresence>


                    <Button 
                      type="submit" 
                      className="w-full gradient-button text-lg py-3 shadow-lg hover:shadow-xl focus:ring-2 focus:ring-ring focus:ring-offset-2" 
                      disabled={form.formState.isSubmitting}
                      
                      whileTap={!isReducedMotionActive ? { scale: 0.97 } : {}}
                      transition={!isReducedMotionActive ? { type: "spring", stiffness: 400, damping: 17 } : {}}
                      // @ts-ignore
                      as={motion.button}
                    >
                      <AnimatePresence mode="wait">
                        {form.formState.isSubmitting ? (
                          <motion.span key="sending" initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }} className="flex items-center">
                            <motion.div className="mr-2.5" animate={{rotate:360}} transition={{duration:1, repeat:Infinity, ease:"linear"}}><Send size={18}/></motion.div>
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
            </div>
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
                { href: socialGithub, icon: Github, label: "GitHub" },
                { href: socialLinkedin, icon: Linkedin, label: "LinkedIn" },
                { href: socialTwitter, icon: Twitter, label: "Twitter" },
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

