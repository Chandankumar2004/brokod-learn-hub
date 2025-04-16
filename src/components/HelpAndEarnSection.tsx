
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Gift } from "lucide-react";
import { toast } from "sonner";

export const HelpAndEarnSection = () => {
  const referralLink = "https://go.kodnest.com/refer-earn?code=6N43B6";

  const copyReferralLink = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      toast.success("Referral link copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy link. Please try again.");
    }
  };

  const startReferring = () => {
    window.open(referralLink, '_blank');
  };

  return (
    <div className="container px-4 md:px-6 py-12 space-y-8">
      <h1 className="text-4xl md:text-5xl font-bold text-center bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
        KodNest Help and Earn Program
      </h1>

      <Card className="p-6 bg-purple-50 dark:bg-purple-900/10 border-0">
        <div className="flex items-start gap-4">
          <Gift className="w-12 h-12 text-purple-600" />
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">Referral Bonus</h2>
            <p className="text-xl">
              Earn <span className="text-purple-600 font-bold">₹2,000</span> for every successful referral
            </p>
            <p className="text-xl">
              Your friend gets <span className="text-pink-600 font-bold">₹5,000 discount</span> on course fees
            </p>
            <p className="text-gray-600 dark:text-gray-300 italic">
              No limit on referrals - earn unlimited rewards!
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Important Instructions</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Ask your friends to mention your name and KodNest ID when filling out the registration form.
        </p>
        
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
            <p className="font-mono text-sm break-all">{referralLink}</p>
          </div>
          <Button 
            onClick={copyReferralLink}
            className="md:w-24"
          >
            Copy
          </Button>
        </div>
      </Card>

      <div className="flex justify-center">
        <Button
          onClick={startReferring}
          className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-6 text-lg hover:opacity-90 transition-opacity"
        >
          Start Referring Now
        </Button>
      </div>
    </div>
  );
};
