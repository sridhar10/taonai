import { useState } from "react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "../ui/tooltip";
import { getInitials, getAvatarColor, communications } from "../../data/mockData";
import { Mail, MessageCircle, Linkedin, RotateCw, Send, Settings, ChevronDown, ChevronUp } from "lucide-react";

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
  const [expandedId, setExpandedId] = useState(null);

  return (
    <TooltipProvider delayDuration={200}>
      <div data-testid="communications-section">
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs text-slate-400">{communications.length} messages sent</p>
          <Button variant="outline" size="sm" data-testid="set-rules-btn" onClick={onSetRules}
            className="text-xs h-8 gap-1.5 border-slate-300 text-slate-600 hover:border-indigo-200 hover:text-indigo-600 hover:bg-indigo-50">
            <Settings className="h-3 w-3" /> Set Rules
          </Button>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <table className="w-full" style={{ tableLayout: "fixed" }}>
            <colgroup>
              <col style={{ width: "17%" }} />
              <col style={{ width: "50px" }} />
              <col style={{ width: "10%" }} />
              <col style={{ width: "10%" }} />
              <col style={{ width: "auto" }} />
              <col style={{ width: "9%" }} />
              <col style={{ width: "36px" }} />
            </colgroup>
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100">
                <th className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider py-3 text-left pl-4">Candidate</th>
                <th className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider py-3 text-center">Channel</th>
                <th className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider py-3 text-left">Type</th>
                <th className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider py-3 text-left">Date</th>
                <th className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider py-3 text-left">Message</th>
                <th className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider py-3 text-center">Status</th>
                <th className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider py-3 text-right pr-4"></th>
              </tr>
            </thead>
            <tbody>
              {communications.map((com) => {
                const ch = channelConfig[com.channel] || channelConfig.email;
                const ChIcon = ch.icon;
                const st = statusConfig[com.status] || statusConfig.pending;
                const initials = getInitials(com.candidateName);
                const colorClass = getAvatarColor(com.candidateName);
                const isExpanded = expandedId === com.id;

                return (
                  <tbody key={com.id} className="border-b border-slate-50">
                    <tr
                      data-testid={`com-row-${com.id}`}
                      className="group border-b border-slate-50 transition-colors hover:bg-slate-50/50 cursor-pointer"
                      onClick={() => setExpandedId(isExpanded ? null : com.id)}
                    >
                      <td className="pl-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <Avatar className="h-7 w-7 flex-shrink-0">
                            <AvatarFallback className={`${colorClass} text-[9px] font-bold`}>{initials}</AvatarFallback>
                          </Avatar>
                          <p className="text-sm font-medium text-slate-900 truncate">{com.candidateName}</p>
                        </div>
                      </td>
                      <td className="py-3 text-center">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className={`inline-flex items-center justify-center h-7 w-7 rounded-md ${ch.cls}`}>
                              <ChIcon className="h-3.5 w-3.5" />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>{ch.label}</TooltipContent>
                        </Tooltip>
                      </td>
                      <td className="py-3">
                        <span className="text-[11px] text-slate-600">{com.messageType}</span>
                      </td>
                      <td className="py-3">
                        <span className="text-[11px] text-slate-500 whitespace-nowrap">{com.dateSent}</span>
                      </td>
                      <td className="py-3">
                        <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-1">{com.messageSummary}</p>
                      </td>
                      <td className="py-3 text-center">
                        <Badge variant="outline" className={`text-[10px] font-medium ${st.cls}`}>{st.label}</Badge>
                      </td>
                      <td className="py-3 text-right pr-4">
                        {isExpanded
                          ? <ChevronUp className="h-3.5 w-3.5 text-indigo-400 inline" />
                          : <ChevronDown className="h-3.5 w-3.5 text-slate-300 group-hover:text-slate-500 inline" />}
                      </td>
                    </tr>
                    {/* Expanded details */}
                    {isExpanded && (
                      <tr data-testid={`com-expanded-${com.id}`}>
                        <td colSpan={7} className="px-4 pb-4 pt-0">
                          <div className="ml-10 p-4 bg-slate-50 rounded-lg border border-slate-100 animate-fade-in-up space-y-3">
                            {/* Full Message */}
                            <div>
                              <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mb-1">Message Sent</p>
                              <p className="text-[12px] text-slate-600 leading-relaxed">{com.messageSummary}</p>
                            </div>
                            {/* Response */}
                            <div>
                              <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mb-1">Response</p>
                              <p className={`text-[12px] leading-relaxed ${com.response === "No response yet" ? "text-slate-400 italic" : "text-slate-600"}`}>
                                {com.response}
                              </p>
                              {com.responseDate && (
                                <p className="text-[10px] text-slate-400 mt-1">Responded on: {com.responseDate}</p>
                              )}
                            </div>
                            {/* Actions */}
                            <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                              <Button variant="outline" size="sm" data-testid={`resend-${com.id}`}
                                onClick={(e) => { e.stopPropagation(); onResend(com); }}
                                className="text-xs h-7 gap-1.5 text-amber-600 border-amber-200 hover:bg-amber-50">
                                <RotateCw className="h-3 w-3" /> Resend
                              </Button>
                              <Button variant="outline" size="sm" data-testid={`send-new-${com.id}`}
                                onClick={(e) => { e.stopPropagation(); onSendNew(com); }}
                                className="text-xs h-7 gap-1.5 text-indigo-600 border-indigo-200 hover:bg-indigo-50">
                                <Send className="h-3 w-3" /> Send New Message
                              </Button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </TooltipProvider>
  );
};
