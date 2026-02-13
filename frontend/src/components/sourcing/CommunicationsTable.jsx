import { Avatar, AvatarFallback } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "../ui/tooltip";
import {
  Table, TableHeader, TableBody, TableHead, TableRow, TableCell,
} from "../ui/table";
import { getInitials, getAvatarColor, communications } from "../../data/mockData";
import { Mail, MessageCircle, Linkedin, RotateCw, Send, Settings } from "lucide-react";

const channelConfig = {
  email: { icon: Mail, label: "Email", cls: "text-sky-600 bg-sky-50" },
  whatsapp: { icon: MessageCircle, label: "WhatsApp", cls: "text-green-600 bg-green-50" },
  linkedin: { icon: Linkedin, label: "LinkedIn InMail", cls: "text-violet-600 bg-violet-50" },
};

const statusConfig = {
  replied: { label: "Replied", cls: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  pending: { label: "Awaiting", cls: "bg-amber-50 text-amber-700 border-amber-200" },
  declined: { label: "Declined", cls: "bg-rose-50 text-rose-600 border-rose-200" },
};

export const CommunicationsTable = ({ onResend, onSendNew, onSetRules }) => {
  return (
    <TooltipProvider delayDuration={200}>
      <div data-testid="communications-section">
        {/* Header with Set Rules CTA */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs text-slate-400">{communications.length} messages sent</p>
          <Button
            variant="outline"
            size="sm"
            data-testid="set-rules-btn"
            onClick={onSetRules}
            className="text-xs h-8 gap-1.5 border-slate-300 text-slate-600 hover:border-indigo-200 hover:text-indigo-600 hover:bg-indigo-50"
          >
            <Settings className="h-3 w-3" />
            Set Rules
          </Button>
        </div>

        {/* Table */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/80 hover:bg-slate-50/80">
                <TableHead className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider pl-4">Candidate</TableHead>
                <TableHead className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider text-center w-16">Channel</TableHead>
                <TableHead className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider w-20">Type</TableHead>
                <TableHead className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Message</TableHead>
                <TableHead className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider text-center w-20">Date</TableHead>
                <TableHead className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Response</TableHead>
                <TableHead className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider text-center w-20">Status</TableHead>
                <TableHead className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider text-right pr-4 w-24">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {communications.map((com) => {
                const ch = channelConfig[com.channel] || channelConfig.email;
                const ChIcon = ch.icon;
                const st = statusConfig[com.status] || statusConfig.pending;
                const initials = getInitials(com.candidateName);
                const colorClass = getAvatarColor(com.candidateName);

                return (
                  <TableRow key={com.id} data-testid={`com-row-${com.id}`} className="group">
                    <TableCell className="pl-4">
                      <div className="flex items-center gap-2.5">
                        <Avatar className="h-7 w-7">
                          <AvatarFallback className={`${colorClass} text-[9px] font-bold`}>{initials}</AvatarFallback>
                        </Avatar>
                        <p className="text-sm font-medium text-slate-900 truncate max-w-[120px]">{com.candidateName}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className={`inline-flex items-center justify-center h-7 w-7 rounded-md ${ch.cls}`}>
                            <ChIcon className="h-3.5 w-3.5" />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>{ch.label}</TooltipContent>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <span className="text-[11px] text-slate-600">{com.messageType}</span>
                    </TableCell>
                    <TableCell>
                      <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2 max-w-[220px]">{com.messageSummary}</p>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="text-[11px] text-slate-500">{com.dateSent}</span>
                    </TableCell>
                    <TableCell>
                      <p className={`text-[11px] leading-relaxed line-clamp-1 max-w-[180px] ${com.response === "No response yet" ? "text-slate-400 italic" : "text-slate-600"}`}>
                        {com.response}
                      </p>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline" className={`text-[10px] font-medium ${st.cls}`}>
                        {st.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right pr-4">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="sm" data-testid={`resend-${com.id}`} onClick={() => onResend(com)} className="h-7 w-7 p-0 text-slate-400 hover:text-amber-600 hover:bg-amber-50">
                              <RotateCw className="h-3 w-3" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Resend</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="sm" data-testid={`send-new-${com.id}`} onClick={() => onSendNew(com)} className="h-7 w-7 p-0 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50">
                              <Send className="h-3 w-3" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Send New Message</TooltipContent>
                        </Tooltip>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </TooltipProvider>
  );
};
