import React from "react";
import { Button } from "./Button";

interface Props {}

export function Header({}: Props) {
  return (
    <header className="w-full py-4 px-6 bg-white border-b">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <span className="text-2xl font-bold text-primary">Prism ALM</span>
        </div>
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#features" className="text-gray-700 hover:text-primary font-medium">Features</a>
          <a href="#benefits" className="text-gray-700 hover:text-primary font-medium">Benefits</a>
          <a href="#contact" className="text-gray-700 hover:text-primary font-medium">Contact</a>
        </nav>
        <div>
          <Button variant="default" className="bg-primary text-white font-medium">
            Request Demo
          </Button>
        </div>
      </div>
    </header>
  );
}