import { Updater } from "@tanstack/react-table";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isFunction(value: unknown): value is Function {
  return typeof value === "function";
}

export function applyUpdater<T>(prev: T, u: Updater<T>): T {
  return isFunction(u) ? u(prev) : u;
}
