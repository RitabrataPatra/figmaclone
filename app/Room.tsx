"use client";

import { ReactNode, useEffect, useState } from "react";
import {
  LiveblocksProvider,
  RoomProvider,
  ClientSideSuspense,
} from "@liveblocks/react/suspense";

export function Room({ children }: { children: ReactNode }) {
  //just quotes that will randomly change on each loading, no need to change it  
  const quotes = [
    "Creativity is intelligence having fun. – Albert Einstein",
    "You can’t use up creativity. The more you use, the more you have. – Maya Angelou",
    "Creativity takes courage. – Henri Matisse",
    "Think left and think right and think low and think high. Oh, the thinks you can think up if only you try! – Dr. Seuss",
    "The worst enemy to creativity is self-doubt. – Sylvia Plath",
    "Creativity is the power to connect the seemingly unconnected. – William Plomer",
    "Originality is nothing but judicious imitation. – Voltaire",
    "Every child is an artist. The problem is how to remain an artist once we grow up. – Pablo Picasso",
    "Don’t think. Thinking is the enemy of creativity. – Ray Bradbury"
  ];

  const [quote, setQuote] = useState("");

  useEffect(() => {
    // Pick a random quote
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setQuote(randomQuote);
  }, []); // Runs once on component mount
  return (
    <LiveblocksProvider
      publicApiKey={
        "pk_dev_uuTUqW7WrVtGTwc8Vt6pcZ1ZeXoddwbllzSM--YaM0K8B3UGdqrEBIzcj11oUd0u"
      }
    >
      <RoomProvider id="my-room">
        <ClientSideSuspense
          fallback={
            <div className="flex h-screen items-center justify-center">
              <p className="text-3xl  text-white dark:text-gray-600 px-16">{quote}</p>
            </div>
          }
        >
          {children}
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
}
