"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import {
  Sun,
  Moon,
  Laptop,
  Palette,
  Check,
  Monitor,
  Smartphone,
} from "lucide-react";
import { cn } from "@/lib/utils";

const themes = [
  { name: "Default Blue", primary: "hsl(221.2, 83.2%, 53.3%)", value: "default" },
  { name: "Professional Green", primary: "hsl(142.1, 76.2%, 36.3%)", value: "green" },
  { name: "Medical Red", primary: "hsl(346.8, 77.2%, 49.8%)", value: "red" },
  { name: "Calm Purple", primary: "hsl(262.1, 83.3%, 57.8%)", value: "purple" },
  { name: "Ocean Teal", primary: "hsl(173.4, 80.4%, 40%)", value: "teal" },
  { name: "Sunset Orange", primary: "hsl(24.6, 95%, 53.1%)", value: "orange" },
];

const radiusOptions = [
  { name: "Sharp", value: "0", class: "rounded-none" },
  { name: "Default", value: "0.5", class: "rounded-lg" },
  { name: "Rounded", value: "0.75", class: "rounded-xl" },
  { name: "Pill", value: "1.5", class: "rounded-3xl" },
];

const fontOptions = [
  { name: "Inter", value: "inter", class: "font-sans" },
  { name: "Serif", value: "serif", class: "font-serif" },
  { name: "Mono", value: "mono", class: "font-mono" },
];

export function ThemeCustomizer() {
  const { theme, setTheme } = useTheme();
  const [currentTheme, setCurrentTheme] = useState("default");
  const [radius, setRadius] = useState("0.5");
  const [font, setFont] = useState("inter");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="h-5 w-5" />
          Theme Customizer
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Mode Selection */}
        <div>
          <Label className="text-sm font-semibold mb-3 block">Color Mode</Label>
          <div className="grid grid-cols-3 gap-2">
            <Button
              variant={theme === "light" ? "default" : "outline"}
              onClick={() => setTheme("light")}
              className="flex-col gap-2 h-20"
            >
              <Sun className="h-6 w-6" />
              <span className="text-xs">Light</span>
            </Button>
            <Button
              variant={theme === "dark" ? "default" : "outline"}
              onClick={() => setTheme("dark")}
              className="flex-col gap-2 h-20"
            >
              <Moon className="h-6 w-6" />
              <span className="text-xs">Dark</span>
            </Button>
            <Button
              variant={theme === "system" ? "default" : "outline"}
              onClick={() => setTheme("system")}
              className="flex-col gap-2 h-20"
            >
              <Laptop className="h-6 w-6" />
              <span className="text-xs">System</span>
            </Button>
          </div>
        </div>

        <Separator />

        {/* Primary Colors */}
        <div>
          <Label className="text-sm font-semibold mb-3 block">Primary Color</Label>
          <div className="grid grid-cols-3 gap-2">
            {themes.map((t) => (
              <Button
                key={t.value}
                variant="outline"
                onClick={() => setCurrentTheme(t.value)}
                className={cn(
                  "flex items-center gap-2 h-12",
                  currentTheme === t.value && "ring-2 ring-primary ring-offset-2"
                )}
              >
                <div
                  className="h-6 w-6 rounded-full"
                  style={{ backgroundColor: t.primary }}
                />
                <span className="text-xs truncate">{t.name}</span>
                {currentTheme === t.value && (
                  <Check className="h-4 w-4 ml-auto" />
                )}
              </Button>
            ))}
          </div>
        </div>

        <Separator />

        {/* Border Radius */}
        <div>
          <Label className="text-sm font-semibold mb-3 block">Border Radius</Label>
          <RadioGroup
            defaultValue={radius}
            onValueChange={setRadius}
            className="grid grid-cols-4 gap-2"
          >
            {radiusOptions.map((option) => (
              <div key={option.value}>
                <RadioGroupItem
                  value={option.value}
                  id={`radius-${option.value}`}
                  className="peer sr-only"
                />
                <Label
                  htmlFor={`radius-${option.value}`}
                  className="flex flex-col items-center justify-center gap-1 rounded-md border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <div
                    className={cn(
                      "h-8 w-8 bg-primary",
                      option.class
                    )}
                  />
                  <span className="text-xs">{option.name}</span>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <Separator />

        {/* Font Family */}
        <div>
          <Label className="text-sm font-semibold mb-3 block">Font Family</Label>
          <RadioGroup
            defaultValue={font}
            onValueChange={setFont}
            className="grid grid-cols-3 gap-2"
          >
            {fontOptions.map((option) => (
              <div key={option.value}>
                <RadioGroupItem
                  value={option.value}
                  id={`font-${option.value}`}
                  className="peer sr-only"
                />
                <Label
                  htmlFor={`font-${option.value}`}
                  className="flex flex-col items-center justify-center gap-1 rounded-md border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <span className={cn("text-lg font-bold", option.class)}>
                    Aa
                  </span>
                  <span className="text-xs">{option.name}</span>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <Separator />

        {/* Preview */}
        <div>
          <Label className="text-sm font-semibold mb-3 block">Preview</Label>
          <Card className="p-4">
            <div className="space-y-2">
              <Button>Primary Button</Button>
              <Button variant="secondary">Secondary Button</Button>
              <Button variant="outline">Outline Button</Button>
              <div className="flex gap-2">
                <div className="h-8 w-8 rounded bg-primary" />
                <div className="h-8 w-8 rounded bg-secondary" />
                <div className="h-8 w-8 rounded bg-accent" />
                <div className="h-8 w-8 rounded bg-muted" />
                <div className="h-8 w-8 rounded bg-destructive" />
              </div>
            </div>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}