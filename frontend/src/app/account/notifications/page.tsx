// src/app/account/notifications/page.tsx
"use client";

import { Suspense } from 'react';
import { NotificationList } from "@/widgets/notification-list/NotificationList";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NotificationList />
    </Suspense>
  );
}
