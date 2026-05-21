<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use App\Models\InvoiceItem;
use App\Models\Product;
use App\Models\StockLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class InvoiceController extends Controller
{
   public function index(Request $request)
{
    $query = Invoice::with(['customer', 'items.product'])
        ->latest();

    if ($request->user() && $request->user()->role === 'Customer') {
        $query->whereHas('customer', function ($customerQuery) use ($request) {
            $customerQuery->where('email', $request->user()->email);
        });
    }

    $invoices = $query->get();

    return response()->json([
        'status' => true,
        'data' => $invoices,
    ]);
}

    public function store(Request $request)
    {
        $request->validate([
            'customer_id' => 'required|exists:customers,id',
            'payment_status' => 'required|string',
            'discount' => 'nullable|numeric|min:0',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        try {
            DB::beginTransaction();

            $invoiceNumber = 'INV-' . date('Y') . '-' . str_pad(
                Invoice::count() + 1,
                3,
                '0',
                STR_PAD_LEFT
            );

            $subtotal = 0;
            $gstTotal = 0;
            $grandTotal = 0;

            $invoice = Invoice::create([
                'invoice_number' => $invoiceNumber,
                'customer_id' => $request->customer_id,
                'subtotal' => 0,
                'gst_total' => 0,
                'discount' => $request->discount ?? 0,
                'grand_total' => 0,
                'payment_status' => $request->payment_status,
                'invoice_date' => now()->toDateString(),
                'due_date' => now()->addDays(7)->toDateString(),
                'notes' => $request->notes,
                'created_by' => null,
            ]);

            foreach ($request->items as $item) {
                $product = Product::findOrFail($item['product_id']);

                if ($product->stock < $item['quantity']) {
                    DB::rollBack();

                    return response()->json([
                        'status' => false,
                        'message' => $product->name . ' has only ' . $product->stock . ' stock left',
                    ], 422);
                }

                $price = $product->selling_price;
                $qty = $item['quantity'];

                $itemSubtotal = $price * $qty;
                $gstAmount = ($itemSubtotal * $product->gst_percent) / 100;
                $itemTotal = $itemSubtotal + $gstAmount;

                InvoiceItem::create([
                    'invoice_id' => $invoice->id,
                    'product_id' => $product->id,
                    'quantity' => $qty,
                    'price' => $price,
                    'gst_percent' => $product->gst_percent,
                    'gst_amount' => $gstAmount,
                    'total' => $itemTotal,
                ]);

                $oldStock = $product->stock;
                $newStock = $oldStock - $qty;

                $product->update([
                    'stock' => $newStock,
                    'status' => $newStock < $product->min_stock_alert
                        ? 'Low Stock'
                        : 'Active',
                ]);

                StockLog::create([
                    'product_id' => $product->id,
                    'type' => 'Sale',
                    'quantity' => $qty,
                    'old_stock' => $oldStock,
                    'new_stock' => $newStock,
                    'notes' => 'Stock reduced for invoice ' . $invoiceNumber,
                ]);

                $subtotal += $itemSubtotal;
                $gstTotal += $gstAmount;
                $grandTotal += $itemTotal;
            }

            $finalTotal = $grandTotal - ($request->discount ?? 0);

            $invoice->update([
                'subtotal' => $subtotal,
                'gst_total' => $gstTotal,
                'grand_total' => $finalTotal,
            ]);

            DB::commit();

            return response()->json([
                'status' => true,
                'message' => 'Invoice created successfully',
                'data' => $invoice->load(['customer', 'items.product']),
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'status' => false,
                'message' => 'Invoice creation failed',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function show(Invoice $invoice)
    {
        return response()->json([
            'status' => true,
            'data' => $invoice->load(['customer', 'items.product']),
        ]);
    }

    public function update(Request $request, Invoice $invoice)
    {
        $request->validate([
            'payment_status' => 'required|string',
        ]);

        $invoice->update([
            'payment_status' => $request->payment_status,
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Invoice updated successfully',
            'data' => $invoice->load(['customer', 'items.product']),
        ]);
    }

    public function destroy(Invoice $invoice)
    {
        $invoice->delete();

        return response()->json([
            'status' => true,
            'message' => 'Invoice deleted successfully',
        ]);
    }
}