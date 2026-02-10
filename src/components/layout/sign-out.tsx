"use client";

import { cn } from "@/lib/utils";
import { LogOut } from "lucide-react";
import { Button } from "../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

interface MenuProps {
  isOpen: boolean | undefined;
}

export default function SignOut({ isOpen }: MenuProps) {
  return (
    <li className="w-full grow flex items-end">
      <TooltipProvider disableHoverableContent>
        <Tooltip delayDuration={100}>
          <TooltipTrigger asChild>
            <Button
              onClick={() => { }}
              variant="outline"
              className="w-full justify-center h-10 mt-5"
            >
              <span className={cn(isOpen === false ? "" : "mr-4")}>
                <LogOut size={18} />
              </span>
              <span>
                <LogOut size={18} />
              </span>
              <p>Sign out</p>
              <p
                className={cn(
                  "whitespace-nowrap",
                  isOpen === false ? "opacity-0 hidden" : "opacity-100"
                )}
              >
                Sign out tes
              </p>
            </Button>
          </TooltipTrigger>
          {isOpen === false && (
            <TooltipContent side="right">Sign out</TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
    </li>
  );
}
