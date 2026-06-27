"use client";

import React, { useState } from "react";
import {
  Calendar,
  Clock,
  Users,
  ChevronRight,
  X,
  Mail,
  Phone,
  Flag,
  CheckCircle2,
  Clock3,
  XCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

type Status = "Pending" | "Confirmed" | "Declined";

interface RequestItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  holes: string;
  players: number;
  avatar: string;
  status: Status;
  requestedAt: string;
}

const initialMockData: Record<Lowercase<Status>, RequestItem[]> = {
  pending: [
    {
      id: "REQ005",
      name: "Sarah Miller",
      email: "sarah.m@example.com",
      phone: "+1 (555) 123-4567",
      date: "Apr 25, 2026",
      time: "09:00 AM",
      holes: "18 holes",
      players: 4,
      avatar: "SM",
      status: "Pending",
      requestedAt: "Apr 20, 2026 at 10:30 AM",
    },
  ],
  confirmed: [
    {
      id: "REQ001",
      name: "David Chen",
      email: "david.chen@email.com",
      phone: "+1 (555) 456-7890",
      date: "Apr 19, 2026",
      time: "07:30 AM",
      holes: "9 holes",
      players: 2,
      avatar: "DC",
      status: "Confirmed",
      requestedAt: "Apr 13, 2026 at 2:00 PM",
    },
    {
      id: "REQ002",
      name: "Emma Wilson",
      email: "emma.w@example.com",
      phone: "+1 (555) 789-0123",
      date: "Apr 19, 2026",
      time: "11:00 AM",
      holes: "18 holes",
      players: 3,
      avatar: "EW",
      status: "Confirmed",
      requestedAt: "Apr 14, 2026 at 9:15 AM",
    },
    {
      id: "REQ003",
      name: "Robert Kim",
      email: "robert.k@example.com",
      phone: "+1 (555) 234-5678",
      date: "Apr 22, 2026",
      time: "07:00 AM",
      holes: "18 holes",
      players: 1,
      avatar: "RK",
      status: "Confirmed",
      requestedAt: "Apr 15, 2026 at 3:45 PM",
    },
    {
      id: "REQ004",
      name: "Grace Lee",
      email: "grace.l@example.com",
      phone: "+1 (555) 345-6789",
      date: "Apr 24, 2026",
      time: "08:00 AM",
      holes: "9 holes",
      players: 4,
      avatar: "GL",
      status: "Confirmed",
      requestedAt: "Apr 16, 2026 at 11:20 AM",
    },
  ],
  declined: [
    {
      id: "REQ006",
      name: "James Bond",
      email: "007@mi6.com",
      phone: "+44 (0) 20 7946 0000",
      date: "Apr 20, 2026",
      time: "06:00 AM",
      holes: "18 holes",
      players: 1,
      avatar: "JB",
      status: "Declined",
      requestedAt: "Apr 12, 2026 at 5:00 PM",
    },
  ],
};

const Requests = () => {
  const { user } = useAuth();
  const canDecide = user?.role === "club_owner";

  const [requestsData, setRequestsData] = useState(initialMockData);
  const [activeTab, setActiveTab] = useState<Lowercase<Status>>("confirmed");
  const [selectedRequest, setSelectedRequest] = useState<RequestItem | null>(initialMockData.confirmed[0]);

  const tabs = [
    { label: "Pending", count: requestsData.pending.length, value: "pending", badgeColor: "bg-orange-100 text-orange-600" },
    { label: "Confirmed", count: requestsData.confirmed.length, value: "confirmed", badgeColor: "bg-green-100 text-green-600" },
    { label: "Declined", count: requestsData.declined.length, value: "declined", badgeColor: "bg-red-100 text-red-600" },
  ] as const;

  const handleDecision = (request: RequestItem, decision: "Confirmed" | "Declined") => {
    const updated: RequestItem = { ...request, status: decision };
    const targetKey = decision.toLowerCase() as Lowercase<Status>;

    setRequestsData((prev) => ({
      ...prev,
      pending: prev.pending.filter((r) => r.id !== request.id),
      [targetKey]: [updated, ...prev[targetKey]],
    }));

    const remainingPending = requestsData.pending.filter((r) => r.id !== request.id);
    setSelectedRequest(remainingPending[0] ?? null);
  };

  return (
    <div className="flex flex-col gap-8 p-6 animate-in fade-in duration-500">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Booking Requests</h1>
        <p className="text-gray-500 mt-1">Review and manage player booking requests</p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 bg-white p-2 rounded-2xl shadow-sm border border-gray-100 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => {
              setActiveTab(tab.value);
              setSelectedRequest(requestsData[tab.value][0] || null);
            }}
            className={cn(
              "flex items-center gap-2 px-6 py-2.5 rounded-xl transition-all duration-200 font-medium",
              activeTab === tab.value
                ? "bg-[#142d22] text-white shadow-lg shadow-[#142d22]/20"
                : "text-gray-500 hover:bg-gray-50"
            )}
          >
            <span>{tab.label}</span>
            <span className={cn("px-2 py-0.5 rounded-full text-xs font-bold", tab.badgeColor)}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: List */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/50">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                {requestsData[activeTab].length} {activeTab} REQUESTS
              </span>
            </div>
            <div className="flex flex-col">
              {requestsData[activeTab].map((request) => (
                <button
                  key={request.id}
                  onClick={() => setSelectedRequest(request)}
                  className={cn(
                    "flex items-center gap-4 px-6 py-5 transition-all relative border-b border-gray-50 last:border-0",
                    selectedRequest?.id === request.id
                      ? "bg-[#f1fcf6] border-l-4 border-l-[#2ea268]"
                      : "hover:bg-gray-50 border-l-4 border-l-transparent"
                  )}
                >
                  <div className="w-12 h-12 rounded-full bg-[#eefaf3] flex items-center justify-center text-[#2ea268] font-bold shrink-0">
                    {request.avatar}
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="font-bold text-gray-900">{request.name}</h3>
                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-400">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{request.date.split(",")[0]}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{request.time}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" />
                        <span>{request.players}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5",
                      request.status === "Confirmed" ? "bg-green-50 text-green-600 border-green-100" :
                        request.status === "Pending" ? "bg-orange-50 text-orange-600 border-orange-100" :
                          "bg-red-50 text-red-600 border-red-100"
                    )}>
                      {request.status === "Confirmed" && <CheckCircle2 className="w-3 h-3" />}
                      {request.status === "Pending" && <Clock3 className="w-3 h-3" />}
                      {request.status === "Declined" && <XCircle className="w-3 h-3" />}
                      {request.status}
                    </span>
                    <ChevronRight className="w-5 h-5 text-gray-300" />
                  </div>
                </button>
              ))}
              {requestsData[activeTab].length === 0 && (
                <div className="p-12 text-center text-gray-400">
                  No requests found for this category.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Details */}
        <div className="lg:col-span-1">
          {selectedRequest ? (
            <div className="bg-white rounded-3xl shadow-xl shadow-black/5 border border-gray-100 flex flex-col h-fit sticky top-24">
              <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Request Details</h2>
                <button className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-8">
                {/* ID and Status */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-gray-300">#{selectedRequest.id}</span>
                  <span className={cn(
                    "px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5",
                    selectedRequest.status === "Confirmed" ? "bg-green-50 text-green-600 border-green-100" :
                      selectedRequest.status === "Pending" ? "bg-orange-50 text-orange-600 border-orange-100" :
                        "bg-red-50 text-red-600 border-red-100"
                  )}>
                    {selectedRequest.status === "Confirmed" && <CheckCircle2 className="w-3 h-3" />}
                    {selectedRequest.status === "Pending" && <Clock3 className="w-3 h-3" />}
                    {selectedRequest.status === "Declined" && <XCircle className="w-3 h-3" />}
                    {selectedRequest.status}
                  </span>
                </div>

                {/* Player Information */}
                <div className="bg-gray-50/50 p-6 rounded-2xl space-y-4">
                  <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">PLAYER INFORMATION</h4>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#eefaf3] flex items-center justify-center text-[#2ea268] font-bold text-lg">
                      {selectedRequest.avatar}
                    </div>
                    <span className="text-lg font-bold text-gray-900">{selectedRequest.name}</span>
                  </div>
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                      <Mail className="w-4 h-4 text-gray-300" />
                      <span>{selectedRequest.email}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                      <Phone className="w-4 h-4 text-gray-300" />
                      <span>{selectedRequest.phone}</span>
                    </div>
                  </div>
                </div>

                {/* Booking Details */}
                <div className="space-y-4">
                  <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">BOOKING DETAILS</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white border border-gray-100 p-4 rounded-xl shadow-sm">
                      <div className="flex items-center gap-2 text-gray-300 mb-1">
                        <Calendar className="w-4 h-4" />
                        <span className="text-[10px] font-bold uppercase">Date</span>
                      </div>
                      <p className="font-bold text-gray-900">{selectedRequest.date}</p>
                    </div>
                    <div className="bg-white border border-gray-100 p-4 rounded-xl shadow-sm">
                      <div className="flex items-center gap-2 text-gray-300 mb-1">
                        <Clock className="w-4 h-4" />
                        <span className="text-[10px] font-bold uppercase">Time</span>
                      </div>
                      <p className="font-bold text-gray-900">{selectedRequest.time}</p>
                    </div>
                    <div className="bg-white border border-gray-100 p-4 rounded-xl shadow-sm">
                      <div className="flex items-center gap-2 text-gray-300 mb-1">
                        <Flag className="w-4 h-4" />
                        <span className="text-[10px] font-bold uppercase">Holes</span>
                      </div>
                      <p className="font-bold text-gray-900">{selectedRequest.holes}</p>
                    </div>
                    <div className="bg-white border border-gray-100 p-4 rounded-xl shadow-sm">
                      <div className="flex items-center gap-2 text-gray-300 mb-1">
                        <Users className="w-4 h-4" />
                        <span className="text-[10px] font-bold uppercase">Players</span>
                      </div>
                      <p className="font-bold text-gray-900">{selectedRequest.players} players</p>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="pt-4 text-center">
                  <p className="text-[10px] text-gray-400 mb-6">Requested {selectedRequest.requestedAt}</p>
                  {canDecide && selectedRequest.status === "Pending" ? (
                    <div className="flex gap-3 pt-4 border-t border-gray-50">
                      <button
                        onClick={() => handleDecision(selectedRequest, "Declined")}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-all text-sm font-bold"
                      >
                        <XCircle className="w-4 h-4" />
                        Decline
                      </button>
                      <button
                        onClick={() => handleDecision(selectedRequest, "Confirmed")}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#2ea268] text-white hover:bg-[#288c5a] transition-all text-sm font-bold"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        Confirm
                      </button>
                    </div>
                  ) : selectedRequest.status === "Pending" ? (
                    <div className="py-4 border-t border-gray-50">
                      <p className="text-sm text-orange-600 font-bold">
                        Awaiting the club owner&apos;s decision.
                      </p>
                    </div>
                  ) : (
                    <div className="py-4 border-t border-gray-50">
                      <p className="text-sm">
                        This request has already been <span className={cn(
                          "font-bold",
                          selectedRequest.status === "Confirmed" ? "text-green-600" : "text-red-600"
                        )}>{selectedRequest.status.toLowerCase()}</span>.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400 border-2 border-dashed border-gray-100 rounded-3xl p-12 text-center">
              Select a request to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Requests;