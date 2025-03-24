import React from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const preferenceSchema = z.object({
  preference: z.string().min(3, {
    message: "Preference must be at least 3 characters.",
  }),
});

type PreferenceFormProps = {
  onSubmit: (preference: string) => void;
  isLoading?: boolean;
};

export function PreferenceForm({ onSubmit, isLoading = false }: PreferenceFormProps) {
  const form = useForm<z.infer<typeof preferenceSchema>>({
    resolver: zodResolver(preferenceSchema),
    defaultValues: {
      preference: "",
    },
  });

  function handleSubmit(values: z.infer<typeof preferenceSchema>) {
    onSubmit(values.preference);
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">What are you in the mood for?</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="preference"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Food Preference</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., spicy vegetarian dinner, Italian food near me, something with chicken..."
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Tell us what you're craving or any dietary preferences.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Searching..." : "Find Food"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
