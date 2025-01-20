'use client'

import { useRef } from 'react'
import { Button } from "@/components/ui/button"
import { IProductSale } from '@/interfaces/salesInterfaces'

interface IPOSTicketGenerator {
  products: IProductSale[];
  total: string;
  date: string;
  transactionId: string;
  cashierName: string;
}


export const POSTicketGenerator = ({ products, total, date, transactionId, cashierName }: IPOSTicketGenerator) =>  {

  const printFrame = useRef<HTMLIFrameElement>(null)

  const generateTicketText = (): string => {
    let ticketText = `Purchase Ticket***
Date: ${date}
Transaction ID: ${transactionId}
Cashier: ${cashierName}

Products:
${products.map(product => 
  `${product.productName.slice(0, 20).padEnd(20)}       x${product.quantity.toString().padStart(2)}       $${product.price.toFixed(2).padStart(6)}\n---------------------------------------------`
).join('\n')}

Total: ${total}

*                                          *
*                                          *
*                                          *

--------------------------------------------
******************* FIRMA ******************
*                                          *
*                                          *
Thank you for your purchase!
***
`

    return ticketText
  }

  const printTicket = () => {
    const ticketText = generateTicketText()
    if (printFrame.current) {
      const frameDoc = printFrame.current.contentDocument
      if (frameDoc) {
        frameDoc.body.innerHTML = `<pre>${ticketText}</pre>`
        frameDoc.close()
        printFrame.current.contentWindow?.print()
      }
    }
  }

  return (
    <>
      <div className="mt-4 space-x-4">
        <Button onClick={printTicket}>
          Print Ticket
        </Button>
      </div>
      <iframe ref={printFrame} style={{ display: 'none' }} />
    </>
  )
}

