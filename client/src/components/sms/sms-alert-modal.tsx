import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { MessageSquare, AlertTriangle, Package } from "lucide-react";
import { useSendSmsAlert } from "@/hooks/use-sms-alerts";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import type { Incident } from "@shared/schema";

const smsAlertSchema = z.object({
  phoneNumber: z.string().regex(/^\+[1-9]\d{1,14}$/, "Format international requis (+33...)"),
  messageType: z.enum(['thief_spotted', 'object_found']),
  contactInfo: z.string().optional(),
});

type SmsAlertForm = z.infer<typeof smsAlertSchema>;

interface SmsAlertModalProps {
  incident: Incident;
  trigger?: React.ReactNode;
}

export function SmsAlertModal({ incident, trigger }: SmsAlertModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const sendSmsAlert = useSendSmsAlert(incident.id);

  const form = useForm<SmsAlertForm>({
    resolver: zodResolver(smsAlertSchema),
    defaultValues: {
      phoneNumber: '',
      messageType: 'thief_spotted',
      contactInfo: '',
    },
  });

  const messageType = form.watch('messageType');

  async function onSubmit(values: SmsAlertForm) {
    try {
      const result = await sendSmsAlert.mutateAsync({
        phoneNumber: values.phoneNumber,
        messageType: values.messageType,
        message: '', // Will be generated server-side
        contactInfo: values.contactInfo,
      });

      if (result.status === 'sent') {
        toast({
          title: "SMS envoyé avec succès",
          description: `Alert envoyée au ${values.phoneNumber}`,
        });
      } else {
        toast({
          title: "Erreur lors de l'envoi",
          description: result.smsResult?.error || "Une erreur est survenue",
          variant: "destructive",
        });
      }
      
      setIsOpen(false);
      form.reset();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer l'alerte SMS",
        variant: "destructive",
      });
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <MessageSquare className="w-4 h-4 mr-2" />
            Envoyer SMS
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Envoyer une alerte SMS</DialogTitle>
          <DialogDescription>
            Alertez quelqu'un par SMS concernant cet incident : "{incident.title}"
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Numéro de téléphone</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="+33612345678" 
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="messageType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type d'alerte</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Choisir le type d'alerte" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="thief_spotted">
                        <div className="flex items-center">
                          <AlertTriangle className="w-4 h-4 mr-2 text-red-500" />
                          Voleur aperçu
                        </div>
                      </SelectItem>
                      <SelectItem value="object_found">
                        <div className="flex items-center">
                          <Package className="w-4 h-4 mr-2 text-green-500" />
                          Objet retrouvé
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {messageType === 'object_found' && (
              <FormField
                control={form.control}
                name="contactInfo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Informations de contact</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Comment vous contacter (téléphone, email, lieu de rendez-vous...)"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
              >
                Annuler
              </Button>
              <Button 
                type="submit" 
                disabled={sendSmsAlert.isPending}
              >
                {sendSmsAlert.isPending ? "Envoi..." : "Envoyer SMS"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}