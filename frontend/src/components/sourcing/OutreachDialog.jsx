import { useState } from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { getInitials, getAvatarColor, jobs } from "../../data/mockData";
import { Mail, MessageCircle, Linkedin, ArrowLeft, Check, Send, Loader2 } from "lucide-react";

const channels = [
  { key: "whatsapp", label: "WhatsApp", icon: MessageCircle, color: "bg-green-50 text-green-700 border-green-200 hover:bg-green-100" },
  { key: "email", label: "Email", icon: Mail, color: "bg-sky-50 text-sky-700 border-sky-200 hover:bg-sky-100" },
  { key: "linkedin", label: "LinkedIn InMail", icon: Linkedin, color: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100" },
];

const generateMessage = (channel, candidates, jobId) => {
  const job = jobs.find((j) => j.id === jobId) || jobs[0];
  const companyName = "1Recruit Technologies";
  const candidateNames = candidates.map((c) => c.name.split(" ")[0]).join(", ");
  const applyLink = `https://1recruit.ai/apply/${job.id}`;

  const templates = {
    whatsapp: `Hi ${candidates.length === 1 ? candidateNames : "there"},

We came across your profile and were impressed by your experience. We have an exciting opportunity for the role of *${job.title}* at *${companyName}*.

*Role Details:*
- Position: ${job.title}
- Location: ${job.location}
- Experience: ${job.experience}
- Compensation: ${job.salary}
- Notice Period: Immediate to 30 days preferred

We'd love to connect and discuss this further. If you're interested, please apply here: ${applyLink}

Looking forward to hearing from you!

Best,
Talent Acquisition Team
${companyName}`,

    email: `Subject: Exciting ${job.title} Opportunity at ${companyName} - ${job.location}

Dear ${candidates.length === 1 ? candidateNames : "Candidate"},

I hope this message finds you well. I'm reaching out from ${companyName} regarding an exciting opportunity that aligns perfectly with your background.

We are currently hiring for the position of ${job.title} based in ${job.location}.

Role Highlights:
- Department: ${job.department}
- Experience Required: ${job.experience}
- Compensation: ${job.salary}
- Type: ${job.type}
- Notice Period: Immediate to 30 days preferred

About the Role:
${job.description}

Key Skills: ${job.skills.join(", ")}

If this sounds interesting, I'd love to schedule a quick call to discuss further. You can also apply directly here: ${applyLink}

Best regards,
Talent Acquisition Team
${companyName}
${job.location}`,

    linkedin: `Hi ${candidates.length === 1 ? candidateNames : "there"},

I'm reaching out from ${companyName} - we're hiring a ${job.title} for our ${job.location} office.

Quick overview:
- ${job.experience} experience
- ${job.salary} compensation
- Key Skills: ${job.skills.slice(0, 3).join(", ")}
- Notice Period: Immediate to 30 days preferred

Your profile caught our attention and we think you'd be a great fit. Would you be open to a brief conversation?

Apply here: ${applyLink}

Best,
${companyName} Talent Team`,
  };

  return templates[channel] || templates.email;
};

export const OutreachDialog = ({ open, onOpenChange, candidates, jobId }) => {
  const [step, setStep] = useState("channel"); // channel | compose | sent
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const handleChannelSelect = (channel) => {
    setSelectedChannel(channel);
    setMessage(generateMessage(channel, candidates, jobId));
    setStep("compose");
  };

  const handleSend = () => {
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setStep("sent");
    }, 1500);
  };

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => {
      setStep("channel");
      setSelectedChannel(null);
      setMessage("");
    }, 200);
  };

  const handleBack = () => {
    setStep("channel");
    setSelectedChannel(null);
    setMessage("");
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[85vh] flex flex-col" data-testid="outreach-dialog">
        <DialogHeader>
          <DialogTitle
            className="text-lg font-bold text-slate-900"
            style={{ fontFamily: "Manrope, sans-serif" }}
          >
            {step === "channel" && "Reach Out to Candidates"}
            {step === "compose" && "Compose Message"}
            {step === "sent" && "Message Sent!"}
          </DialogTitle>
          <DialogDescription>
            {step === "channel" && "Choose how you want to reach out to the selected candidates."}
            {step === "compose" && "Review and customize the message before sending."}
            {step === "sent" && `Successfully queued for ${candidates.length} candidate${candidates.length > 1 ? "s" : ""}.`}
          </DialogDescription>
        </DialogHeader>

        {/* Selected candidates preview */}
        {step !== "sent" && (
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <span className="text-xs text-slate-400">To:</span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {candidates.slice(0, 5).map((c) => (
                <div key={c.id} className="flex items-center gap-1.5 bg-slate-50 rounded-full pl-0.5 pr-2.5 py-0.5">
                  <Avatar className="h-5 w-5">
                    <AvatarFallback className={`${getAvatarColor(c.name)} text-[8px] font-bold`}>
                      {getInitials(c.name)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs text-slate-600">{c.name.split(" ")[0]}</span>
                </div>
              ))}
              {candidates.length > 5 && (
                <Badge variant="secondary" className="text-[10px]">
                  +{candidates.length - 5} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Step 1: Channel selection */}
        {step === "channel" && (
          <div data-testid="channel-selection" className="py-2 space-y-3">
            <p className="text-sm font-medium text-slate-700 mb-3">
              How do you want to reach out?
            </p>
            {channels.map((ch) => {
              const Icon = ch.icon;
              return (
                <button
                  key={ch.key}
                  data-testid={`channel-${ch.key}`}
                  onClick={() => handleChannelSelect(ch.key)}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all hover:shadow-sm ${ch.color}`}
                >
                  <div className="h-10 w-10 rounded-lg bg-white/80 flex items-center justify-center flex-shrink-0">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold">{ch.label}</p>
                    <p className="text-xs opacity-70">
                      {ch.key === "whatsapp" && "Send a WhatsApp message to the candidates"}
                      {ch.key === "email" && "Send a professional email outreach"}
                      {ch.key === "linkedin" && "Send a LinkedIn InMail to the candidates"}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Step 2: Message composer */}
        {step === "compose" && (
          <div data-testid="message-composer" className="flex-1 flex flex-col min-h-0 py-2">
            <div className="flex items-center gap-2 mb-3">
              <button
                data-testid="back-to-channels"
                onClick={handleBack}
                className="h-7 w-7 rounded-md hover:bg-slate-100 flex items-center justify-center transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5 text-slate-500" />
              </button>
              <Badge
                variant="outline"
                className={channels.find((c) => c.key === selectedChannel)?.color}
              >
                {channels.find((c) => c.key === selectedChannel)?.label}
              </Badge>
            </div>
            <Textarea
              data-testid="message-textarea"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1 min-h-[280px] text-sm leading-relaxed font-mono resize-none bg-slate-50 border-slate-200"
            />
            <p className="text-[10px] text-slate-400 mt-2">
              You can edit the message above before sending.
            </p>
          </div>
        )}

        {/* Step 3: Sent confirmation */}
        {step === "sent" && (
          <div data-testid="sent-confirmation" className="py-8 flex flex-col items-center text-center">
            <div className="h-14 w-14 rounded-full bg-emerald-50 flex items-center justify-center mb-4">
              <Check className="h-7 w-7 text-emerald-600" />
            </div>
            <p className="text-sm text-slate-600 max-w-xs">
              Your {channels.find((c) => c.key === selectedChannel)?.label} message has been queued and will be sent to {candidates.length} candidate{candidates.length > 1 ? "s" : ""} shortly.
            </p>
          </div>
        )}

        {/* Footer */}
        <DialogFooter className="pt-2 border-t border-slate-100">
          {step === "compose" && (
            <>
              <Button
                variant="outline"
                size="sm"
                data-testid="cancel-message"
                onClick={handleClose}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                data-testid="confirm-send-message"
                onClick={handleSend}
                disabled={sending || !message.trim()}
                className="text-xs bg-indigo-600 hover:bg-indigo-700 gap-1.5"
              >
                {sending ? (
                  <>
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-3 w-3" />
                    Send to {candidates.length} Candidate{candidates.length > 1 ? "s" : ""}
                  </>
                )}
              </Button>
            </>
          )}
          {step === "sent" && (
            <Button
              size="sm"
              data-testid="close-sent-dialog"
              onClick={handleClose}
              className="text-xs bg-indigo-600 hover:bg-indigo-700"
            >
              Done
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
