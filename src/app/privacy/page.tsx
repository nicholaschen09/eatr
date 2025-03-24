import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>

      <Card>
        <CardHeader>
          <CardTitle>Food Finder Privacy Policy</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-gray dark:prose-invert max-w-none">
          <h2>1. Introduction</h2>
          <p>
            Food Finder ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our service.
          </p>

          <h2>2. Information We Collect</h2>
          <p>We collect information that you provide directly to us, including:</p>
          <ul>
            <li>Personal information (name, email address, phone number)</li>
            <li>Delivery address and location data</li>
            <li>Payment information</li>
            <li>Food preferences and dietary restrictions</li>
            <li>Order history</li>
          </ul>

          <h2>3. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Process and fulfill your orders</li>
            <li>Provide personalized food recommendations</li>
            <li>Improve our AI recommendation system</li>
            <li>Communicate with you about your orders and our services</li>
            <li>Analyze usage patterns to improve our service</li>
          </ul>

          <h2>4. Information Sharing</h2>
          <p>
            We may share your information with restaurants to fulfill your orders. We may also share anonymized data with our AI service providers to improve our recommendation systems.
          </p>

          <h2>5. Your Choices</h2>
          <p>
            You can access, update, or delete your account information at any time through the Profile section. You can also choose not to share certain information, although this may limit your ability to use some features of our service.
          </p>

          <h2>6. Security</h2>
          <p>
            We implement appropriate security measures to protect your personal information from unauthorized access, alteration, or disclosure.
          </p>

          <h2>7. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the effective date.
          </p>

          <h2>8. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at privacy@foodfinder.example.com.
          </p>

          <p className="text-sm text-muted-foreground mt-8">
            Last updated: March 24, 2025
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
