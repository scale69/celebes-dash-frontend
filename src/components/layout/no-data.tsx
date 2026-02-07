import { FileText } from "lucide-react";

export default function NoData() {
  return (
    <div className="text-center py-12">
      <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
      <h3 className="text-lg font-medium">No found</h3>
    </div>
  );
}
