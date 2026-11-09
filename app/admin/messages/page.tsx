import { MessageSquare } from "lucide-react";
import EmptyState from "@/app/components/admin/ui/EmptyState";

const Page = () => {
  return (
    <EmptyState
      Icon={MessageSquare}
      title="Coming soon"
      text="Messages from the website's contact form will appear here once the shop is connected to the database."
    />
  );
};

export default Page;