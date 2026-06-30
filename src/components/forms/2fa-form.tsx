"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Loader2, Shield, QrCode } from "lucide-react";
import { toast } from "sonner";

const twoFactorSchema = z.object({
  code: z.string().min(6, "Code must be 6 digits").max(6),
});

type TwoFactorFormValues = z.infer<typeof twoFactorSchema>;

interface TwoFactorFormProps {
  onVerify: (code: string) => Promise<void>;
  onEnable: () => Promise<void>;
  onDisable: () => Promise<void>;
  isEnabled: boolean;
}

export function TwoFactorForm({ onVerify, onEnable, onDisable, isEnabled }: TwoFactorFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showSetup, setShowSetup] = useState(false);
  const [qrCode, setQrCode] = useState("");

  const form = useForm<TwoFactorFormValues>({
    resolver: zodResolver(twoFactorSchema),
  });

  const handleEnable = async () => {
    setIsLoading(true);
    try {
      await onEnable();
      setShowSetup(true);
      toast.success("2FA setup initiated");
    } catch (error) {
      toast.error("Failed to enable 2FA");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async (data: TwoFactorFormValues) => {
    setIsLoading(true);
    try {
      await onVerify(data.code);
      toast.success("2FA verified successfully");
      setShowSetup(false);
      form.reset();
    } catch (error) {
      toast.error("Invalid verification code");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisable = async () => {
    setIsLoading(true);
    try {
      await onDisable();
      toast.success("2FA disabled");
      setShowSetup(false);
    } catch (error) {
      toast.error("Failed to disable 2FA");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Two-Factor Authentication
        </CardTitle>
        <CardDescription>Add an extra layer of security to your account</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label>Enable 2FA</Label>
            <p className="text-sm text-muted-foreground">Use authenticator app for verification</p>
          </div>
          <Switch
            checked={isEnabled}
            onCheckedChange={(checked) => {
              if (checked) handleEnable();
              else handleDisable();
            }}
            disabled={isLoading}
          />
        </div>

        {showSetup && (
          <div className="space-y-4 p-4 bg-muted rounded-lg">
            {qrCode && (
              <div className="flex justify-center">
                <QrCode className="h-32 w-32" />
              </div>
            )}
            <p className="text-sm text-center">
              Scan the QR code with your authenticator app, then enter the verification code below.
            </p>
            <form onSubmit={form.handleSubmit(handleVerify)} className="space-y-3">
              <div className="space-y-2">
                <Label>Verification Code</Label>
                <Input
                  {...form.register("code")}
                  placeholder="000000"
                  maxLength={6}
                  className="text-center text-2xl tracking-widest"
                  disabled={isLoading}
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Verify & Enable
              </Button>
            </form>
          </div>
        )}
      </CardContent>
    </Card>
  );
}