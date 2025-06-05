import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

interface FlashMessagesProps {
  success?: string;
  error?: string;
}

export default function FlashMessages({ success, error }: FlashMessagesProps) {
  const { toast } = useToast();

  useEffect(() => {
    if (success) {
      toast({
        title: "Successo",
        description: success,
      });
    }
  }, [success, toast]);

  useEffect(() => {
    if (error) {
      toast({
        title: "Errore",
        description: error,
        variant: "destructive",
      });
    }
  }, [error, toast]);

  return null;
}
