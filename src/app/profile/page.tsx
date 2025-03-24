"use client";

import React from 'react';
import { UserProfile } from '@/components/user/user-profile';

export default function ProfilePage() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Your Profile</h1>
      <UserProfile />
    </div>
  );
}
