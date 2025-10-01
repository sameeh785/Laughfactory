import { useTicketList } from "@/components/hooks/useTicketList";
import { Minus, Plus } from "lucide-react";
import React from "react";
import Loader from "@/components/ui/Loader";
import { cn } from "@/utils/common";
import { ITag } from "@/interface/shows";
import RichTextDisplay from "./RenderHtml";

export default function TicketList() {
  // hooks
  const {
    selectedShow,
    addQuantity,
    removeQuantity,
    setQuantity,
    loading,
    tickets,
    purchaseTicketList,
    alertMessage,
    checkifPoolIsFull,
  } = useTicketList();

  if (loading) {
    return (
      <div className="lg:col-span-2 flex justify-center items-center min-h-[200px]">
        <Loader size="lg" />
      </div>
    );
  }
 
  return (
    <div className="lg:col-span-2 space-y-6">
      <div className="w-full">
        <div>
          <div className="flex items-center justify-between md:gap-2 w-full flex-col md:flex-row">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {selectedShow?.title}
            </h2>
            {alertMessage && (
              <p className="font-2xl font-bold rounded-2xl bg-orange-500 text-white p-2 my-2">
                {alertMessage}
              </p>
            )}
          </div>
          <p className="text-gray-600 mb-4">{selectedShow?.date}</p>

          {selectedShow?.description ? (
            <RichTextDisplay
              htmlContent={selectedShow?.description}
              maxHeight={130}
              detailHref="https://laughfactory.vercel.app"
            />
          ) : null}
          <div className="flex items-center gap-2 flex-wrap">
            {Array?.isArray(selectedShow?.tags) && selectedShow.tags.map((tag: ITag) => (
              <div
                key={tag.id}
                className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg"
              >
                {tag.name}
              </div>
            ))}
          </div>
        </div>
        <div></div>
      </div>

      {tickets?.length === 0 && (
        <div className="text-center text-gray-500 text-lg mt-4">
          No tickets found for this show
        </div>
      )}
      {/* Ticket Options */}
      <div className="space-y-4">
        {tickets.map((ticket) => {
          const purchaseTicket = purchaseTicketList.find(
            (purchaseTicket) => purchaseTicket.ticket_id === ticket.ticket_id
          );
          if (
            ticket.is_special &&
            tickets
              ?.filter((ticket) => !ticket.is_special)
              .reduce((acc, ticket) => acc + ticket.available_quantity, 0) !== 0
          ) {
            return null;
          }
          const isPlusDisabled =
            ticket.available_quantity === 0 ||
            purchaseTicket?.quantity === ticket.available_quantity ||
            checkifPoolIsFull(purchaseTicket);
          const isMinusDisabled =  !purchaseTicket || purchaseTicket?.quantity === 0

          return (
            <div
              key={ticket.ticket_id}
              className={cn("border-2 border-orange-200 rounded-lg p-4", {
                "opacity-50 cursor-not-allowed":
                  ticket.available_quantity === 0,
                "border-4 border-orange-600 rounded-lg p-4": ticket.is_special,
              })}
            >
              {ticket.is_special && (
                <div className="w-[120px] text-center text-sm font-bold mb-2 bg-orange-600 text-white rounded-lg p-2">
                  Special
                </div>
              )}
              <div className="flex justify-between items-start mb-3">
                <div
                  className={cn({
                    "flex-1": ticket.available_quantity > 0,
                    "flex justify-between flex-1":
                      ticket.available_quantity === 0,
                  })}
                >
                  <h3 className="text-lg font-semibold text-gray-900">
                    {ticket.name}
                  </h3>
                  {ticket.available_quantity === 0 && (
                    <div className="text-center bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg p-2">
                      Sold Out
                    </div>
                  )}
                </div>
                {ticket.available_quantity > 0 && (
                  <div className="flex items-center gap-3 text-gray-500">
                    <button
                      onClick={() =>
                        removeQuantity(ticket.ticket_id.toString())
                      }
                      disabled={
                        isMinusDisabled
                      }
                      className={cn("w-8 h-8 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center", {
                        "opacity-50 cursor-not-allowed": isMinusDisabled
                      })}
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <input
                      type="number"
                      inputMode="numeric"
                      min={0}
                      max={ticket.available_quantity}
                      className="w-16 text-center font-medium border border-gray-300 rounded py-1 px-2 focus:outline-none focus:ring-2 focus:ring-orange-500 input-no-spinners"
                      value={(purchaseTicket?.quantity ?? 0) > 0 ? purchaseTicket?.quantity : ""}
                      placeholder="0"
                      onFocus={(e) => e.currentTarget.select()}
                      onKeyDown={(e) => {
                        if (["e","E","+","-","."].includes(e.key)) {
                          e.preventDefault()
                        }
                      }}
                      onChange={(e) => {
                        const next = Number(e.target.value)
                        setQuantity(ticket.ticket_id.toString(), Number.isFinite(next) ? next : 0)
                      }}
                      onBlur={(e) => {
                        if (e.target.value === "") {
                          setQuantity(ticket.ticket_id.toString(), 0)
                        }
                      }}
                    />
                    <button
                      onClick={() => addQuantity(ticket.ticket_id.toString())}
                      disabled={
                        isPlusDisabled
                      }
                      className={cn("w-8 h-8 border border-gray-300 rounded hover:bg-gray-50 flex items-center justify-center", {
                        "opacity-50 cursor-not-allowed": isPlusDisabled
                      })}
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>

              {ticket.available_quantity > 0 && (
                <p className="text-sm text-gray-600 mb-3">
                  {ticket.description}
                </p>
              )}

              <div className="text-lg font-bold text-gray-900">
                ${parseFloat(ticket.price).toFixed(2)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
