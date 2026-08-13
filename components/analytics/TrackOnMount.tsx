"use client";

import { useEffect } from "react";
import { track, type AnalyticsEvent, type EventProps } from "@/lib/analytics";

/** Fires a single analytics event once when mounted. Server pages can drop this in. */
export function TrackOnMount({ event, props }: { event: AnalyticsEvent; props?: EventProps }) {
  useEffect(() => {
    track(event, props);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}
