import { Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { DISCLAIMER } from "@/lib/site";

/**
 * シミュレーター結果に必ず添える免責事項。
 * 税理士法に配慮し、「目安である」ことを明示する。
 */
export function DisclaimerNote() {
  return (
    <Alert variant="warning" className="mt-4">
      <Info className="h-4 w-4" aria-hidden="true" />
      <AlertDescription>{DISCLAIMER}</AlertDescription>
    </Alert>
  );
}
