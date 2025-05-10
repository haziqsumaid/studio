"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Section } from '@/components/Section';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Wand2, Copy, Check } from 'lucide-react';
import { suggestEmailRewordings, type SuggestEmailRewordingsInput, type SuggestEmailRewordingsOutput } from '@/ai/flows/suggest-email-rewordings';
import { Skeleton } from '@/components/ui/skeleton';

export function AiSuggestionsSection() {
  const { toast } = useToast();
  const [message, setMessage] = useState('');
  const [context, setContext] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedSuggestion, setCopiedSuggestion] = useState<string | null>(null);

  const handleGenerateSuggestions = async () => {
    if (!message.trim()) {
      toast({
        title: "Input Required",
        description: "Please enter a message to get suggestions.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setSuggestions([]);
    try {
      const input: SuggestEmailRewordingsInput = { message, context };
      const result: SuggestEmailRewordingsOutput = await suggestEmailRewordings(input);
      setSuggestions(result.suggestions);
    } catch (error) {
      console.error("Error generating suggestions:", error);
      toast({
        title: "Error",
        description: "Failed to generate suggestions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedSuggestion(text);
      toast({ title: "Copied!", description: "Suggestion copied to clipboard." });
      setTimeout(() => setCopiedSuggestion(null), 2000);
    }).catch(err => {
      console.error('Failed to copy text: ', err);
      toast({ title: "Error", description: "Failed to copy suggestion.", variant: "destructive" });
    });
  };

  return (
    <Section id="ai-suggestions" title="AI-Powered Email Rewording">
      <div className="max-w-3xl mx-auto">
        <Card className="bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl gradient-text flex items-center">
              <Wand2 className="mr-2" />
              Craft Better Emails
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Enter your draft message and optional context. Our AI will provide alternative phrasings to enhance clarity, tone, or conciseness.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label htmlFor="ai-message" className="block text-sm font-medium text-foreground mb-1">Your Message</label>
              <Textarea
                id="ai-message"
                placeholder="Type or paste your email draft here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
                className="bg-input/50"
              />
            </div>
            <div>
              <label htmlFor="ai-context" className="block text-sm font-medium text-foreground mb-1">Optional Context</label>
              <Textarea
                id="ai-context"
                placeholder="e.g., Replying to a client complaint, Asking for a raise, Following up on a job application"
                value={context}
                onChange={(e) => setContext(e.target.value)}
                rows={3}
                className="bg-input/50"
              />
            </div>
            <Button onClick={handleGenerateSuggestions} disabled={isLoading} className="w-full gradient-button">
              {isLoading ? (
                "Generating..."
              ) : (
                <>
                  <Wand2 className="mr-2 h-4 w-4" /> Get Suggestions
                </>
              )}
            </Button>
          </CardContent>
          {isLoading && (
            <CardFooter className="flex flex-col space-y-4">
              {[...Array(3)].map((_, i) => (
                 <div key={i} className="w-full p-4 border border-border rounded-lg space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                 </div>
              ))}
            </CardFooter>
          )}
          {!isLoading && suggestions.length > 0 && (
            <CardFooter className="flex flex-col space-y-4 items-start">
              <h3 className="text-xl font-semibold text-foreground">Suggested Rewordings:</h3>
              {suggestions.map((suggestion, index) => (
                <Card key={index} className="w-full bg-background/50 p-4 relative group">
                  <p className="text-muted-foreground whitespace-pre-wrap">{suggestion}</p>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground"
                    onClick={() => handleCopy(suggestion)}
                    aria-label="Copy suggestion"
                  >
                    {copiedSuggestion === suggestion ? <Check size={16} className="text-primary"/> : <Copy size={16} />}
                  </Button>
                </Card>
              ))}
            </CardFooter>
          )}
        </Card>
      </div>
    </Section>
  );
}
