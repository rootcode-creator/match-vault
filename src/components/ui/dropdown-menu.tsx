"use client";

import React from "react";
import {
  Dropdown as HeroDropdown,
  DropdownTrigger as HeroDropdownTrigger,
  DropdownMenu as HeroDropdownMenu,
  DropdownItem as HeroDropdownItem,
  DropdownSection as HeroDropdownSection,
} from "@heroui/react";

// Lightweight shadcn-style wrappers around HeroUI Dropdown so we can
// switch drop-down implementations without changing callers.

export const DropdownMenu: React.FC<React.PropsWithChildren<any>> = ({ children, ...props }) => {
  return <HeroDropdown {...props}>{children}</HeroDropdown>;
};

export const DropdownMenuTrigger: React.FC<React.PropsWithChildren<any>> = ({ children, ...props }) => {
  // Handle `asChild` by cloning the child element with props so we don't forward
  // unknown props to DOM elements (React warns otherwise).
  const { asChild, ...rest } = props as any;
  const child = React.Children.only(children) as React.ReactElement;
  if (asChild && React.isValidElement(child)) {
    return React.cloneElement(child, { ...(child.props || {}), ...(rest || {}) });
  }

  return <HeroDropdownTrigger {...rest}>{children}</HeroDropdownTrigger>;
};

export const DropdownMenuContent: React.FC<React.PropsWithChildren<any>> = ({ children, className }) => {
  // Only forward className and children to the HeroUI DropdownMenu
  // to avoid passing unsupported props that can break internal behavior.
  return <HeroDropdownMenu className={className}>{children}</HeroDropdownMenu>;
};

export const DropdownMenuItem: React.FC<React.PropsWithChildren<any>> = ({ children, ...props }) => {
  const { asChild, ...rest } = props as any;
  const child = React.Children.only(children) as React.ReactElement;
  if (asChild && React.isValidElement(child)) {
    return React.cloneElement(child, { ...(child.props || {}), ...(rest || {}) });
  }

  return <HeroDropdownItem {...rest}>{children}</HeroDropdownItem>;
};

export const DropdownMenuGroup = ({ children }: React.PropsWithChildren<any>) => {
  return <div className="dropdown-group">{children}</div>;
};

export const DropdownMenuLabel = ({ children }: React.PropsWithChildren<any>) => {
  return <div className="dropdown-label text-sm font-medium text-default-700 px-3 py-1">{children}</div>;
};

export const DropdownMenuSeparator = () => <hr className="my-1 border-t border-default-200" />;

export const DropdownMenuPortal = ({ children }: React.PropsWithChildren<any>) => <>{children}</>;

export const DropdownMenuSub = ({ children }: React.PropsWithChildren<any>) => <div>{children}</div>;
export const DropdownMenuSubTrigger = ({ children }: React.PropsWithChildren<any>) => <div>{children}</div>;
export const DropdownMenuSubContent = ({ children }: React.PropsWithChildren<any>) => <div>{children}</div>;
export const DropdownMenuShortcut = ({ children }: React.PropsWithChildren<any>) => (
  <span className="ml-auto text-xs text-default-500">{children}</span>
);

export default DropdownMenu;
