
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { toast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";

interface SettingsFormData {
  webhookUrl: string;
}

const Settings = () => {
  const [isSaving, setIsSaving] = useState(false);
  
  const form = useForm<SettingsFormData>({
    defaultValues: {
      webhookUrl: '',
    },
  });

  // Load saved webhook URL from localStorage on component mount
  useEffect(() => {
    const savedWebhookUrl = localStorage.getItem('webhookUrl');
    if (savedWebhookUrl) {
      form.setValue('webhookUrl', savedWebhookUrl);
    }
  }, [form]);

  const onSubmit = (data: SettingsFormData) => {
    setIsSaving(true);
    
    try {
      localStorage.setItem('webhookUrl', data.webhookUrl);
      
      toast({
        title: "Settings saved",
        description: "Your integration settings have been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Error saving settings",
        description: "There was a problem saving your settings.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container max-w-3xl px-4 py-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Settings</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Integration Settings</CardTitle>
            <CardDescription>
              Configure your connection to n8n or Make.com for social media integration
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="webhookUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Webhook URL</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://make.com/webhook/..." 
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Enter the webhook URL from your n8n or Make.com workflow
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save Settings"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Settings;
