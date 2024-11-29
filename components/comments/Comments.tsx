"use client";

import { ClientSideSuspense} from "@liveblocks/react/suspense";

import { CommentsOverlay } from "@/components/comments/CommentsOverlay";

export const Comments = () => (
  <ClientSideSuspense fallback={null}>
    {() => <CommentsOverlay />}
  </ClientSideSuspense>
);
