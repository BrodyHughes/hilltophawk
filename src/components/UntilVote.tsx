"use client";

import { type ReactNode, useSyncExternalStore } from "react";
import { beforeVote } from "@/lib/whip-count";

const noSubscribe = () => () => {};
const clientSnapshot = () => beforeVote(Date.now());
const serverSnapshot = () => true;

/** Shows `children` until the leadership vote deadline passes, then `after`. */
export function UntilVote({ children, after = null }: { children: ReactNode; after?: ReactNode }) {
  const live = useSyncExternalStore(noSubscribe, clientSnapshot, serverSnapshot);
  return <>{live ? children : after}</>;
}
