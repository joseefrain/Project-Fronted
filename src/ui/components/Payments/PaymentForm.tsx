import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface PaymentFormProps {
  paymentType: 'abono' | 'credito'
}

export function PaymentForm({ paymentType }: PaymentFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{paymentType === 'abono' ? 'Realizar Abono' : 'Realizar Pago de Cuota'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Monto a pagar</Label>
            <Input id="amount" type="number" placeholder={paymentType === 'abono' ? "Ingrese el monto del abono" : "Ingrese el monto de la cuota"} />
          </div>
          {paymentType === 'credito' && (
            <div className="space-y-2">
              <Label htmlFor="paymentDate">Fecha de pago</Label>
              <Input id="paymentDate" type="date" />
            </div>
          )}
          <Button type="submit" className="w-full">{paymentType === 'abono' ? 'Abonar' : 'Pagar Cuota'}</Button>
        </form>
      </CardContent>
    </Card>
  )
}

